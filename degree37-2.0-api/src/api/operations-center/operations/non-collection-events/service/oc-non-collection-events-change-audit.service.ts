import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { resError } from 'src/api/system-configuration/helpers/response';
import { NonCollectionEvents } from '../entities/oc-non-collection-events.entity';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { GetNonCollectionEventsChangeAuditInterface } from '../interface/get-non-collection-events.interface';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { NonCollectionEventsHistory } from '../entities/oc-non-collection-events-history.entity';

dotenv.config();

@Injectable()
export class OcNonCollectionEventsChangeAuditService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(NonCollectionEvents)
    private readonly nonCollectionEventsRepository: Repository<NonCollectionEvents>,
    @InjectRepository(NonCollectionEventsHistory)
    private readonly nonCollectionEventsHistoryRepository: Repository<NonCollectionEventsHistory>
  ) {}

  async getChangeAudit(id, params: GetNonCollectionEventsChangeAuditInterface) {
    try {
      const { page, sortBy, sortOrder, limit } = params;
      const nonCollectionEventData =
        await this.nonCollectionEventsRepository.find({
          relations: [],
          where: {
            id: id,
            tenant_id: { id: this.request?.user?.tenant?.id } as any,
          },
        });

      if (!nonCollectionEventData) {
        throw new HttpException(
          'Non collection event not found',
          HttpStatus.GONE
        );
      }
      const [data, count] =
        await this.nonCollectionEventsHistoryRepository.findAndCount({
          where: {
            id: id,
            tenant_id: this.request?.user?.tenant?.id,
            changes_field: Not(IsNull()),
          },
          select: [
            'changes_from',
            'changes_field',
            'changes_to',
            'created_by',
            'changed_when',
            'created_at',
          ],
          order:
            sortBy && sortOrder
              ? { [sortBy]: sortOrder.toUpperCase() }
              : { rowkey: 'DESC' },
          take: limit,
          skip: (page - 1) * limit,
        });

      return {
        status: HttpStatus.OK,
        message: 'Change Audit Fetched Successfully',
        count: count,
        data: data,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Non Collection events change audit >>>>>>>>>>>>>>>>>>>>>>>>>'
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
