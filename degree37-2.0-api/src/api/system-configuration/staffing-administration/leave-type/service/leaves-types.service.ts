import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';

import { User } from '../../../tenants-administration/user-administration/user/entity/user.entity';
import { CreateLeaveTypeDto } from '../dto/leaves-types.dto';
import { LeavesTypes } from '../entities/leave-types.entity';
import { GetAllLeavesTypesInterface } from '../interface/leaves-types.interface';
import { LeavesTypesHistory } from '../entities/leaves-types-history.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

@Injectable()
export class LeavesTypesServices {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LeavesTypes)
    private readonly leavesTypesRepository: Repository<LeavesTypes>,

    @InjectRepository(LeavesTypesHistory)
    private readonly leavesTypesHisotryRepository: Repository<LeavesTypesHistory>,

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

  async findAll(getAllLeavesInterface: GetAllLeavesTypesInterface) {
    const sortName = getAllLeavesInterface?.sortName;
    const sortBy = getAllLeavesInterface?.sortOrder;

    if ((sortName && !sortBy) || (sortBy && !sortName)) {
      return new HttpException(
        'When selecting sort SortBy & SortName is required.',
        HttpStatus.BAD_REQUEST
      );
    }

    const sorting: { [key: string]: 'ASC' | 'DESC' } = {};
    if (sortName && sortBy) {
      sorting[sortName] = sortBy.toUpperCase() as 'ASC' | 'DESC';
    } else {
      sorting['id'] = 'DESC';
    }

    const limit: number = getAllLeavesInterface?.limit
      ? +getAllLeavesInterface.limit
      : +process.env.PAGE_SIZE;

    const page = getAllLeavesInterface?.page ? +getAllLeavesInterface.page : 1;

    const [response, count] = await this.leavesTypesRepository.findAndCount({
      where: {
        is_archived: false,
        ...(getAllLeavesInterface?.status && {
          status: getAllLeavesInterface?.status,
        }),
        ...(getAllLeavesInterface?.keyword && {
          name: ILike(`%${getAllLeavesInterface?.keyword}%`),
        }),
        tenant_id: this.request?.user?.tenant?.id,
      },
      take: limit,
      skip: (page - 1) * limit,
      order: sorting,
      relations: ['created_by'],
    });

    return {
      status: HttpStatus.OK,
      response: 'Leaves Fetched Successfully',
      count: count,
      data: response,
    };
  }

  async findOne(id: any) {
    const message = 'Leave';
    const query = {
      where: {
        id,
      },
      relations: {
        created_by: true,
      },
    };
    const leave = await this.entityExist(
      this.leavesTypesRepository,
      query,
      message
    );
    const modifiedData: any = await getModifiedDataDetails(
      this.leavesTypesHisotryRepository,
      id,
      this.userRepository
    );
    return {
      status: HttpStatus.OK,
      message: `${message} Fetched Successfully`,
      data: { ...leave, ...modifiedData },
    };
  }

  async create(createLeaveDto: CreateLeaveTypeDto) {
    await this.entityExist(
      this.userRepository,
      { where: { id: createLeaveDto?.created_by } },
      'User'
    );
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const createLeave = new LeavesTypes();
      const keys = Object.keys(createLeaveDto);
      for (const key of keys) {
        createLeave[key] = createLeaveDto?.[key];
      }
      createLeave.created_at = new Date();
      createLeave.tenant_id = this.request?.user?.tenant?.id;
      // Save the Leave entity
      const savedLeave = await queryRunner.manager.save(createLeave);
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Leave created successfully',
        status_code: 201,
        data: savedLeave,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: any, updateLeaveDto: CreateLeaveTypeDto) {
    const query = {
      where: {
        id,
      },
    };

    const leave = await this.entityExist(
      this.leavesTypesRepository,
      query,
      'Industry Category'
    );
    await this.entityExist(
      this.userRepository,
      { where: { id: updateLeaveDto?.created_by } },
      'User'
    );
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const leavesHistory = new LeavesTypesHistory();
      leavesHistory.name = leave.name;
      leavesHistory.created_at = new Date();
      leavesHistory.created_by = updateLeaveDto.created_by;
      leavesHistory.description = leave.description;
      leavesHistory.id = leave.id;
      leavesHistory.history_reason = 'C';
      leavesHistory.status = leave.status;
      leavesHistory.short_description = leave.short_description;
      leavesHistory.tenant_id = leave.tenant_id;

      Object.assign(leave, { ...updateLeaveDto, created_by: leave.created_by });

      const savedLeave = await this.leavesTypesRepository.save(leave);

      await this.leavesTypesHisotryRepository.save(leavesHistory);

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'Leave updated successfully',
        data: savedLeave,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('Failed to update leaves data.');
    } finally {
      await queryRunner.release();
    }
  }

  async archive(id: any, updated_by: any) {
    const query = {
      where: {
        id,
      },
    };

    const leave = await this.entityExist(
      this.leavesTypesRepository,
      query,
      'Industry Category'
    );
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const leavesHistory = new LeavesTypesHistory();
      leavesHistory.name = leave.name;
      leavesHistory.created_at = new Date();
      leavesHistory.created_by = updated_by;
      leavesHistory.description = leave.description;
      leavesHistory.id = id;
      leavesHistory.history_reason = 'C';
      leavesHistory.status = leave.status;
      leavesHistory.short_description = leave.short_description;
      leavesHistory.is_archived = false;
      leavesHistory.tenant_id = leave.tenant_id;

      const leavesHistoryDel = new LeavesTypesHistory();
      leavesHistoryDel.name = leave.name;
      leavesHistoryDel.created_at = new Date();
      leavesHistoryDel.created_by = updated_by;
      leavesHistoryDel.description = leave.description;
      leavesHistoryDel.id = id;
      leavesHistoryDel.history_reason = 'D';
      leavesHistoryDel.status = leave.status;
      leavesHistoryDel.short_description = leave.short_description;
      leavesHistoryDel.is_archived = false;
      leavesHistoryDel.tenant_id = leave.tenant_id;

      leave.is_archived = true;
      Object.assign(leave, CreateLeaveTypeDto);
      const savedLeave = await this.leavesTypesRepository.save(leave);

      await this.leavesTypesHisotryRepository.save(leavesHistory);
      await this.leavesTypesHisotryRepository.save(leavesHistoryDel);

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'Leave archived successfully',
        data: savedLeave,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('Failed to update leaves data.');
    } finally {
      await queryRunner.release();
    }
  }
}
