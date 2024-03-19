import { Approval } from '../entity/approvals.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateAprovalsDto } from '../dto/create-promotion.dto';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { resError } from '../../../../../helpers/response';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { AprovalsHistory } from '../entity/approvals-history.entity';

import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

@Injectable({ scope: Scope.REQUEST })
export class ApprovalsService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Approval)
    private readonly approvalsRespistory: Repository<Approval>,
    @InjectRepository(AprovalsHistory)
    private readonly approvalsHistory: Repository<AprovalsHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {}

  async create(createCreateDto: CreateAprovalsDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      const approvalsEntity = new Approval();
      approvalsEntity.email = createCreateDto.email;
      approvalsEntity.marketing_materials = createCreateDto.marketing_materials;
      approvalsEntity.promotional_items = createCreateDto.promotional_items;
      approvalsEntity.sms_texting = createCreateDto.sms_texting;
      approvalsEntity.tele_recruitment = createCreateDto.tele_recruitment;
      approvalsEntity.created_by = this.request.user;
      approvalsEntity.tenant = this.request.user.tenant;

      const savedApprovals = await queryRunner.manager.save(approvalsEntity);

      return {
        status: 'success',
        response: 'Approvals Created.',
        code: 201,
        data: {
          savedApprovals,
        },
      };
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(): Promise<any> {
    try {
      const approval = await this.approvalsRespistory.findOne({
        where: {
          created_by_id: this.request.user.id,
          tenant_id: this.request.user.tenant.id,
        },
      });

      if (!approval) {
        return new HttpException('Approval not found', HttpStatus.BAD_REQUEST);
      }

      return {
        status: HttpStatus.OK,
        message: 'Approval Fetched.',
        data: {
          ...approval,
        },
      };
    } catch (e) {
      console.log(e);

      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(createAprovalsDto: CreateAprovalsDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const approval = await this.approvalsRespistory.findOneBy({
        created_by_id: this.request.user.id,
      });
      if (!approval) {
        throw new HttpException(`Approval not found.`, HttpStatus.NOT_FOUND);
      }

      approval.email = createAprovalsDto.email;
      approval.marketing_materials = createAprovalsDto.marketing_materials;
      approval.promotional_items = createAprovalsDto.promotional_items;
      approval.sms_texting = createAprovalsDto.sms_texting;
      approval.tele_recruitment = createAprovalsDto.tele_recruitment;

      await queryRunner.manager.save(approval);

      const action = 'C';
      await this.updateApprovalHistory(approval, action);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Approvals updated',
        status_code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  async updateApprovalHistory(data: Approval, action: string) {
    const approvalsHistory = new AprovalsHistory();
    approvalsHistory.email = data.email;
    approvalsHistory.history_reason = action;
    approvalsHistory.id = data.id;
    approvalsHistory.marketing_materials = data.marketing_materials;
    approvalsHistory.promotional_items = data.promotional_items;
    approvalsHistory.sms_texting = data.sms_texting;
    approvalsHistory.tele_recruitment = data.tele_recruitment;
    approvalsHistory.updated_at = new Date();
    approvalsHistory.created_at = data.created_at;
    approvalsHistory.created_by_id = data.created_by_id;
    approvalsHistory.updated_by = this.request.user.id;
    approvalsHistory.user_id = this.request.user.id;
    approvalsHistory.tenant_id = this.request.user.tenant.id;

    await this.approvalsHistory.save(approvalsHistory);
  }
}
