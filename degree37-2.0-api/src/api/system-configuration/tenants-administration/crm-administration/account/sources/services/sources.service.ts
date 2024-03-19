import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, EntityManager } from 'typeorm';
import { GetSourcesInterface } from '../interface/sources.interface';
import { Sources } from '../entities/sources.entity';
import { CreateSourcesDto } from '../dto/create-source.dto';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { resError, resSuccess } from '../../../../../helpers/response';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { UpdateSourcesDto } from '../dto/update-source.dto';
import { SourcesHistory } from '../entities/sources-history.entity';
import { HistoryService } from 'src/api/common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

interface IUser {
  id?: bigint;
  name?: string;
}
interface ISource {
  id?: bigint;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_by?: IUser;
  tenant_id?: number;
}

@Injectable()
export class SourcesService extends HistoryService<SourcesHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Sources)
    private readonly sourcesRepository: Repository<Sources>,
    @InjectRepository(SourcesHistory)
    private readonly sourcesHistoryRepository: Repository<SourcesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {
    super(sourcesHistoryRepository);
  }
  //create source
  async create(createSourcesDto: CreateSourcesDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createSourcesDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const source: any = new Sources();
      source.name = createSourcesDto?.name;
      source.description = createSourcesDto?.description;
      source.created_by = createSourcesDto?.created_by;
      source.is_active = createSourcesDto?.is_active ?? false;
      source.tenant = this.request.user?.tenant;
      const savedSource = await this.sourcesRepository.save(source);
      return resSuccess(
        'Source Created.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedSource
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  //get all
  async getAllSources(getSourcesInterface: GetSourcesInterface): Promise<any> {
    try {
      const fetchAll = getSourcesInterface?.fetchAll === 'true';
      const sortName = getSourcesInterface?.sortName;
      const sortBy = getSourcesInterface?.sortOrder;

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

      if (fetchAll) {
        // If fetchAll is true, ignore the limit and page and fetch all records
        [response, count] = await this.sourcesRepository.findAndCount({
          where: this.buildWhereClause(getSourcesInterface), // Use a helper method to build the 'where' object
          order: sorting,
        });
      } else {
        const limit: number = getSourcesInterface?.limit
          ? +getSourcesInterface.limit
          : +process.env.PAGE_SIZE;

        const page = getSourcesInterface?.page ? +getSourcesInterface.page : 1;

        [response, count] = await this.sourcesRepository.findAndCount({
          where: this.buildWhereClause(getSourcesInterface),
          take: limit,
          skip: (page - 1) * limit,
          order: sorting,
        });
      }
      return resSuccess(
        'Sources Fetched Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count: count, data: response }
      );
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  //get by id
  async getById(id: bigint) {
    try {
      const source = await this.sourcesRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by'],
      });
      if (!source) {
        throw new HttpException(`Source not found.`, HttpStatus.NOT_FOUND);
      }
      const historyRecord: any = await getModifiedDataDetails(
        this.sourcesHistoryRepository,
        id as any,
        this.userRepository
      );
      const isCheck = Object.values(historyRecord).every(
        (value) => value == null
      );
      if (!isCheck) {
        source['modified_at'] = historyRecord.modified_at;
        source['modified_by'] = historyRecord.modified_by;
      } else {
        source['modified_at'] = source.created_at;
        source['modified_by'] = source.created_by;
      }
      return resSuccess(
        'Source fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        source
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: bigint, userId: bigint) {
    try {
      const source = await this.sourcesRepository.findOneBy({
        id: id,
      });

      if (!source) {
        throw new HttpException(`Source not found.`, HttpStatus.NOT_FOUND);
      }

      const isArchive = true;
      source.is_archived = isArchive;
      // return updatedRequest;
      await this.sourcesRepository.save(source);
      const updatedSource: any = await this.sourcesRepository.findOne({
        where: { id },
        relations: ['created_by'],
      });
      if (updatedSource) {
        const action = 'D';
        updatedSource.created_by = userId;
        updatedSource.tenant_id = updatedSource.tenant_id;
        await this.updateSourcesHistory(updatedSource, action);
      }
      return resSuccess(
        'Changes Saved.',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        {}
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  //update source
  async update(id: any, updateSourcesDto: UpdateSourcesDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      const source = await this.sourcesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!source) {
        throw new HttpException(`Source not found.`, HttpStatus.NOT_FOUND);
      }

      const updatedRequest = {
        ...source,
        is_active: updateSourcesDto.is_active,
        name: updateSourcesDto.name,
        description: updateSourcesDto.description,
      };

      const modifiedSource = await queryRunner.manager.update(
        Sources,
        { id: source.id },
        { ...updatedRequest }
      );

      if (!modifiedSource.affected) {
        throw new HttpException(
          `Source update failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }
      // return updatedRequest;
      await this.sourcesRepository.save(updatedRequest);
      const updatedSource: any = await this.sourcesRepository.findOne({
        where: { id },
        relations: ['created_by'],
      });

      if (updatedSource) {
        const action = 'C';
        updatedSource.created_by = updateSourcesDto.created_by;
        updatedSource.tenant_id = updatedSource.tenant_id;
        await this.updateSourcesHistory(updatedSource, action);
      }

      return resSuccess(
        'Changes Saved.',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        {}
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateSourcesHistory(data: ISource, action: string) {
    const sourceC: any = new SourcesHistory();
    sourceC.id = data?.id;
    sourceC.name = data?.name;
    sourceC.description = data?.description;
    sourceC.is_active = data?.is_active;
    sourceC.created_by = data?.created_by;
    sourceC.history_reason = action;
    sourceC.tenant_id = data.tenant_id;

    delete sourceC?.created_at;
    await this.createHistory(sourceC);
  }

  private buildWhereClause(getSourcesInterface: GetSourcesInterface): object {
    const where = {};

    if (getSourcesInterface?.keyword) {
      Object.assign(where, {
        name: ILike(`%${getSourcesInterface.keyword}%`),
      });
    }

    if (getSourcesInterface?.status) {
      Object.assign(where, {
        is_active: getSourcesInterface.status,
      });
    }
    Object.assign(where, {
      is_archived: false,
    });

    Object.assign(where, {
      tenant_id: this.request.user?.tenant?.id,
    });
    return where;
  }
}
