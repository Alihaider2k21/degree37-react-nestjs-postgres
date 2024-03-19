import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { UserRequest } from 'src/common/interface/request';
import { HistoryService } from 'src/api/common/services/history.service';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { CommonFunction } from '../../../common/common-functions';
import { DonorCenterCodesHistory } from '../../entities/donor-center-codes-history.entity';
import { DonorCenterCodes } from '../../entities/donor-center-codes.entity';
import { CreateDonorCenterCodeDto } from '../dto/create-donor-center-code.dto';

@Injectable()
export class DonorCenterCodesService extends HistoryService<DonorCenterCodesHistory> {
  private message = 'Donor Center Code';

  constructor(
    @InjectRepository(DonorCenterCodes)
    private entityRepository: Repository<DonorCenterCodes>,
    @InjectRepository(DonorCenterCodesHistory)
    private readonly entityHistoryRepository: Repository<DonorCenterCodesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly commonFunction: CommonFunction
  ) {
    super(entityHistoryRepository);
  }

  async create(createdDto: CreateDonorCenterCodeDto, req: UserRequest) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const create = new DonorCenterCodes();
      const keys = Object.keys(createdDto);
      //set values in create obj
      for (const key of keys) {
        create[key] = createdDto?.[key];
      }

      create.created_by = req.user.id;
      create.tenant_id = req.user.tenant.id;

      // Save entity
      const saveObj = await queryRunner.manager.save(create);
      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: `${this.message} Created Successfully`,
        data: saveObj,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllDonorCenterCodes(id: any) {
    try {
      const centerCodes = await this.entityManager
        .createQueryBuilder(DonorCenterCodes, 'dcc')
        .innerJoinAndSelect('dcc.donor_id', 'donor')
        .innerJoinAndSelect('dcc.center_code_id', 'facility')
        .innerJoinAndSelect('dcc.created_by', 'user')
        .where('dcc.is_archived = :is_archived', { is_archived: false })
        .andWhere('dcc.donor_id = :donor_id', { donor_id: id })
        .select([
          'dcc.id as id',
          'dcc.donor_id as donor_id',
          'dcc.center_code_id as center_code_id',
          'facility.code as code',
          'facility.name as name',
          'dcc.start_date as start_date',
          "CONCAT(user.first_name,' ', user.last_name) as applied_by",
          'dcc.is_archived as is_archived',
          'dcc.created_at as created_at',
          'dcc.created_by as created_by',
        ])
        .getRawMany();
      return {
        status: HttpStatus.OK,
        response: `${this.message}s Fetched `,
        data: centerCodes,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async archive(id: any, updatedBy: any) {
    try {
      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: updatedBy } },
        'User'
      );
      const query = {
        relations: ['created_by', 'tenant_id'],
        where: {
          id,
          is_archived: false,
        },
      };
      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        query,
        this.message
      );
      const saveHistory = new DonorCenterCodesHistory();
      Object.assign(saveHistory, entity);
      saveHistory.id = entity.id;
      saveHistory.created_by = user.id;
      saveHistory.tenant_id = entity.tenant_id.id;
      saveHistory.history_reason = 'D';
      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);
      entity['is_archived'] = !entity.is_archived;
      await this.entityRepository.save(entity);
      return {
        status: HttpStatus.NO_CONTENT,
        message: `${this.message} Archive Successfully`,
        data: entity,
      };
    } catch (error) {
      return resError(error, ErrorConstants.Error, error.status);
    }
  }

  async findAll(req: UserRequest) {
    try {
      const centerCodes = await this.entityManager
        .createQueryBuilder(DonorCenterCodes, 'dcc')
        .innerJoinAndSelect('dcc.donor_id', 'donor')
        .innerJoinAndSelect('dcc.center_code_id', 'facility')
        .innerJoinAndSelect('dcc.created_by', 'user')

        .where('dcc.is_archived = :is_archived', { is_archived: false })
        .andWhere('dcc.tenant_id = :tenant_id', {
          tenant_id: req.user.tenant.id,
        })
        .select([
          'dcc.id as id',
          'dcc.donor_id as donor_id',
          'dcc.center_code_id as center_code_id',
          'facility.code as code',
          'facility.name as name',
          'dcc.start_date as start_date',
          "CONCAT(user.first_name,' ', user.last_name) as applied_by",
          'dcc.is_archived as is_archived',
          'dcc.created_at as created_at',
          'dcc.created_by as created_by',
        ])
        .getRawMany();

      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully`,
        data: centerCodes,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
