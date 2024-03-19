import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditFields } from '../entities/audit-fields.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from '../../../../../../common/interface/request';

@Injectable({ scope: Scope.REQUEST })
export class AuditFieldsService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(AuditFields)
    private readonly auditFieldRepository: Repository<AuditFields>
  ) {}

  async getAllAuditFields(): Promise<any> {
    console.log('service');

    try {
      const where = {
        tenant_id: this.request.user?.tenant?.id,
      };
      const [response, count] = await this.auditFieldRepository.findAndCount({
        where,
      });
      return {
        status: HttpStatus.OK,
        message: 'Products Fetched Succesfuly',
        count: count,
        data: response,
      };
    } catch (err) {
      console.error(err);

      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
