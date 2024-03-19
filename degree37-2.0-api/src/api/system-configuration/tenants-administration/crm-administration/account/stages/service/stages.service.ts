import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { CreateStageDto, UpdateStageDto } from '../dto/stages.dto';
import { Stages } from '../entities/stages.entity';
import { GetAllStagesInterface } from '../interface/stages.interface';
import { HistoryService } from '../../../../../../common/services/history.service';
import { StagesHistory } from '../entities/stage-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

@Injectable()
export class StagesService extends HistoryService<StagesHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Stages)
    private readonly stagesRepository: Repository<Stages>,
    @InjectRepository(StagesHistory)
    private readonly stagesHistoryRepository: Repository<StagesHistory>,
    private readonly entityManager: EntityManager
  ) {
    super(stagesHistoryRepository);
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

  async findAll(getAllStagesInterface: GetAllStagesInterface) {
    const fetchAll = getAllStagesInterface?.fetchAll === true;
    const sortName = getAllStagesInterface?.sortName;
    const sortBy = getAllStagesInterface?.sortOrder;

    if ((sortName && !sortBy) || (sortBy && !sortName)) {
      return new HttpException(
        'When selecting sort SortBy & SortName is required.',
        HttpStatus.BAD_REQUEST
      );
    }

    let response;
    let count;

    const sorting: { [key: string]: 'ASC' | 'DESC' } = {};
    if (sortName && sortBy) {
      sorting[sortName] = sortBy.toUpperCase() as 'ASC' | 'DESC';
    } else {
      sorting['id'] = 'DESC';
    }

    const limit: number = getAllStagesInterface?.limit
      ? +getAllStagesInterface.limit
      : +process.env.PAGE_SIZE;

    const page = getAllStagesInterface?.page ? +getAllStagesInterface.page : 1;
    if (fetchAll) {
      [response, count] = await this.stagesRepository.findAndCount({
        where: {
          tenant: { id: this.request.user?.tenant?.id },
          is_archived: false,
          ...(getAllStagesInterface?.is_active && {
            is_active: getAllStagesInterface?.is_active,
          }),
        },
        order: sorting,
        relations: ['created_by'],
      });
    } else {
      const page = getAllStagesInterface?.page
        ? +getAllStagesInterface.page
        : 1;

      [response, count] = await this.stagesRepository.findAndCount({
        where: {
          tenant: { id: this.request.user?.tenant?.id },
          is_archived: false,
          ...(getAllStagesInterface?.is_active && {
            is_active: getAllStagesInterface?.is_active,
          }),
          ...(getAllStagesInterface?.keyword && {
            name: ILike(`%${getAllStagesInterface?.keyword}%`),
          }),
        },
        take: limit,
        skip: (page - 1) * limit,
        order: sorting,
        relations: ['created_by'],
      });
    }

    return {
      status: HttpStatus.OK,
      response: 'Stages Fetched ',
      count: count,
      data: response,
    };
  }

  async findOne(id: any) {
    const message = 'Stages';
    const query = {
      where: {
        id,
      },
      relations: {
        created_by: true,
      },
    };
    const stage = await this.entityExist(this.stagesRepository, query, message);

    const modifiedData: any = await getModifiedDataDetails(
      this.stagesHistoryRepository,
      id,
      this.userRepository
    );

    return {
      status: HttpStatus.OK,
      message: `${message} Fetched `,
      data: { ...stage, ...modifiedData },
    };
  }

  async create(createStageDto: CreateStageDto) {
    await this.entityExist(
      this.userRepository,
      { where: { id: createStageDto?.created_by } },
      'User'
    );
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const createStage = new Stages();
      const keys = Object.keys(createStageDto);

      for (const key of keys) {
        createStage[key] = createStageDto?.[key];
      }

      createStage.tenant_id = this.request.user?.tenant?.id;

      // Save the Stage entity
      const savedStage = await queryRunner.manager.save(createStage);
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Stage created ',
        status_code: 201,
        data: savedStage,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: any, updateStageDto: UpdateStageDto, req: any) {
    const query = {
      where: {
        id,
      },
    };

    const stage = await this.entityExist(
      this.stagesRepository,
      query,
      'Industry Category'
    );
    await this.entityExist(
      this.userRepository,
      { where: { id: req?.user?.id } },
      'User'
    );
    Object.assign(stage, updateStageDto);
    stage.created_by = req?.user?.id;
    const savedStage = await this.stagesRepository.save(stage);

    const stagesHistory = new StagesHistory();
    stagesHistory.history_reason = 'C';
    stagesHistory.id = stage?.id;
    stagesHistory.name = stage?.name;
    stagesHistory.description = stage?.description;
    stagesHistory.is_archived = stage?.is_archived;
    stagesHistory.is_active = stage?.is_active;
    stagesHistory.created_by = req?.user?.id;
    stagesHistory.tenant_id = stage?.tenant_id;
    delete stagesHistory?.created_at;
    await this.createHistory(stagesHistory);

    return {
      status: HttpStatus.NO_CONTENT,
      message: 'Stage updated ',
      data: savedStage,
    };
  }

  async archive(id: any, req: any) {
    const query = {
      where: {
        id,
      },
    };
    const stage = await this.entityExist(this.stagesRepository, query, 'Stage');
    stage.is_archived = true;
    Object.assign(stage, CreateStageDto);

    const savedStage = await this.stagesRepository.save(stage);

    const stagesHistory = new StagesHistory();
    stagesHistory.history_reason = 'C';
    stagesHistory.id = savedStage?.id;
    stagesHistory.name = savedStage?.name;
    stagesHistory.description = savedStage?.description;
    stagesHistory.is_archived = savedStage?.is_archived;
    stagesHistory.is_active = savedStage?.is_active;
    stagesHistory.created_by = req?.user?.id;
    stagesHistory.tenant_id = stage?.tenant_id;
    delete stagesHistory?.created_at;
    await this.createHistory(stagesHistory);
    stagesHistory.history_reason = 'D';
    await this.createHistory(stagesHistory);

    return {
      status: HttpStatus.NO_CONTENT,
      message: 'Stage archived ',
      data: savedStage,
    };
  }
}
