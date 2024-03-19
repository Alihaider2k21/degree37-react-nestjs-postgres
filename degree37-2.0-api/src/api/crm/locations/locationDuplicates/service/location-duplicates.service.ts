import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDuplicateDto } from 'src/api/common/dto/duplicates/create-duplicates.dto';
import { CrmLocations } from '../../entities/crm-locations.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { Duplicates } from 'src/api/common/entities/duplicates/duplicates.entity';
import { DuplicatesHistory } from 'src/api/common/entities/duplicates/duplicates-history.entity';
import { FilterDuplicates } from 'src/api/common/interfaces/duplicates/query-duplicates.interface';
import { Sort } from 'src/common/interface/sort';
import { pagination } from 'src/common/utils/pagination';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { LocationsDto } from '../../dto/locations.dto';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { ResolveDuplicateDto } from 'src/api/common/dto/duplicates/resolve-duplicates.dto';

@Injectable()
export class CrmLocationsDuplicatesService {
  constructor(
    @Inject(REQUEST)
    private readonly dupRequest: UserRequest,
    @InjectRepository(Duplicates)
    private readonly dupRepository: Repository<Duplicates>,
    @InjectRepository(DuplicatesHistory)
    private readonly dupHistoryRepository: Repository<DuplicatesHistory>,
    @InjectRepository(CrmLocations)
    private readonly locationRepository: Repository<CrmLocations>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) {}

  async create(duplicatable_id: bigint, createDto: CreateDuplicateDto) {
    try {
      const [record, duplicatable] = await Promise.all([
        this.locationRepository.exist({
          where: {
            id: createDto.record_id,
            is_archived: false,
          },
        }),
        this.locationRepository.exist({
          where: {
            id: duplicatable_id,
            is_archived: false,
          },
        }),
      ]);

      if (!record || !duplicatable) {
        return resError(
          'Location not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      if (
        await this.dupRepository.findOneBy({
          duplicatable_id,
          record_id: createDto.record_id,
          duplicatable_type: PolymorphicType.CRM_LOCATIONS,
          tenant_id: this.dupRequest.user?.tenant?.id,
          is_archived: false,
        })
      ) {
        return resError(
          'Location duplicate already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      const instance = await this.dupRepository.save(
        this.dupRepository.create({
          ...createDto,
          duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_LOCATIONS,
          tenant: this.dupRequest.user?.tenant,
          created_by: this.dupRequest.user,
        })
      );

      return resSuccess(
        'Location duplicate created successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        instance
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async get(
    page: number,
    limit: number,
    sortBy: Sort,
    filters: FilterDuplicates
  ) {
    try {
      if (
        !(await this.locationRepository.exist({
          where: {
            id: filters.duplicatable_id,
            is_archived: false,
          },
        }))
      ) {
        return resError(
          'Location not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      let locationDupQuery = this.dupRepository
        .createQueryBuilder('dups')
        .innerJoinAndSelect('dups.created_by', 'created_by')
        .innerJoinAndSelect(
          'crm_locations',
          'record',
          'dups.record_id = record.id AND (record.is_archived = false)'
        )
        .innerJoinAndSelect(
          'crm_locations',
          'duplicatable',
          'dups.duplicatable_id = duplicatable.id AND (duplicatable.is_archived = false)'
        )
        .leftJoinAndSelect(
          'address',
          'addresses',
          "addresses.addressable_id = record.id AND (addresses.addressable_type = 'crm_locations')"
        )
        .select([
          'record.id AS id',
          'record.BECS_code AS becs_code',
          'record.name AS name',
          'record.room AS room',
          "trim(trailing ', ' from concat(addresses.address1, ', ', addresses.address2)) AS address",
        ])
        .groupBy(
          'dups.record_id, ' +
            'dups.duplicatable_id, ' +
            'record.id, ' +
            'addresses.address1, ' +
            'addresses.address2, ' +
            'addresses.city'
        )
        .where({
          ...(filters.is_resolved && { is_resolved: filters.is_resolved }),
          duplicatable_id: filters.duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_LOCATIONS,
          tenant: { id: this.dupRequest.user?.tenant?.id },
          is_archived: false,
        });

      if (filters.keyword) {
        let where = '';
        const params = [];

        where += 'record.name ILIKE :name';
        params['name'] = `%${filters.keyword}%`;

        locationDupQuery = locationDupQuery.andWhere(where, params);
      }

      if (sortBy?.sortName && sortBy?.sortOrder) {
        locationDupQuery = locationDupQuery.addOrderBy(
          sortBy.sortName,
          sortBy.sortOrder
        );
      }

      const count = await locationDupQuery.getCount();

      if (page && limit) {
        const { skip, take } = pagination(page, limit);
        locationDupQuery = locationDupQuery.limit(take).offset(skip);
      }

      const records = await locationDupQuery.getRawMany();

      return resSuccess(
        'Location duplicate records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  // async resolve(duplicatable_id: bigint, resolveDto: ResolveDuplicateDto) {
  //   try {
  //     const duplicatable = await this.locationRepository.findOne({
  //       where: {
  //         id: duplicatable_id,
  //         is_archived: false,
  //       },
  //     });

  //     let record = null;
  //     if (resolveDto?.record_id) {
  //       record = await this.locationRepository.findOne({
  //         where: {
  //           id: resolveDto.record_id,
  //           is_archived: false,
  //         },
  //       });
  //     }

  //     if ((resolveDto?.record_id && !record) || !duplicatable) {
  //       return resError(
  //         'Location not found',
  //         ErrorConstants.Error,
  //         HttpStatus.NOT_FOUND
  //       );
  //     }

  //     const where = {
  //       duplicatable_id,
  //       ...(resolveDto.record_id && { record_id: resolveDto.record_id }),
  //       duplicatable_type: PolymorphicType.CRM_LOCATIONS,
  //       tenant_id: this.dupRequest.user?.tenant?.id,
  //       is_archived: false,
  //     };

  //     if (!(await this.dupRepository.exist({ where }))) {
  //       return resError(
  //         'Location duplicate not Found',
  //         ErrorConstants.Error,
  //         HttpStatus.NOT_FOUND
  //       );
  //     }

  //     await this.dupRepository.update(where, { is_resolved: true });

  //     return resSuccess(
  //       'Resolved Successfully.',
  //       SuccessConstants.SUCCESS,
  //       HttpStatus.OK,
  //       null
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     return resError(error.message, ErrorConstants.Error, error.status);
  //   }
  // }

  async identifyDuplicates(id: any, createLocationDto: LocationsDto) {
    try {
      const duplicateFoundFirstCaseFirstCondition =
        await this.addressRepository.findOne({
          where: {
            address1: createLocationDto?.address.address1,
            zip_code: createLocationDto?.address.zip_code,
            city: createLocationDto?.address.city,
            state: createLocationDto?.address.state,
            addressable_type: PolymorphicType.CRM_LOCATIONS,
            ...(id && { addressable_id: Not(id) }),
          },
        });

      const duplicateFoundFirstCaseSecondCondition =
        await this.locationRepository.findOne({
          where: {
            ...(id && { id: Not(id) }),
            room: createLocationDto?.room,
            is_archived: false,
          },
        });

      if (
        duplicateFoundFirstCaseFirstCondition &&
        duplicateFoundFirstCaseSecondCondition
      ) {
        return resSuccess(
          'Duplicate Found',
          ErrorConstants.Error,
          HttpStatus.CONFLICT,
          duplicateFoundFirstCaseSecondCondition
        );
      }

      return resSuccess(
        'Duplicate Not Found',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        ''
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
