import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDuplicateDto } from 'src/api/common/dto/duplicates/create-duplicates.dto';
import { Donors } from '../../entities/donors.entity';
import { Not, Repository } from 'typeorm';
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
import { IdentifyDonorDuplicateDto } from 'src/api/crm/contacts/donor/donorDuplicates/dto/identify-donor-duplicates.dto';
import { ContactTypeEnum } from '../../../common/enums';
import { HistoryService } from 'src/api/common/services/history.service';
import { ResolveDuplicateDto } from 'src/api/common/dto/duplicates/resolve-duplicates.dto';
import { HistoryReason } from 'src/common/enums/history_reason.enum';

@Injectable()
export class DonorDuplicatesService extends HistoryService<DuplicatesHistory> {
  constructor(
    @Inject(REQUEST)
    private readonly dupRequest: UserRequest,
    @InjectRepository(Duplicates)
    private readonly dupRepository: Repository<Duplicates>,
    @InjectRepository(DuplicatesHistory)
    readonly dupHistoryRepository: Repository<DuplicatesHistory>,
    @InjectRepository(Donors)
    private readonly donorRepository: Repository<Donors>
  ) {
    super(dupHistoryRepository);
  }

  async create(duplicatable_id: bigint, createDto: CreateDuplicateDto) {
    try {
      const [record, duplicatable] = await Promise.all([
        this.donorRepository.exist({
          where: {
            id: createDto.record_id,
            is_archived: false,
          },
        }),
        this.donorRepository.exist({
          where: {
            id: duplicatable_id,
            is_archived: false,
          },
        }),
      ]);

      if (!record || !duplicatable) {
        return resError(
          'Donor not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      if (
        await this.dupRepository.findOneBy({
          duplicatable_id,
          record_id: createDto.record_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_DONORS,
          tenant_id: this.dupRequest.user?.tenant?.id,
          is_archived: false,
        })
      ) {
        return resError(
          'Donor duplicate already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      const instance = await this.dupRepository.save(
        this.dupRepository.create({
          ...createDto,
          duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_DONORS,
          tenant: this.dupRequest.user?.tenant,
          created_by: this.dupRequest.user,
        })
      );

      return resSuccess(
        'Donor duplicate created successfully.',
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
        !(await this.donorRepository.exist({
          where: {
            id: filters.duplicatable_id,
            is_archived: false,
          },
        }))
      ) {
        return resError(
          'Donor not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      let donorDupQuery = this.dupRepository
        .createQueryBuilder('dups')
        .innerJoinAndSelect('dups.created_by', 'created_by')
        .innerJoinAndSelect(
          'donors',
          'record',
          'dups.record_id = record.id AND (record.is_archived = false)'
        )
        .innerJoinAndSelect(
          'donors',
          'duplicatable',
          'dups.duplicatable_id = duplicatable.id AND (duplicatable.is_archived = false)'
        )
        .leftJoinAndSelect(
          'address',
          'addresses',
          `addresses.addressable_id = duplicatable.id AND (addresses.addressable_type = '${PolymorphicType.CRM_CONTACTS_DONORS}')`
        )
        .leftJoinAndSelect(
          'contacts',
          'phone',
          `phone.contactable_id = record.id AND (phone.is_primary = true AND phone.contactable_type = '${PolymorphicType.CRM_CONTACTS_DONORS}' AND phone.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND phone.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')`
        )
        .leftJoinAndSelect(
          'contacts',
          'email',
          `email.contactable_id = record.id AND (email.is_primary = true AND email.contactable_type = '${PolymorphicType.CRM_CONTACTS_DONORS}' AND email.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND email.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')`
        )
        .select([
          'record.id AS id',
          "concat(record.first_name, ' ', record.last_name) AS name",
          "trim(trailing ', ' from concat(addresses.address1, ', ', addresses.address2)) AS address",
          'addresses.city AS city',
          'phone.data AS primary_phone',
          'email.data AS primary_email',
          'record.is_active AS status',
        ])
        .where({
          ...(filters.is_resolved && { is_resolved: filters.is_resolved }),
          duplicatable_id: filters.duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_DONORS,
          tenant: { id: this.dupRequest.user?.tenant?.id },
          is_archived: false,
        });

      if (filters.keyword) {
        let where = '';
        const params = [];

        const [first_name, ...last_name] = filters.keyword.split(' ');
        if (first_name) {
          where += 'duplicatable.first_name ILIKE :first_name';
          params['first_name'] = `%${first_name}%`;
        }
        if (first_name && last_name.length) where += ' AND ';
        if (last_name.length) {
          where += 'duplicatable.last_name ILIKE :last_name';
          params['last_name'] = `%${last_name.join(' ')}%`;
        }

        donorDupQuery = donorDupQuery.andWhere(where, params);
      }

      if (sortBy.sortName && sortBy.sortOrder) {
        donorDupQuery = donorDupQuery.addOrderBy(
          sortBy.sortName,
          sortBy.sortOrder
        );
      }

      const count = await donorDupQuery.getCount();

      if (page && limit) {
        const { skip, take } = pagination(page, limit - 1);
        donorDupQuery = donorDupQuery.limit(take).offset(skip);
      }

      const records = await donorDupQuery.getRawMany();

      return resSuccess(
        'Donor duplicate records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async resolve(duplicatable_id: bigint, resolveDto: ResolveDuplicateDto) {
    try {
      const duplicatable = await this.donorRepository.findOne({
        where: {
          id: duplicatable_id,
          is_archived: false,
        },
      });

      let record = null;
      if (resolveDto?.record_id) {
        record = await this.donorRepository.findOne({
          where: {
            id: resolveDto.record_id,
            is_archived: false,
          },
        });
      }

      if ((resolveDto?.record_id && !record) || !duplicatable) {
        return resError(
          'Donor not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const where = {
        duplicatable_id,
        ...(resolveDto.record_id && { record_id: resolveDto.record_id }),
        duplicatable_type: PolymorphicType.CRM_CONTACTS_DONORS,
        tenant_id: this.dupRequest.user?.tenant?.id,
        is_archived: false,
      };

      if (!(await this.dupRepository.exist({ where }))) {
        return resError(
          'Donor duplicate not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const records = await this.dupRepository.find({
        where,
        relations: ['created_by', 'tenant'],
      });

      await Promise.all([
        this.createHistorys(
          records.map((record) => ({
            ...record,
            history_reason: HistoryReason.D,
            created_by: record.created_by.id,
          }))
        ),
        this.dupRepository.update(where, { is_resolved: true }),
      ]);

      return resSuccess(
        'Resolved Successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async identify(identifyDto: IdentifyDonorDuplicateDto) {
    try {
      if (!identifyDto?.birth_date && !identifyDto?.address) {
        return resError(
          'One of the following must be provided: `birth date` and `address`.',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      let donorQuery = this.donorRepository
        .createQueryBuilder('donor')
        .leftJoinAndSelect(
          'address',
          'addresses',
          `addresses.addressable_id = donor.id AND (addresses.addressable_type = '${PolymorphicType.CRM_CONTACTS_DONORS}')`
        )
        .select([
          'donor.id AS donor_id',
          'donor.created_at AS created_at',
          'donor.birth_date AS birth_date',
          'addresses.address1 AS address1',
          'addresses.address2 AS address2',
          'addresses.city AS city',
          'addresses.state AS state',
          'addresses.zip_code AS zip_code',
        ])
        .where('donor.is_archived = false')
        .orderBy('donor.created_at', 'DESC');

      if (identifyDto?.donor_id) {
        donorQuery = donorQuery.andWhere({
          id: Not(identifyDto?.donor_id),
        });
      }

      const params = {
        first_name: `%${identifyDto.first_name}%`,
        last_name: `%${identifyDto.last_name}%`,
        birth_date: identifyDto.birth_date,
      };
      let where = '';

      if (identifyDto?.address) {
        where +=
          '(donor.first_name ILIKE :first_name AND (donor.last_name ILIKE :last_name) AND (';
        Object.entries(identifyDto.address).forEach(([key, value], index) => {
          where += `addresses.${key} ILIKE :${key}`;
          if (index < Object.entries(identifyDto.address).length - 1)
            where += ' AND ';
          params[key] = value;
        });
        where += '))';
      }
      if (identifyDto?.birth_date) {
        where += where.length && ' OR ';
        where += `(donor.first_name ILIKE :first_name AND (donor.last_name ILIKE :last_name) AND (birth_date::date = :birth_date))`;
      }
      donorQuery = donorQuery.andWhere(`(${where})`, params);

      if (await donorQuery.getExists()) {
        const duplicateRecord = await donorQuery.getRawOne();
        return resError(
          'Donor duplicate record exists.',
          ErrorConstants.Error,
          HttpStatus.CONFLICT,
          duplicateRecord
        );
      }

      return resSuccess(
        'Donor duplicate record not exists.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
