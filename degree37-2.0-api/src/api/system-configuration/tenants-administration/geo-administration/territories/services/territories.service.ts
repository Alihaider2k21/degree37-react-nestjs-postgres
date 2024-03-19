import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Equal, ILike, Repository } from 'typeorm';
import { Territory } from '../entities/territories.entity';
import { CreateTerritoriyDto, GetAllTerritoryDto } from '../dto/territory.dto';
import { User } from '../../../../tenants-administration/user-administration/user/entity/user.entity';
import {
  resError,
  resSuccess,
} from '../../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../../system-configuration/constants/error.constants';
import { SuccessConstants } from '../../../../../system-configuration/constants/success.constants';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { TerritoryHistory } from '../entities/territories-history.entity';
import { getModifiedDataDetails } from '../../../../../../common/utils/modified_by_detail';
import { HistoryService } from '../../../../../common/services/history.service';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

@Injectable()
export class TerritoryService extends HistoryService<TerritoryHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Territory)
    private readonly territoryManagementRepository: Repository<Territory>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(TerritoryHistory)
    private readonly territoryHistoryRepository: Repository<TerritoryHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {
    super(territoryHistoryRepository);
  }

  async create(territoryDto: CreateTerritoriyDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: territoryDto?.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const territoryWithSameName =
        await this.territoryManagementRepository.findOne({
          where: { territory_name: ILike(`%${territoryDto.territory_name}%`) },
        });

      if (territoryWithSameName) {
        throw new HttpException(
          `Territory already exists`,
          HttpStatus.NOT_FOUND
        );
      }

      let tenant = null;
      if (territoryDto?.recruiter) {
        tenant = await this.tenantRepository.findOne({
          where: { id: territoryDto?.recruiter },
        });
      }

      const isUser = await this.userRepository.findOneBy({
        id: territoryDto?.created_by,
      });
      const territory = new Territory();

      territory.territory_name = territoryDto.territory_name;
      territory.description = territoryDto.description;
      territory.status = territoryDto.status;
      territory.recruiter = territoryDto.recruiter;
      territory.created_by = isUser;
      territory.tenant = this.request.user?.tenant;

      // Save the Territory entity
      const savedTerritory = await this.territoryManagementRepository.save(
        territory
      );

      return resSuccess(
        'Territory Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedTerritory
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getAllTerritories(getAllTerritoriesInterface: GetAllTerritoryDto) {
    try {
      const { sortBy, sortOrder } = getAllTerritoriesInterface;
      const limit = Number(getAllTerritoriesInterface?.limit);
      const page = Number(getAllTerritoriesInterface?.page);
      const getTotalPage = (totalData: number, limit: number) => {
        return Math.ceil(totalData / limit);
      };

      if (page <= 0) {
        throw new HttpException(
          `page must of positive integer`,
          HttpStatus.BAD_REQUEST
        );
      }

      const where = {};
      Object.assign(where, {
        is_archived: false,
      });
      if (getAllTerritoriesInterface.status) {
        Object.assign(where, {
          status: getAllTerritoriesInterface.status,
        });
      }
      if (getAllTerritoriesInterface?.recruiter_id) {
        Object.assign(where, {
          recruiter: {
            id: getAllTerritoriesInterface?.recruiter_id,
          },
        });
      }

      if (getAllTerritoriesInterface?.name) {
        Object.assign(where, {
          territory_name: ILike(`%${getAllTerritoriesInterface?.name}%`),
        });
      }

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });
      let order = {};
      switch (sortBy) {
        case 'territory_name':
          order = { 'territory.territory_name': sortOrder };
          break;
        case 'description':
          order = { 'territory.description': sortOrder };
          break;
        case 'status':
          order = { 'territory.status': sortOrder };
          break;
        case 'recruiter':
          order = { 'recruiter.first_name': sortOrder };
          break;
        default:
          order = { 'territory.id': 'DESC' };
          break;
      }
      const queryBuilder =
        this.territoryManagementRepository.createQueryBuilder('territory');
      queryBuilder
        .where(where)
        .leftJoin('territory.recruiter', 'recruiter')
        .select([
          'territory.id AS id',
          'territory.territory_name AS territory_name',
          'territory.description AS description',
          'territory.status AS status',
          'territory.is_archived AS is_archived',
          'territory.created_at AS created_at',
          'territory.created_by AS created_by',
          'territory.recruiter AS recruiter_id',
          "CONCAT(recruiter.first_name, ' ', recruiter.last_name) AS recruiter",
        ])
        .orderBy(order)
        .offset((page - 1) * limit || 0)
        .limit(limit || 10);

      const records = await queryBuilder.getRawMany();
      const count = await queryBuilder.getCount();

      return {
        status: SuccessConstants.SUCCESS,
        response: '',
        code: HttpStatus.OK,
        total_territories_count: count,
        data: records,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getTerritory(id: any) {
    try {
      if (!Number(id)) {
        throw new HttpException(`Invalid Id`, HttpStatus.NOT_FOUND);
      }

      const territory = await this.territoryManagementRepository.findOne({
        where: {
          id: id as any,
        },
        relations: ['recruiter', 'created_by'],
      });

      if (!territory) {
        throw new HttpException(`Territory not found.`, HttpStatus.NOT_FOUND);
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.territoryHistoryRepository,
        id,
        this.userRepository
      );
      const result = {
        ...territory,
        ...modifiedData,
      };

      return {
        status: SuccessConstants.SUCCESS,
        response: '',
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, updateTerritoryDto: CreateTerritoriyDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const territory = await this.territoryManagementRepository.findOne({
        where: {
          id: id,
          is_archived: false,
        },
        relations: ['recruiter'],
      });

      if (!territory) {
        throw new HttpException(`Territory not found.`, HttpStatus.NOT_FOUND);
      }

      const user = await this.userRepository.findOneBy({
        id: updateTerritoryDto.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
      }

      const userId = user?.id;

      const territoryUpdateObject = {
        territory_name: updateTerritoryDto?.territory_name,
        description: updateTerritoryDto?.description,
        status: updateTerritoryDto?.status,
        recruiter: updateTerritoryDto?.recruiter,
      };

      const updateTerritory = await queryRunner.manager.update(
        Territory,
        { id: territory.id },
        { ...territoryUpdateObject }
      );

      if (!updateTerritory.affected) {
        throw new HttpException(
          `Territory update failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }

      const action = 'C';
      await this.updateTerritoryHistory(
        userId,
        queryRunner,
        { ...territory },
        action
      ).catch((error) => {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });

      await queryRunner.commitTransaction();

      const savedTerritory = await this.territoryManagementRepository.findOne({
        where: {
          id: id as any,
        },
        relations: ['recruiter'],
      });

      return resSuccess(
        'Changes Saved',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        savedTerritory
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async updateTerritoryHistory(
    userId: any,
    queryRunner,
    data: any,
    action: string
  ) {
    const territoryC = new TerritoryHistory();
    territoryC.history_reason = action;
    territoryC.id = data?.id;
    territoryC.territory_name = data?.territory_name;
    territoryC.description = data?.description;
    territoryC.status = data?.status;
    territoryC.recruiter = data?.recruiter?.id;
    territoryC.is_archived = data?.is_archived;
    territoryC.created_by = userId;
    await this.createHistory(territoryC);
  }

  async remove(id: any, userId: any): Promise<any> {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const territory = await this.territoryManagementRepository.findOne({
        where: { id, is_archived: false },
        relations: ['recruiter'],
      });

      if (!territory) {
        throw new HttpException(`Territory not found.`, HttpStatus.NOT_FOUND);
      }

      territory.is_archived = true;

      await this.updateTerritoryHistory(userId, queryRunner, territory, 'D');

      // Archive the Territory entity
      const archiveTerritory = await queryRunner.manager.save(territory);
      await queryRunner.commitTransaction();

      return resSuccess(
        'Territory Archived',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        archiveTerritory
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
