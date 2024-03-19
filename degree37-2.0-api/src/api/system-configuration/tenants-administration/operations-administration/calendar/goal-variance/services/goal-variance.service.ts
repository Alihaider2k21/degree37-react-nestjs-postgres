import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GoalVariance } from '../entities/goal-variance.entity';
import { GoalVarianceHistory } from '../entities/goal-variance-history.entity';
import {
  CreateGoalVarianceDto,
  UpdateGoalVarianceDto,
} from '../dto/goal-variance.dto';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { UserRequest } from '../../../../../../../common/interface/request';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class GoalVarianceService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GoalVariance)
    private readonly goalVarianceRepository: Repository<GoalVariance>,
    @InjectRepository(GoalVarianceHistory)
    private readonly goalVarianceHistoryRepository: Repository<GoalVarianceHistory>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly entityManager: EntityManager
  ) {}

  /**
   * check entity exist in database
   * @param repository
   * @param query
   * @param entityName
   * @returns {object}
   */
  async entityExist<T>(
    repository: Repository<T>,
    query,
    entityName
  ): Promise<T> {
    const entityObj = await repository.findOne(query);
    if (!entityObj) {
      throw new HttpException(`${entityName} not found.`, HttpStatus.NOT_FOUND);
    }

    return entityObj;
  }

  /**
   * Calculate limit and skip
   * @param limit
   * @param page
   * @returns {skip, take}
   */
  pagination(limit: number, page: number) {
    page = page <= 0 ? 1 : page;
    const take: any = limit < 10 ? 10 : limit;
    const skip: any = (page - 1) * limit;

    return { skip, take };
  }

  /**
   * insert data in history table
   * when entity update , archive  and deleted
   * @param goalVariance
   * @param action
   */
  async createHistory(goalVariance: any, action: string) {
    const goalVarianceHistory = new GoalVarianceHistory();
    Object.assign(goalVarianceHistory, goalVariance);
    goalVarianceHistory.history_reason = action;
    goalVarianceHistory.id = BigInt(goalVariance.id);
    await this.goalVarianceHistoryRepository.save(goalVarianceHistory);
  }

  /**
   * create new Goal Variance
   * @param createGoalVarianceDto
   * @returns
   */
  async create(createGoalVarianceDto: CreateGoalVarianceDto) {
    try {
      const user: any = await this.userRepository.findOne({
        where: { id: createGoalVarianceDto?.created_by },
        relations: ['tenant'],
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const tenant: any = await this.tenantRepository.findOneBy({
        id: user?.tenant?.id,
      });

      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const tenantId: any = +tenant?.id;

      const ad: any = await this.goalVarianceRepository.findOne({
        where: {
          tenant_id: tenantId,
        },
        relations: ['tenant'],
      });

      if (ad) {
        throw new HttpException(
          `Goal variance can only be created once`,
          HttpStatus.BAD_REQUEST
        );
      }

      const advertiseData = await this.goalVarianceRepository.save({
        ...createGoalVarianceDto,
        tenant_id: this.request?.user?.tenant?.id,
      });

      return {
        status: SuccessConstants.SUCCESS,
        message: 'Goal Variance',
        status_code: HttpStatus.CREATED,
        data: advertiseData,
      };
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  /**
   *
   * @returns {goalVariance}
   */
  async findOne(tenantId: any, userId: any) {
    const message = 'Goal Variance';
    try {
      const user: any = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['tenant'],
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const goalVariance = await this.entityExist(
        this.goalVarianceRepository,
        {
          relations: ['tenant'],
          where: {
            is_archive: false,
            tenant_id: tenantId,
          },
        },
        message
      );

      return {
        status: HttpStatus.OK,
        message: `${message} Fetched Successfully`,
        data: goalVariance,
      };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
        data: null,
      };
    }
  }

  /**
   * update record
   * insert data in history table
   * @param updateGoalVarianceDto
   * @returns
   */
  async update(
    id: any,
    userId: any,
    tenantId: any,
    updateGoalVarianceDto: UpdateGoalVarianceDto
  ) {
    try {
      const user: any = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['tenant'],
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const goalVariance = await this.entityExist(
        this.goalVarianceRepository,
        {
          relations: ['tenant'],
          where: {
            id,
            is_archive: false,
            tenant_id: tenantId,
          },
        },
        'Goal Variance'
      );

      Object.assign(goalVariance, updateGoalVarianceDto);
      goalVariance['updated_at'] = new Date();
      goalVariance['updated_by'] = updateGoalVarianceDto.created_by;
      // goalVariance['history_reason'] = 'C';
      goalVariance['created_by'] = updateGoalVarianceDto.created_by;

      const savedGoalVariance = await this.goalVarianceRepository.save(
        goalVariance
      );

      // Create history records for the old and new data
      await this.createHistory(savedGoalVariance, 'C');

      return {
        status: HttpStatus.OK,
        message: `Goal Variance Updated Successfully`,
        data: savedGoalVariance,
      };
    } catch (error) {
      return {
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      };
    }
  }
}
