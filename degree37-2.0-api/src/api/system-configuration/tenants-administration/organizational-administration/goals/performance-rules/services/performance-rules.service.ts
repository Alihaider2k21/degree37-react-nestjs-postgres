import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  EntityManager,
  FindOptions,
  FindOneOptions,
} from 'typeorm';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { resError } from '../../../../../helpers/response';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { PerformanceRules } from '../entities/performance-rules.entity';
import {
  CreatePerformanceRulesDto,
  UpdatePerformanceRulesDto,
} from '../dto/create-performance-rules.dto';
import { PerformanceRulesHistory } from '../entities/performance-rules-history.entity';
import { OrderByConstants } from 'src/api/system-configuration/constants/order-by.constants';
import { GetAllPerformanceRulesInterface } from '../interface/performance-rules.interface';
import { HistoryService } from 'src/api/common/services/history.service';

@Injectable()
export class PerformanceRulesService extends HistoryService<PerformanceRulesHistory> {
  private message = 'Performance Rules';
  constructor(
    @InjectRepository(PerformanceRules)
    private entityRepository: Repository<PerformanceRules>,
    @InjectRepository(PerformanceRulesHistory)
    private readonly entityHistoryRepository: Repository<PerformanceRulesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {
    super(entityHistoryRepository);
  }

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
   * @param updateObj
   * @param action
   */
  // async createHistory(updateObj: any, action: string) {
  //   const saveHistory = new PerformanceRulesHistory();
  //   Object.assign(saveHistory, updateObj);
  //   saveHistory.history_reason = action;
  //   saveHistory.id = BigInt(updateObj.id);
  //   await this.entityHistoryRepository.save(saveHistory);
  // }

  /**
   * create new entity
   * @param createDto
   * @returns
   */
  async create(createDto: CreatePerformanceRulesDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.entityExist(
        this.userRepository,
        { where: { id: createDto?.created_by } },
        'User'
      );

      const create = new PerformanceRules();
      const keys = Object.keys(createDto);
      //set values in create obj
      for (const key of keys) {
        create[key] = createDto?.[key];
      }
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

  /**
   * update record
   * insert data in history table
   * @param id
   * @param updateDto
   * @returns
   */
  async update(id: any, updateDto: UpdatePerformanceRulesDto) {
    try {
      const query = {
        relations: ['created_by', 'tenant_id'],
        where: {
          id,
          is_archived: false,
        },
      };
      const entity = await this.entityExist(
        this.entityRepository,
        query,
        'Performance Rules'
      );
      await this.entityExist(
        this.userRepository,
        { where: { id: updateDto?.created_by } },
        'User'
      );
      Object.assign(entity, updateDto);
      await this.entityRepository.save(entity);
      const saveHistory = new PerformanceRulesHistory();
      Object.assign(saveHistory, entity);
      saveHistory.history_reason = 'C';
      saveHistory.id = BigInt(entity.id);
      saveHistory.tenant_id = entity.tenant_id.id;
      await this.createHistory(saveHistory);

      return {
        status: HttpStatus.OK,
        message: `${this.message} Updated Successfully`,
        data: entity,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   * fetch single record
   * @param id
   * @returns {object}
   */
  async findOne(id: any) {
    const query = {
      relations: ['created_by'],
      where: {
        tenant: { id },
        is_archived: false,
      },
    };
    const monthlyGoals = await this.entityExist(
      this.entityRepository,
      query,
      this.message
    );
    return {
      status: HttpStatus.OK,
      message: `${this.message} Fetched Successfully`,
      data: monthlyGoals,
    };
  }

  /**
   * get all monthly goals records
   * @param getAllMonthlyGoalsInterface
   * @returns {monthlyGoals}
   */
  async findAll(getAllInterface: GetAllPerformanceRulesInterface) {
    try {
      const {
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy = 'id',
        sortOrder = OrderByConstants.DESC,
        tenant_id,
      } = getAllInterface;
      const { skip, take } = this.pagination(limit, page);
      const order = { [sortBy]: sortOrder };

      const where = {
        is_archived: false,
      };

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });
      const data = await this.entityRepository.findOne({
        relations: ['created_by'],
        where,
      });
      return {
        status: HttpStatus.OK,
        message: `${this.message} Fetched Successfully`,
        data,
      };
    } catch (error) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
