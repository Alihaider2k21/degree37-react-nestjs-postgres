import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDuplicateDto } from 'src/api/common/dto/duplicates/create-duplicates.dto';
import { Staff } from '../../entities/staff.entity';
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
import { IdentifyDuplicateDto } from 'src/api/crm/contacts/staff/staffDuplicates/dto/identify-duplicates.dto';
import { ContactTypeEnum } from '../../../common/enums';
import { HistoryService } from 'src/api/common/services/history.service';
import { HistoryReason } from 'src/common/enums/history_reason.enum';

@Injectable()
export class StaffDuplicatesService extends HistoryService<DuplicatesHistory> {
  constructor(
    @Inject(REQUEST)
    private readonly dupRequest: UserRequest,
    @InjectRepository(Duplicates)
    private readonly dupRepository: Repository<Duplicates>,
    @InjectRepository(DuplicatesHistory)
    readonly dupHistoryRepository: Repository<DuplicatesHistory>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>
  ) {
    super(dupHistoryRepository);
  }

  async create(duplicatable_id: bigint, createDto: CreateDuplicateDto) {
    try {
      const [record, duplicatable] = await Promise.all([
        this.staffRepository.exist({
          where: {
            id: createDto.record_id,
            is_archived: false,
          },
        }),
        this.staffRepository.exist({
          where: {
            id: duplicatable_id,
            is_archived: false,
          },
        }),
      ]);

      if (!record || !duplicatable) {
        return resError(
          'Staff not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      if (
        await this.dupRepository.findOneBy({
          duplicatable_id,
          record_id: createDto.record_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_STAFF,
          tenant_id: this.dupRequest.user?.tenant?.id,
          is_archived: false,
        })
      ) {
        return resError(
          'Staff duplicate already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      const instance = await this.dupRepository.save(
        this.dupRepository.create({
          ...createDto,
          duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_STAFF,
          tenant: this.dupRequest.user?.tenant,
          created_by: this.dupRequest.user,
        })
      );

      return resSuccess(
        'Staff duplicate created successfully.',
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
        !(await this.staffRepository.exist({
          where: {
            id: filters.duplicatable_id,
            is_archived: false,
          },
        }))
      ) {
        return resError(
          'Staff not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      let staffDupQuery = this.dupRepository
        .createQueryBuilder('dups')
        .innerJoinAndSelect('dups.created_by', 'created_by')
        .innerJoinAndSelect(
          'staff',
          'record',
          'dups.record_id = record.id AND (record.is_archived = false)'
        )
        .innerJoinAndSelect(
          'staff',
          'duplicatable',
          'dups.duplicatable_id = duplicatable.id AND (duplicatable.is_archived = false)'
        )
        .leftJoinAndSelect(
          'duplicatable.collection_operation_id',
          'collection_operation'
        )
        .leftJoinAndSelect(
          'staff_roles_mapping',
          'staff_roles',
          'staff_roles.staff_id = duplicatable.id AND (staff_roles.is_archived = false AND staff_roles.is_primary = true)'
        )
        .leftJoinAndSelect(
          'contacts_roles',
          'role',
          'role.id = staff_roles.role_id AND (role.is_archived = false)'
        )
        .leftJoinAndSelect(
          'address',
          'addresses',
          "addresses.addressable_id = duplicatable.id AND (addresses.addressable_type = 'staff')"
        )
        .select([
          'record.id AS id',
          "concat(record.first_name, ' ', record.last_name) AS name",
          "trim(trailing ', ' from concat(addresses.address1, ', ', addresses.address2)) AS address",
          `STRING_AGG(role.name, ', ') AS "roles"`,
          'collection_operation.name AS organization_level',
          'record.is_active AS status',
        ])
        .groupBy(
          'dups.record_id, ' +
            'dups.duplicatable_id, ' +
            'record.id, ' +
            'staff_roles.staff_id, ' +
            'addresses.address1, ' +
            'addresses.address2, ' +
            'collection_operation.name'
        )
        .where({
          ...(filters.is_resolved && { is_resolved: filters.is_resolved }),
          duplicatable_id: filters.duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_CONTACTS_STAFF,
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

        staffDupQuery = staffDupQuery.andWhere(where, params);
      }

      if (sortBy.sortName && sortBy.sortOrder) {
        staffDupQuery = staffDupQuery.addOrderBy(
          sortBy.sortName,
          sortBy.sortOrder
        );
      }

      const count = await staffDupQuery.getCount();

      if (page && limit) {
        const { skip, take } = pagination(page, limit - 1);
        staffDupQuery = staffDupQuery.limit(take).offset(skip);
      }

      const records = await staffDupQuery.getRawMany();

      return resSuccess(
        'Staff duplicate records',
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
      const duplicatable = await this.staffRepository.findOne({
        where: {
          id: duplicatable_id,
          is_archived: false,
        },
      });

      let record = null;
      if (resolveDto?.record_id) {
        record = await this.staffRepository.findOne({
          where: {
            id: resolveDto.record_id,
            is_archived: false,
          },
        });
      }

      if ((resolveDto?.record_id && !record) || !duplicatable) {
        return resError(
          'Staff not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const where = {
        duplicatable_id,
        ...(resolveDto.record_id && { record_id: resolveDto.record_id }),
        duplicatable_type: PolymorphicType.CRM_CONTACTS_STAFF,
        tenant_id: this.dupRequest.user?.tenant?.id,
        is_archived: false,
      };

      if (!(await this.dupRepository.exist({ where }))) {
        return resError(
          'Staff duplicate not Found',
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

  async identify(identifyDto: IdentifyDuplicateDto) {
    try {
      if (
        !identifyDto?.birth_date &&
        !identifyDto?.mobile_phone &&
        !identifyDto?.work_phone
      ) {
        return resError(
          'One of the following must be provided: `birth date`, `mobile phone` and `work phone`.',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      let staffQuery = this.staffRepository
        .createQueryBuilder('staff')
        .leftJoinAndSelect(
          'contacts',
          'mobile_contact',
          `mobile_contact.contactable_id = staff.id AND (mobile_contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_STAFF}') AND (mobile_contact.is_archived = false) AND (mobile_contact.contact_type = ${ContactTypeEnum.MOBILE_PHONE})`
        )
        .leftJoinAndSelect(
          'contacts',
          'work_contact',
          `work_contact.contactable_id = staff.id AND (work_contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_STAFF}') AND (work_contact.is_archived = false) AND (work_contact.contact_type = ${ContactTypeEnum.WORK_PHONE})`
        )
        .select([
          'staff.id AS staff_id',
          'staff.created_at AS created_at',
          'birth_date AS birth_date',
          'mobile_contact.data AS mobile_phone',
          'work_contact.data AS work_phone',
        ])
        .where('staff.is_archived = false')
        .orderBy('staff.created_at', 'DESC');

      if (identifyDto?.staff_id) {
        staffQuery = staffQuery.andWhere({
          id: Not(identifyDto?.staff_id),
        });
      }

      let where = '';
      if (identifyDto?.birth_date) {
        where += `(staff.first_name ILIKE :first_name AND (staff.last_name ILIKE :last_name) AND (birth_date::date = :birth_date))`;
      }
      if (identifyDto?.mobile_phone) {
        where += where.length && ' OR ';
        where += `(staff.first_name ILIKE :first_name AND (staff.last_name ILIKE :last_name) AND (mobile_contact.data = :mobile_phone) AND (mobile_contact.data IS NOT NULL))`;
      }
      if (identifyDto?.work_phone) {
        where += where.length && ' OR ';
        where += `staff.first_name ILIKE :first_name AND (staff.last_name ILIKE :last_name) AND (work_contact.data = :work_phone) AND (work_contact.data IS NOT NULL)`;
      }
      staffQuery = staffQuery.andWhere(`(${where})`, {
        first_name: `%${identifyDto.first_name}%`,
        last_name: `%${identifyDto.last_name}%`,
        birth_date: identifyDto?.birth_date,
        mobile_phone: identifyDto.mobile_phone,
        work_phone: identifyDto.work_phone,
      });

      if (await staffQuery.getExists()) {
        const duplicateRecord = await staffQuery.getRawOne();
        return resError(
          'Staff duplicate record exists.',
          ErrorConstants.Error,
          HttpStatus.CONFLICT,
          duplicateRecord
        );
      }

      return resSuccess(
        'Staff duplicate record not exists.',
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
