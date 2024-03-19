import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDuplicateDto } from 'src/api/common/dto/duplicates/create-duplicates.dto';
import { Accounts } from '../../entities/accounts.entity';
import { ILike, Repository } from 'typeorm';
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
import { AccountsDto } from '../../dto/accounts.dto';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { ResolveDuplicateDto } from 'src/api/common/dto/duplicates/resolve-duplicates.dto';
import { HistoryService } from 'src/api/common/services/history.service';
import { HistoryReason } from 'src/common/enums/history_reason.enum';

@Injectable()
export class AccountsDuplicatesService extends HistoryService<DuplicatesHistory> {
  constructor(
    @Inject(REQUEST)
    private readonly dupRequest: UserRequest,
    @InjectRepository(Duplicates)
    private readonly dupRepository: Repository<Duplicates>,
    @InjectRepository(DuplicatesHistory)
    private readonly dupHistoryRepository: Repository<DuplicatesHistory>,
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) {
    super(dupHistoryRepository);
  }

  async create(duplicatable_id: bigint, createDto: CreateDuplicateDto) {
    try {
      const [record, duplicatable] = await Promise.all([
        this.accountRepository.exist({
          where: {
            id: createDto.record_id,
            is_archived: false,
          },
        }),
        this.accountRepository.exist({
          where: {
            id: duplicatable_id,
            is_archived: false,
          },
        }),
      ]);

      if (!record || !duplicatable) {
        return resError(
          'Account not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      if (
        await this.dupRepository.findOneBy({
          duplicatable_id,
          record_id: createDto.record_id,
          duplicatable_type: PolymorphicType.CRM_ACCOUNTS,
          tenant_id: this.dupRequest.user?.tenant?.id,
          is_archived: false,
        })
      ) {
        return resError(
          'Account duplicate already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      const instance = await this.dupRepository.save(
        this.dupRepository.create({
          ...createDto,
          duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_ACCOUNTS,
          tenant: this.dupRequest.user?.tenant,
          created_by: this.dupRequest.user,
        })
      );

      return resSuccess(
        'Account duplicate created successfully.',
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
        !(await this.accountRepository.exist({
          where: {
            id: filters.duplicatable_id,
            is_archived: false,
          },
        }))
      ) {
        return resError(
          'Account not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      let accountDupQuery = this.dupRepository
        .createQueryBuilder('dups')
        .innerJoinAndSelect('dups.created_by', 'created_by')
        .innerJoinAndSelect(
          'accounts',
          'record',
          'dups.record_id = record.id AND (record.is_archived = false)'
        )
        .innerJoinAndSelect(
          'accounts',
          'duplicatable',
          'dups.duplicatable_id = duplicatable.id AND (duplicatable.is_archived = false)'
        )
        .leftJoinAndSelect('record.recruiter', 'recruiter')
        .leftJoinAndSelect(
          'record.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect(
          'address',
          'addresses',
          "addresses.addressable_id = record.id AND (addresses.addressable_type = 'accounts')"
        )
        .select([
          'record.id AS id',
          'record.BECS_code AS becs_code',
          'record.name AS name',
          'addresses.city AS city',
          "trim(trailing ', ' from concat(addresses.address1, ', ', addresses.address2)) AS street_address",
          'collection_operation.name AS organization_level',
          "concat(recruiter.first_name, ' ', recruiter.last_name) AS recruiter",
        ])
        .groupBy(
          'dups.record_id, ' +
            'dups.duplicatable_id, ' +
            'record.id, ' +
            'addresses.address1, ' +
            'addresses.address2, ' +
            'addresses.city, ' +
            'recruiter.first_name, ' +
            'recruiter.last_name, ' +
            'collection_operation.name'
        )
        .where({
          ...(filters.is_resolved && { is_resolved: filters.is_resolved }),
          duplicatable_id: filters.duplicatable_id,
          duplicatable_type: PolymorphicType.CRM_ACCOUNTS,
          tenant: { id: this.dupRequest.user?.tenant?.id },
          is_archived: false,
        });

      if (filters.keyword) {
        let where = '';
        const params = [];

        where += 'record.name ILIKE :name';
        params['name'] = `%${filters.keyword}%`;

        accountDupQuery = accountDupQuery.andWhere(where, params);
      }

      if (sortBy?.sortName && sortBy?.sortOrder) {
        accountDupQuery = accountDupQuery.addOrderBy(
          sortBy.sortName,
          sortBy.sortOrder
        );
      }

      const count = await accountDupQuery.getCount();

      if (page && limit) {
        const { skip, take } = pagination(page, limit);
        accountDupQuery = accountDupQuery.limit(take).offset(skip);
      }

      const records = await accountDupQuery.getRawMany();

      return resSuccess(
        'Account duplicate records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async resolve(
    duplicatable_id: bigint,
    resolveDto: ResolveDuplicateDto,
    user: any
  ) {
    try {
      const duplicatable = await this.accountRepository.findOne({
        where: {
          id: duplicatable_id,
          is_archived: false,
        },
      });

      let record = null;
      if (resolveDto?.record_id) {
        record = await this.accountRepository.findOne({
          where: {
            id: resolveDto.record_id,
            is_archived: false,
          },
        });
      }

      if ((resolveDto?.record_id && !record) || !duplicatable) {
        return resError(
          'Account not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const where = {
        duplicatable_id,
        ...(resolveDto.record_id && { record_id: resolveDto.record_id }),
        duplicatable_type: PolymorphicType.CRM_ACCOUNTS,
        tenant_id: this.dupRequest.user?.tenant?.id,
        is_archived: false,
      };

      if (!(await this.dupRepository.exist({ where }))) {
        return resError(
          'Account duplicate not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      this.dupRepository.update(where, { is_resolved: true });

      const records = await this.dupRepository.find({
        where,
        relations: ['created_by', 'tenant'],
      });

      records.forEach(async (record) => {
        const historyRecordC: any = {
          ...record,
          history_reason: HistoryReason.C,
          is_resolved: true,
          created_by: user?.id,
        };

        const historyRecordD: any = {
          ...record,
          history_reason: HistoryReason.D,
          is_resolved: true,
          created_by: user?.id,
        };

        await this.createHistory(historyRecordC);
        await this.createHistory(historyRecordD);
      });

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

  async identifyDuplicates(createAccountDto: AccountsDto) {
    try {
      const duplicateFoundFirstCase = await this.addressRepository.findOne({
        where: {
          address1: createAccountDto?.mailing_address,
          zip_code: createAccountDto?.zip_code,
          city: createAccountDto?.city,
          state: createAccountDto?.state,
          addressable_type: PolymorphicType.CRM_ACCOUNTS,
        },
      });

      if (duplicateFoundFirstCase) {
        const account = await this.accountRepository.findOneBy({
          id: duplicateFoundFirstCase?.addressable_id,
        });

        return resSuccess(
          'Duplicate Found',
          ErrorConstants.Error,
          HttpStatus.CONFLICT,
          account
        );
      }

      const duplicateFoundSecondCaseFirstCondition =
        await this.addressRepository.findOne({
          where: {
            city: createAccountDto.city,
            state: createAccountDto.state,
            addressable_type: PolymorphicType.CRM_ACCOUNTS,
          },
        });

      const duplicateFoundSecondCaseSecondCondition =
        await this.accountRepository.findOne({
          where: {
            name: createAccountDto?.name,
          },
        });

      if (
        duplicateFoundSecondCaseFirstCondition &&
        duplicateFoundSecondCaseSecondCondition
      ) {
        const account = await this.accountRepository.findOneBy({
          id: duplicateFoundSecondCaseSecondCondition?.id,
        });

        return resSuccess(
          'Duplicate Found',
          ErrorConstants.Error,
          HttpStatus.CONFLICT,
          account
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
