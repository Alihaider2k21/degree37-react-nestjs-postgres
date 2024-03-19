import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Not, ILike, In } from 'typeorm';
import {
  CreatePromotionDto,
  UpdatePromotionDto,
} from '../dto/create-promotion.dto';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { resError, resSuccess } from '../../../../../helpers/response';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { PromotionEntity } from '../entity/promotions.entity';
import { PromotionHistory } from '../entity/promotions-history.entity';

import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import {
  GetAllPromotionsInterface,
  GetPromotionsForDriveInterface,
} from '../interface/promotions.interface';
import { HistoryService } from 'src/api/common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { PromotionsCollectionOperation } from '../entity/promotions-collection-operations.entity';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import moment from 'moment';

@Injectable({ scope: Scope.REQUEST })
export class PromotionsService extends HistoryService<PromotionHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(PromotionEntity)
    private readonly promotionRepository: Repository<PromotionEntity>,
    @InjectRepository(PromotionHistory)
    private readonly promotionsHistory: Repository<PromotionHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PromotionsCollectionOperation)
    private readonly promotionsCollectionOperation: Repository<PromotionsCollectionOperation>,
    @InjectRepository(BusinessUnits)
    private readonly businessRepository: Repository<BusinessUnits>,
    private readonly entityManager: EntityManager
  ) {
    super(promotionsHistory);
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

  async create(createPromotionDto: CreatePromotionDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    const user = await this.entityExist(
      this.userRepository,
      { where: { id: createPromotionDto?.created_by } },
      'User'
    );
    try {
      const promotionEntity = new PromotionEntity();
      promotionEntity.name = createPromotionDto.name;
      promotionEntity.description = createPromotionDto.description;
      promotionEntity.donor_message = createPromotionDto.donor_message;
      promotionEntity.status = createPromotionDto.status;
      promotionEntity.short_name = createPromotionDto.short_name;
      promotionEntity.created_by = user;
      promotionEntity.start_date = createPromotionDto.start_date;
      promotionEntity.end_date = createPromotionDto.end_date;
      promotionEntity.tenant = this.request.user?.tenant;

      const savedpromotion = await queryRunner.manager.save(promotionEntity);
      for (const collectionOperations of createPromotionDto.collection_operations) {
        const promotionsCollectionOperation =
          new PromotionsCollectionOperation();
        promotionsCollectionOperation.promotion_id = savedpromotion.id;
        promotionsCollectionOperation.collection_operation_id =
          collectionOperations;
        promotionsCollectionOperation.created_by = user;
        await this.promotionsCollectionOperation.save(
          promotionsCollectionOperation
        );
      }
      return {
        status: 'success',
        response: 'Promotion Created.',
        code: 201,
        data: {
          savedpromotion,
        },
      };
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(
    getAllPromotionsInterface: GetAllPromotionsInterface
  ): Promise<any> {
    try {
      const sortName = getAllPromotionsInterface?.sort_name;
      const sortOrder = getAllPromotionsInterface?.sort_order;
      if ((sortName && !sortOrder) || (sortOrder && !sortName)) {
        return new HttpException(
          'When selecting sort SortOrder & SortName is required.',
          HttpStatus.BAD_REQUEST
        );
      }

      const limit: number = getAllPromotionsInterface?.limit
        ? +getAllPromotionsInterface?.limit
        : +process.env.PAGE_SIZE;

      let page = getAllPromotionsInterface?.page
        ? +getAllPromotionsInterface?.page
        : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      if (getAllPromotionsInterface?.keyword) {
        Object.assign(where, {
          name: ILike(`%${getAllPromotionsInterface.keyword}%`),
        });
      }

      if (getAllPromotionsInterface?.status) {
        Object.assign(where, {
          status: getAllPromotionsInterface?.status,
        });
      }

      Object.assign(where, {
        is_archived: false,
      });

      Object.assign(where, {
        tenant_id: { id: this.request.user?.tenant?.id },
      });

      if (getAllPromotionsInterface?.collection_operation) {
        const collection_items: any =
          getAllPromotionsInterface.collection_operation;
        const collectionOperations = collection_items.split(',');
        let teamIds = [];
        const qb = this.promotionsCollectionOperation
          .createQueryBuilder('collectionOperation')
          .select('collectionOperation.promotion_id', 'promotion_id')
          .where(
            'collectionOperation.collection_operation_id IN (:...collectionOperations)',
            { collectionOperations }
          );

        const result = await qb.getRawMany();
        teamIds = result.map((row) => row.promotion_id);
        Object.assign(where, {
          id: In(teamIds),
        });
      }

      const promotion = this.promotionRepository
        .createQueryBuilder('promotion_entity')
        .take(limit)
        .skip((page - 1) * limit)
        .orderBy(`promotion_entity.${sortName}`, sortOrder as 'ASC' | 'DESC')
        .orderBy('promotion_entity.created_at', 'DESC')
        .where(where);

      const countQuery = promotion;

      const data = await promotion.getMany();
      const count = await countQuery.getCount();
      const collectionOperations =
        await this.promotionsCollectionOperation.find({
          where: {
            promotion_id: In(data.map((promotion) => promotion.id)),
          },
          relations: ['promotion_id', 'collection_operation_id'],
        });

      return {
        status: HttpStatus.OK,
        message: 'Promotions Fetched Succesfuly',
        count: count,
        data: { promotions: data, collectionOperations },
      };
    } catch (e) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllForDrives(
    getPromotionsInterface: GetPromotionsForDriveInterface
  ): Promise<any> {
    try {
      const { collection_operation_id, date, status } = getPromotionsInterface;

      const checkDate = moment(new Date(date)).utc();
      checkDate.set('hour', 0);
      checkDate.set('minute', 0);
      checkDate.set('second', 0);

      if (collection_operation_id && date && status) {
        let promotionsQuery = this.promotionRepository
          .createQueryBuilder('promotions')
          .leftJoinAndSelect(
            'promotions.promotions_collection_operations',
            'promotions_collection_operations'
          )
          .where(
            ':checkDate >= promotions.start_date AND :checkDate <= promotions.end_date',
            {
              checkDate: checkDate.toDate(),
            }
          )
          .andWhere(
            'promotions_collection_operations.collection_operation_id = :collection_operation_id',
            {
              collection_operation_id,
            }
          )
          .andWhere('promotions.tenant_id = :tenant_id', {
            tenant_id: this.request?.user?.tenant?.id,
          })
          .andWhere('promotions.is_archived = :is_archived', {
            is_archived: false,
          });

        if (status) {
          promotionsQuery = promotionsQuery.andWhere({
            status: true,
          });
        }
        const [data, count] = await promotionsQuery.getManyAndCount();

        return {
          status: HttpStatus.OK,
          message: 'Promotions fetched.',
          count,
          data,
        };
      } else {
        return new HttpException('Collection operation id required', 400);
      }
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: any, updatePromotionDto: UpdatePromotionDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const promotion: any = await this.promotionRepository.findOneBy({
        id: id,
      });
      if (!promotion) {
        throw new HttpException(`Promotion not found.`, HttpStatus.NOT_FOUND);
      }
      const user = await this.userRepository.findOneBy({
        id: updatePromotionDto.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
      }
      const action = 'C';
      promotion.userId = user.id;
      await this.updatePromotionsHistory(promotion, action);

      promotion.name = updatePromotionDto?.name ?? promotion.name;
      promotion.description =
        updatePromotionDto?.description ?? promotion.description;
      promotion.donor_message =
        updatePromotionDto?.donor_message ?? promotion.donor_message;
      promotion.status = updatePromotionDto?.status ?? promotion.status;
      promotion.short_name =
        updatePromotionDto?.short_name ?? promotion.short_name;
      promotion.start_date =
        updatePromotionDto?.start_date ?? promotion.start_date;
      promotion.end_date = updatePromotionDto?.end_date ?? promotion.end_date;

      await queryRunner.manager.save(promotion);
      await this.promotionsCollectionOperation
        .createQueryBuilder('promotions_collection_operations')
        .delete()
        .from(PromotionsCollectionOperation)
        .where('promotion_id = :promotion_id', {
          promotion_id: promotion.id,
        })
        .execute();
      const promises = [];
      for (const collectionOperations of updatePromotionDto.collection_operations) {
        const promotionCollectionOperation =
          new PromotionsCollectionOperation();
        promotionCollectionOperation.promotion_id = promotion.id;
        promotionCollectionOperation.collection_operation_id =
          collectionOperations;
        promotionCollectionOperation.created_by = user;
        promises.push(queryRunner.manager.save(promotionCollectionOperation));
      }
      await Promise.all(promises);
      await queryRunner.commitTransaction();

      return {
        status: 'success',
        response: 'Resource updated',
        status_code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      console.log(error, 'errrrrr');
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any): Promise<any> {
    try {
      const promotion = await this.promotionRepository.findOne({
        where: { id: id },
        relations: ['created_by'],
      });

      if (!promotion) {
        return new HttpException('Promotion not found', HttpStatus.BAD_REQUEST);
      }

      const historyRecord: any = await getModifiedDataDetails(
        this.promotionsHistory,
        id as any,
        this.userRepository
      );
      const isCheck = Object.values(historyRecord).every(
        (value) => value == null
      );
      if (!isCheck) {
        promotion['modified_at'] = historyRecord.modified_at;
        promotion['modified_by'] = historyRecord.modified_by;
      } else {
        promotion['modified_at'] = promotion.created_at;
        promotion['modified_by'] = promotion.created_by;
      }
      const collectionOperations =
        await this.promotionsCollectionOperation.find({
          where: {
            promotion_id: In([id]),
          },
          relations: ['collection_operation_id'],
        });
      return resSuccess(SuccessConstants.SUCCESS, '', HttpStatus.OK, {
        promotion,
        collectionOperations,
      });
    } catch (e) {
      console.log(e);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async archive(id: any, created_by: bigint) {
    try {
      const promotion = await this.promotionRepository.findOneBy({
        id: id,
      });

      if (!promotion) {
        throw new HttpException(`Promotion not found.`, HttpStatus.NOT_FOUND);
      }
      const collectionOperations: any =
        await this.promotionsCollectionOperation.find({
          where: {
            promotion_id: In([promotion.id]),
          },
          relations: ['collection_operation_id'],
        });
      const isArchive = !promotion.is_archived;

      const updatedRequest = {
        ...promotion,
        collectionOperations: collectionOperations,
        is_archived: isArchive,
      };

      await this.promotionRepository.save(updatedRequest);
      const updatedPromotion: any = await this.promotionRepository.findOne({
        where: { id },
        relations: ['created_by'],
      });

      if (updatedPromotion) {
        const action = 'D';
        updatedPromotion.userId = created_by;
        await this.updatePromotionsHistory(updatedPromotion, action);
      }

      return {
        status: 'success',
        response: 'Promotion Archived',
        status_code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updatePromotionsHistory(data: any, action: string) {
    const oldCollectionOperations: any =
      await this.promotionsCollectionOperation.find({
        where: {
          promotion_id: In([data.id]),
        },
        relations: ['collection_operation_id'],
      });
    const promotionHistoryEntity = new PromotionHistory();
    promotionHistoryEntity.id = data?.id;
    promotionHistoryEntity.name = data.name;
    promotionHistoryEntity.short_name = data.short_name;
    promotionHistoryEntity.description = data.description;
    promotionHistoryEntity.start_date = data.start_date;
    promotionHistoryEntity.end_date = data.end_date;
    promotionHistoryEntity.donor_message = data.donor_message;
    promotionHistoryEntity.collection_operations = oldCollectionOperations.map(
      (co) => co.collection_operation_id.id
    );
    promotionHistoryEntity.created_by = data?.userId;
    promotionHistoryEntity.tenant_id = data?.tenant_id;
    promotionHistoryEntity.history_reason = action;
    await this.createHistory(promotionHistoryEntity);
  }
}
