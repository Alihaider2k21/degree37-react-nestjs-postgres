import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  ILike,
  Raw,
  Repository,
  DataSource,
  In,
  QueryRunner,
  EntityNotFoundError,
  EntityTarget,
  getRepository,
  createQueryBuilder,
  LessThan,
  Between,
  Any,
} from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';

import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
// import { GetAllTasksInterface } from '../interface/tasks-query.interface';
import moment from 'moment';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { NonCollectionEvents } from '../entities/oc-non-collection-events.entity';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { GetAllNonCollectionEventsInterface } from '../interface/get-non-collection-events.interface';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { CrmNonCollectionProfiles } from 'src/api/crm/crm-non-collection-profiles/entities/crm-non-collection-profiles.entity';
import { appliesToEnum } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/enums/operation-status.enum';

dotenv.config();

@Injectable()
export class OcNonCollectionEventsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NonCollectionEvents)
    private readonly nonCollectionEventsRepository: Repository<NonCollectionEvents>,
    @InjectRepository(OperationsStatus)
    private readonly operationsStatusRepository: Repository<OperationsStatus>,
    @InjectRepository(CrmNonCollectionProfiles)
    private readonly crmNonCollectionProfilesRepository: Repository<CrmNonCollectionProfiles>
  ) {}

  async findAll(id, user: any, params: GetAllNonCollectionEventsInterface) {
    try {
      const CrmNonCollectionProfilesData =
        await this.crmNonCollectionProfilesRepository.find({
          where: {
            id: id,
          },
        });
      if (!CrmNonCollectionProfilesData) {
        throw new HttpException(
          'Crm non collection profile not found',
          HttpStatus.GONE
        );
      }
      let { page, limit } = params;

      limit = limit ? +limit : +process.env.PAGE_SIZE;

      page = page ? +page : 1;
      let where: any = {
        is_archived: false,
        non_collection_profile_id: {
          id: id,
        },
      };
      if (params?.selected_date) {
        const startDate = moment(new Date(params.selected_date)).startOf('day');
        const endDate = moment(new Date(params.selected_date)).endOf('day');

        console.log({ startDate, endDate });
        where = {
          ...where,
          date: Between(startDate, endDate),
        };
      }
      if (params?.status) {
        where = {
          ...where,
          status_id: {
            name: params?.status,
          },
        };
      }
      if (params?.keyword) {
        where = {
          ...where,
          event_name: ILike(`%${params?.keyword}%`),
        };
      }
      let order: any = { id: 'DESC' };

      if (params.sortBy) {
        const orderDirection = params.sortOrder || 'DESC';
        if (params.sortBy == 'status_id') {
          order = { status_id: { name: orderDirection } };
        } else if (params.sortBy == 'location') {
          order = { location_id: { name: orderDirection } };
        } else {
          const orderBy = params.sortBy;
          order = { [orderBy]: orderDirection };
        }
      }
      const [response, count] =
        await this.nonCollectionEventsRepository.findAndCount({
          where,
          relations: [
            'non_collection_profile_id',
            'status_id',
            'location_id',
            'tenant_id',
          ],
          take: limit,
          skip: (page - 1) * limit,
          order,
        });
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Non collection events fetched successfully',
        status_code: HttpStatus.CREATED,
        total_records: count,
        data: response,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Non Collection events  findAll >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(
        error.message,
        ErrorConstants.Error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async status(user: any) {
    try {
      const where: any = {
        applies_to: [appliesToEnum.NCEs],
        tenant: {
          id: user.tenant.id,
        },
      };
      const response = await this.operationsStatusRepository.find({
        where,
        relations: ['tenant'],
      });
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Status fetched successfully',
        status_code: HttpStatus.CREATED,
        data: response,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Non Collection events status >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(
        error.message,
        ErrorConstants.Error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
