import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { UserRequest } from 'src/common/interface/request';
import { HistoryService } from 'src/api/common/services/history.service';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { CommonFunction } from '../../../common/common-functions';
import { AssertionCodes } from '../../entities/assertion-codes.entity';
import { DonorsAssertionCodes } from '../../entities/donors-assertion-codes.entity';
import { DonorsAssertionCodesHistory } from '../../entities/donors_assertion-codes-history.entity';
import { CreateDonorAssertionCodeDto } from '../dto/donors-create-assertion-codes.dto';

@Injectable()
export class DonorsAssertionCodesService extends HistoryService<DonorsAssertionCodesHistory> {
  private message = 'Donors Assertion Code';

  constructor(
    @InjectRepository(DonorsAssertionCodes)
    private entityRepository: Repository<DonorsAssertionCodes>,
    @InjectRepository(DonorsAssertionCodesHistory)
    private readonly entityHistoryRepository: Repository<DonorsAssertionCodesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly commonFunction: CommonFunction
  ) {
    super(entityHistoryRepository);
  }

  async create(createdDto: CreateDonorAssertionCodeDto, req: UserRequest) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const create = new DonorsAssertionCodes();
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
      const saveHistory = new DonorsAssertionCodesHistory();
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

  async findAllDonorAssertionCodes(
    donorId: any,
    req: UserRequest,
    sortName: string,
    sortOrder = 'ASC'
  ) {
    try {
      const groupCodes = await this.entityManager
        .createQueryBuilder(DonorsAssertionCodes, 'dac')
        .innerJoinAndSelect('dac.donor_id', 'donor')
        .innerJoinAndSelect('dac.assertion_code_id', 'assertion')
        .innerJoinAndSelect('dac.created_by', 'user')
        .where('dac.is_archived = :is_archived', { is_archived: false })
        .andWhere('assertion.tenant_id = :tenant_id', {
          tenant_id: req.user.tenant.id,
        })
        .andWhere('dac.donor_id = :donor_id', {
          donor_id: donorId,
        })
        .select([
          'dac.id as id',
          'dac.donor_id as donor_id',
          'dac.assertion_code_id as assertion_code_id',
          'assertion.bbcs_uuid as code',
          'assertion.name as name',
          'dac.start_date as start_date',
          "CONCAT(user.first_name,' ', user.last_name) as applied_by",
          'dac.end_date as end_date',
          'dac.is_archived as is_archived',
          'dac.created_at as created_at',
          'dac.created_by as created_by',
        ]);

      if (sortName && sortOrder) {
        groupCodes.orderBy(
          `assertion.${sortName}`,
          sortOrder as 'ASC' | 'DESC'
        );
      }
      const groupCodesArray = await groupCodes.getRawMany();
      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully`,
        data: groupCodesArray,
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
