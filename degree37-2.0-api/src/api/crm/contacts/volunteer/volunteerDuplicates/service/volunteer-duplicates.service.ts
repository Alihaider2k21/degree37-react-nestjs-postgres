import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDuplicateDto } from 'src/api/common/dto/duplicates/create-duplicates.dto';
import { CRMVolunteer } from '../../entities/crm-volunteer.entity';
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
import { ResolveDuplicateDto } from 'src/api/common/dto/duplicates/resolve-duplicates.dto';
import { IdentifyVolunteerDuplicateDto } from 'src/api/crm/contacts/volunteer/volunteerDuplicates/dto/identify-volunteer-duplicates.dto';
import { ContactTypeEnum } from '../../../common/enums';
import { HistoryService } from 'src/api/common/services/history.service';
import { HistoryReason } from 'src/common/enums/history_reason.enum';

@Injectable()
export class VolunteerDuplicatesService extends HistoryService<DuplicatesHistory> {
  constructor(
    @Inject(REQUEST)
    private readonly dupRequest: UserRequest,
    @InjectRepository(Duplicates)
    private readonly dupRepository: Repository<Duplicates>,
    @InjectRepository(DuplicatesHistory)
    readonly dupHistoryRepository: Repository<DuplicatesHistory>,
    @InjectRepository(CRMVolunteer)
    private readonly volunteerRepository: Repository<CRMVolunteer>
  ) {
    super(dupHistoryRepository);
  }

  async create(duplicatable_id: bigint, createDto: CreateDuplicateDto) {
    try {
      const [record, duplicatable] = await Promise.all([
        this.volunteerRepository.exist({
          where: {
            id: createDto.record_id,
            is_archived: false,
          },
        }),
        this.volunteerRepository.exist({
          where: {
            id: duplicatable_id,
            is_archived: false,
          },
        }),
      ]);

      if (!record || !duplicatable) {
        return resError(
          'Volunteer not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      if (
        await this.dupRepository.findOneBy({
          duplicatable_id,
          record_id: createDto.record_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_VOLUNTEERS,
          tenant_id: this.dupRequest.user?.tenant?.id,
          is_archived: false,
        })
      ) {
        return resError(
          'Volunteer duplicate already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      const instance = await this.dupRepository.save(
        this.dupRepository.create({
          ...createDto,
          duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_VOLUNTEERS,
          tenant: this.dupRequest.user?.tenant,
          created_by: this.dupRequest.user,
        })
      );

      return resSuccess(
        'Volunteer duplicate created successfully.',
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
        !(await this.volunteerRepository.exist({
          where: {
            id: filters.duplicatable_id,
            is_archived: false,
          },
        }))
      ) {
        return resError(
          'Volunteer not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      let volunteerDupQuery = this.dupRepository
        .createQueryBuilder('dups')
        .innerJoinAndSelect('dups.created_by', 'created_by')
        .innerJoinAndSelect(
          'crm_volunteer',
          'record',
          'dups.record_id = record.id AND (record.is_archived = false)'
        )
        .innerJoinAndSelect(
          'crm_volunteer',
          'duplicatable',
          'dups.duplicatable_id = duplicatable.id AND (duplicatable.is_archived = false)'
        )
        .leftJoinAndSelect(
          'address',
          'addresses',
          "addresses.addressable_id = duplicatable.id AND (addresses.addressable_type = 'staff')"
        )
        .leftJoinAndSelect(
          'contacts',
          'work_phone',
          `work_phone.contactable_id = record.id AND (work_phone.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND work_phone.contact_type = '${ContactTypeEnum.WORK_PHONE}')`
        )
        .leftJoinAndSelect(
          'contacts',
          'mobile_phone',
          `mobile_phone.contactable_id = record.id AND (mobile_phone.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND mobile_phone.contact_type = '${ContactTypeEnum.MOBILE_PHONE}')`
        )
        .select([
          'record.id AS id',
          "concat(record.first_name, ' ', record.last_name) AS name",
          "concat(trim(trailing ', ' from concat(addresses.address1, ', ', addresses.address2)), ', ', addresses.city, ', ', addresses.zip_code) AS address",
          'work_phone.data AS work_phone',
          'mobile_phone.data AS mobile_phone',
          'record.is_active AS status',
        ])
        .where({
          ...(filters.is_resolved && { is_resolved: filters.is_resolved }),
          duplicatable_id: filters.duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_VOLUNTEERS,
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

        volunteerDupQuery = volunteerDupQuery.andWhere(where, params);
      }

      if (sortBy.sortName && sortBy.sortOrder) {
        volunteerDupQuery = volunteerDupQuery.addOrderBy(
          sortBy.sortName,
          sortBy.sortOrder
        );
      }

      const count = await volunteerDupQuery.getCount();

      if (page && limit) {
        const { skip, take } = pagination(page, limit - 1);
        volunteerDupQuery = volunteerDupQuery.limit(take).offset(skip);
      }

      const records = await volunteerDupQuery.getRawMany();

      return resSuccess(
        'Volunteer duplicate records',
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
      const duplicatable = await this.volunteerRepository.findOne({
        where: {
          id: duplicatable_id,
          is_archived: false,
        },
      });

      let record = null;
      if (resolveDto?.record_id) {
        record = await this.volunteerRepository.findOne({
          where: {
            id: resolveDto.record_id,
            is_archived: false,
          },
        });
      }

      if ((resolveDto?.record_id && !record) || !duplicatable) {
        return resError(
          'Volunteer not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const where = {
        duplicatable_id,
        ...(resolveDto.record_id && { record_id: resolveDto.record_id }),
        duplicatable_type: PolymorphicType.CRM_CONTACTS_VOLUNTEERS,
        tenant_id: this.dupRequest.user?.tenant?.id,
        is_archived: false,
      };

      if (!(await this.dupRepository.exist({ where }))) {
        return resError(
          'Volunteer duplicate not Found',
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

  async identify(identifyDto: IdentifyVolunteerDuplicateDto) {
    try {
      if (
        !identifyDto?.address &&
        !identifyDto?.mobile_phone &&
        !identifyDto?.work_phone
      ) {
        return resError(
          'One of the following must be provided: `address`, `mobile phone` and `work phone`.',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      let volunteerQuery = this.volunteerRepository
        .createQueryBuilder('volunteer')
        .leftJoinAndSelect(
          'contacts',
          'mobile_contact',
          `mobile_contact.contactable_id = volunteer.id AND (mobile_contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}') AND (mobile_contact.is_archived = false) AND (mobile_contact.contact_type = ${ContactTypeEnum.MOBILE_PHONE})`
        )
        .leftJoinAndSelect(
          'contacts',
          'work_contact',
          `work_contact.contactable_id = volunteer.id AND (work_contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}') AND (work_contact.is_archived = false) AND (work_contact.contact_type = ${ContactTypeEnum.WORK_PHONE})`
        )
        .leftJoinAndSelect(
          'address',
          'addresses',
          `addresses.addressable_id = volunteer.id AND (addresses.addressable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}')`
        )
        .select([
          'volunteer.id AS volunteer_id',
          'volunteer.created_at AS created_at',
          'addresses.address1 AS address1',
          'addresses.address2 AS address2',
          'addresses.city AS city',
          'addresses.state AS state',
          'addresses.zip_code AS zip_code',
          'mobile_contact.data AS mobile_phone',
          'work_contact.data AS work_phone',
        ])
        .where('volunteer.is_archived = false')
        .orderBy('volunteer.created_at', 'DESC');

      if (identifyDto?.volunteer_id) {
        volunteerQuery = volunteerQuery.andWhere({
          id: Not(identifyDto?.volunteer_id),
        });
      }

      const params = {
        first_name: `%${identifyDto.first_name}%`,
        last_name: `%${identifyDto.last_name}%`,
        mobile_phone: identifyDto.mobile_phone,
        work_phone: identifyDto.work_phone,
      };
      let where = '';

      if (identifyDto?.address) {
        where += `(volunteer.first_name ILIKE :first_name AND (volunteer.last_name ILIKE :last_name) AND (`;
        Object.entries(identifyDto.address).forEach(([key, value], index) => {
          where += `addresses.${key} ILIKE :${key}`;
          if (index < Object.entries(identifyDto.address).length - 1)
            where += ' AND ';
          params[key] = value;
        });
        where += '))';
      }
      if (identifyDto?.mobile_phone) {
        where += where.length && ' OR ';
        where += `(volunteer.first_name ILIKE :first_name AND (volunteer.last_name ILIKE :last_name) AND (mobile_contact.data = :mobile_phone) AND (mobile_contact.data IS NOT NULL))`;
      }
      if (identifyDto?.work_phone) {
        where += where.length && ' OR ';
        where += `(volunteer.first_name ILIKE :first_name AND (volunteer.last_name ILIKE :last_name) AND (work_contact.data = :work_phone) AND (work_contact.data IS NOT NULL))`;
      }
      volunteerQuery = volunteerQuery.andWhere(`(${where})`, params);

      if (await volunteerQuery.getExists()) {
        const duplicateRecord = await volunteerQuery.getRawOne();
        return resError(
          'Volunteer duplicate record exists.',
          ErrorConstants.Error,
          HttpStatus.CONFLICT,
          duplicateRecord
        );
      }

      return resSuccess(
        'Volunteer duplicate record not exists.',
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
