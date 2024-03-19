import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  ILike,
  In,
  LessThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { PromotionalItems } from '../entities/promotional-item.entity';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { UpdatePromotionalItemDto } from '../dto/update-promotional-item.dto';
import { PromotionalItemsHistory } from '../entities/promotional-item-history.entity';
import { PromotionalItemCollectionOperationHistory } from '../entities/promotional-item-collection-operations-history.entity';
import { PromotionalItemCollectionOperation } from '../entities/promotional-item-collection-operations.entity';
import {
  GetAllPromotionalItemCOInterface,
  GetAllPromotionalItemInterface,
} from '../interface/promotional-item.interface';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { CreatePromotionalItemDto } from '../dto/create-promotional-item.dto';
import { HistoryService } from 'src/api/common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';

@Injectable()
export class PromotionalItemService extends HistoryService<PromotionalItemsHistory> {
  constructor(
    @InjectRepository(PromotionalItems)
    private readonly promotionalItemRepository: Repository<PromotionalItems>,
    @InjectRepository(PromotionalItemCollectionOperation)
    private readonly promotionalItemCollectionOperation: Repository<PromotionalItemCollectionOperation>,
    @InjectRepository(PromotionalItemCollectionOperationHistory)
    private readonly promotionalItemCollectionOperationHistoryRepository: Repository<PromotionalItemCollectionOperationHistory>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(PromotionalItemsHistory)
    private readonly promotionalItemsHistory: Repository<PromotionalItemsHistory>
  ) {
    super(promotionalItemsHistory);
  }

  async create(createPromotionalItemDto: CreatePromotionalItemDto) {
    try {
      const {
        name,
        short_name,
        promotion_id,
        description,
        collection_operations,
        status,
        retire_on,
        created_by,
        tenant_id,
      } = createPromotionalItemDto;
      const user = await this.userRepository.findOneBy({
        id: created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: tenant_id,
      });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const businessUnits: any = await this.businessUnitsRepository.findOneBy({
        id: In(collection_operations),
      });

      if (
        businessUnits &&
        businessUnits.length < collection_operations.length
      ) {
        throw new HttpException(
          `Some Collection Operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const promotionalItems = new PromotionalItems();

      promotionalItems.created_by = user;
      promotionalItems.tenant_id = tenant;
      promotionalItems.name = name;
      promotionalItems.short_name = short_name;
      promotionalItems.promotion_id = promotion_id;
      promotionalItems.description = description;
      promotionalItems.status = status;
      promotionalItems.is_archived = false;
      promotionalItems.retire_on = retire_on;

      const savedPromotionalItem = await this.promotionalItemRepository.save(
        promotionalItems
      );
      for (const collectionOperations of collection_operations) {
        const promotionalItemCollectionOperation =
          new PromotionalItemCollectionOperation();
        promotionalItemCollectionOperation.promotional_item_id =
          savedPromotionalItem.id;
        promotionalItemCollectionOperation.collection_operation_id =
          collectionOperations;
        promotionalItemCollectionOperation.created_by = user;
        await this.promotionalItemCollectionOperation.save(
          promotionalItemCollectionOperation
        );
      }

      delete savedPromotionalItem.created_by;

      return resSuccess(
        'Promotional Item Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedPromotionalItem
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(params: GetAllPromotionalItemInterface) {
    try {
      const limit: number =
        params?.limit && params?.limit !== undefined
          ? +params?.limit
          : +process.env.PAGE_SIZE ?? 10;

      const page = params?.page ? +params?.page : 1;

      const where = {};
      if (params?.keyword) {
        Object.assign(where, {
          name: ILike(`%${params?.keyword}%`),
        });
      }
      const promotional_items: any = await this.promotionalItemRepository.find({
        where: {
          retire_on: LessThan(new Date()),
          status: true,
        },
      });
      for (const promotional_item of promotional_items) {
        const updatedRequest = {
          ...promotional_item,
          status: false,
        };
        await this.promotionalItemRepository.save(updatedRequest);
      }
      if (params?.collection_operation) {
        const collection_items: any = params.collection_operation;
        const collectionOperationIds = collection_items
          ? Array.isArray(collection_items)
            ? collection_items
            : [collection_items]
          : [];
        let teamIds = [];
        const qb = this.promotionalItemCollectionOperation
          .createQueryBuilder('collectionOperation')
          .select(
            'collectionOperation.promotional_item_id',
            'promotional_item_id'
          )
          .where(
            'collectionOperation.collection_operation_id IN (:...collectionOperationIds)',
            { collectionOperationIds }
          );

        const result = await qb.getRawMany();
        teamIds = result.map((row) => row.promotional_item_id);
        Object.assign(where, {
          id: In(teamIds),
        });
      }
      if (params?.status) {
        Object.assign(where, {
          status: params?.status,
        });
      }
      Object.assign(where, {
        tenant_id: { id: params.tenantId },
      });
      let promotionalItems: any = [];
      if (params?.fetchAll) {
        promotionalItems = this.promotionalItemRepository
          .createQueryBuilder('promotional_items')
          .orderBy({ 'promotional_items.id': 'DESC' })
          .where({ ...where, is_archived: false });
      } else {
        promotionalItems = this.promotionalItemRepository
          .createQueryBuilder('promotional_items')
          .innerJoinAndSelect(
            'promotional_items.promotion_id',
            'promotion_entity.id'
          )
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'promotional_items.id': 'DESC' })
          .where({ ...where, is_archived: false });
      }

      const [data, total] = await promotionalItems.getManyAndCount();
      const promotionalItemIds = data.map((promotion) => promotion.id);
      let collectionOperations: any = [];
      if (promotionalItemIds.length !== 0) {
        const query = this.promotionalItemCollectionOperation
          .createQueryBuilder('collectionOperation')
          .leftJoinAndSelect(
            'collectionOperation.collection_operation',
            'collection_operation_id'
          )
          .leftJoinAndSelect(
            'collectionOperation.promotional_item',
            'promotional_item_id'
          )
          .where(
            'collectionOperation.promotional_item_id IN (:...promotionalItemIds)',
            {
              promotionalItemIds,
            }
          )
          .andWhere('collection_operation_id.is_archived = :isArchived', {
            isArchived: false,
          })
          .andWhere('collection_operation_id.is_active = :isActive', {
            isActive: true,
          });
        collectionOperations = await query.getMany();
      }

      return {
        status: SuccessConstants.SUCCESS,
        response: '',
        code: HttpStatus.OK,
        total_promotional_item_count: total,
        data: { promotionalItems: data, collectionOperations },
      };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async findOne(id: any) {
    try {
      const promotionalItemIn = await this.promotionalItemRepository.findOne({
        where: { id: id, is_archived: false },
        relations: ['promotion_id', 'created_by'],
      });
      if (!promotionalItemIn) {
        throw new HttpException(
          `Promotional Item not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const query = this.promotionalItemCollectionOperation
        .createQueryBuilder('collectionOperation')
        .leftJoinAndSelect(
          'collectionOperation.collection_operation',
          'collection_operation_id'
        )
        .leftJoinAndSelect(
          'collectionOperation.promotional_item',
          'promotional_item_id'
        )
        .where('collectionOperation.promotional_item_id IN (:...id)', {
          id: Array.from(id),
        })
        .andWhere('collection_operation_id.is_archived = :isArchived', {
          isArchived: false,
        })
        .andWhere('collection_operation_id.is_active = :isActive', {
          isActive: true,
        });

      const collectionOperations = await query.getMany();
      const historyRecord: any = await getModifiedDataDetails(
        this.promotionalItemsHistory,
        id as any,
        this.userRepository
      );
      const isCheck = Object.values(historyRecord).every(
        (value) => value == null
      );
      if (!isCheck) {
        promotionalItemIn['modified_at'] = historyRecord.modified_at;
        promotionalItemIn['modified_by'] = historyRecord.modified_by;
      } else {
        promotionalItemIn['modified_at'] = promotionalItemIn.created_at;
        promotionalItemIn['modified_by'] = promotionalItemIn.created_by;
      }
      return resSuccess(SuccessConstants.SUCCESS, '', HttpStatus.OK, {
        promotionalItemIn,
        collectionOperations,
      });
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, updatePromotionalItemDto: UpdatePromotionalItemDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const PromotionalItem: any = await this.promotionalItemRepository.findOne(
        {
          where: { id },
          relations: ['created_by', 'tenant_id', 'promotion_id'],
        }
      );
      if (!PromotionalItem) {
        throw new HttpException(
          `Promotional Item not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (PromotionalItem.is_archived) {
        throw new HttpException(
          `Promotional Item is archived and cannot be updated.`,
          HttpStatus.NOT_FOUND
        );
      }
      const oldCollectionOperations: any =
        await this.promotionalItemCollectionOperationHistoryRepository.find({
          where: {
            promotional_item_id: In([PromotionalItem.id]),
          },
          relations: ['collection_operation_id'],
        });

      const PromotionalItemHistoryC = new PromotionalItemsHistory();
      PromotionalItemHistoryC.history_reason = 'C';
      PromotionalItemHistoryC.name = PromotionalItem.name;
      PromotionalItemHistoryC.short_name = PromotionalItem.short_name;
      PromotionalItemHistoryC.promotion_id = PromotionalItem.promotion_id.id;
      PromotionalItemHistoryC.description = PromotionalItem.description;
      PromotionalItemHistoryC.status = PromotionalItem.status;
      PromotionalItemHistoryC.is_archived = PromotionalItem.is_archived;
      PromotionalItemHistoryC.retire_on = PromotionalItem.retire_on;
      PromotionalItemHistoryC.collection_operations =
        oldCollectionOperations.map((co) => co.collection_operation_id.id);
      PromotionalItemHistoryC.created_by = updatePromotionalItemDto.created_by;
      PromotionalItemHistoryC.tenant_id = PromotionalItem.tenant_id.id;
      PromotionalItemHistoryC.id = PromotionalItem?.id;
      await this.createHistory(PromotionalItemHistoryC);
      const user = await this.userRepository.findOneBy({
        id: updatePromotionalItemDto.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
      }

      const PromotionalItemUpdateObject = {
        name: updatePromotionalItemDto?.name ?? PromotionalItem?.name,
        short_name:
          updatePromotionalItemDto?.short_name ?? PromotionalItem?.short_name,
        promotion_id:
          updatePromotionalItemDto?.promotion_id ??
          PromotionalItem?.promotion_id,
        description:
          updatePromotionalItemDto?.description ?? PromotionalItem?.description,
        status: updatePromotionalItemDto?.status ?? PromotionalItem?.status,
        retire_on: updatePromotionalItemDto?.retire_on,
      };

      let updatedPromotionalItem: any = await queryRunner.manager.update(
        PromotionalItems,
        { id: PromotionalItem.id },
        { ...PromotionalItemUpdateObject }
      );

      if (!updatedPromotionalItem.affected) {
        throw new HttpException(
          `Promtional Item update failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }

      await this.promotionalItemCollectionOperationHistoryRepository
        .createQueryBuilder('collection_operation_promotional_item_history')
        .delete()
        .from(PromotionalItemCollectionOperation)
        .where('promotional_item_id = :promotional_item_id', {
          promotional_item_id: PromotionalItem.id,
        })
        .execute();

      const promises = [];
      for (const collectionOperations of updatePromotionalItemDto.collection_operation) {
        const promotionalItemCollectionOperation =
          new PromotionalItemCollectionOperation();
        promotionalItemCollectionOperation.promotional_item_id =
          PromotionalItem.id;
        promotionalItemCollectionOperation.collection_operation_id =
          collectionOperations;
        promotionalItemCollectionOperation.created_by = user;
        promises.push(
          queryRunner.manager.save(promotionalItemCollectionOperation)
        );
      }
      await Promise.all(promises);
      await queryRunner.commitTransaction();

      updatedPromotionalItem = await this.promotionalItemRepository.findOne({
        where: {
          id: PromotionalItem.id,
        },
      });
      return resSuccess(
        SuccessConstants.SUCCESS,
        '',
        HttpStatus.NO_CONTENT,
        updatedPromotionalItem
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  async updatePromotionalItemHistory(PromotionalItem: any, action: string) {
    const PromotionalItemHistoryD = new PromotionalItemsHistory();
    PromotionalItemHistoryD.name = PromotionalItem.name;
    PromotionalItemHistoryD.short_name = PromotionalItem.short_name;
    PromotionalItemHistoryD.promotion_id = PromotionalItem.promotion_id;
    PromotionalItemHistoryD.description = PromotionalItem.description;
    PromotionalItemHistoryD.status = PromotionalItem.status;
    PromotionalItemHistoryD.is_archived = PromotionalItem.is_archived;
    PromotionalItemHistoryD.retire_on = PromotionalItem.retire_on;
    PromotionalItemHistoryD.created_by = PromotionalItem.created_by;
    PromotionalItemHistoryD.tenant_id = PromotionalItem.tenant_id.id;
    PromotionalItemHistoryD.history_reason = action;
    PromotionalItemHistoryD.id = PromotionalItem?.id;
    await this.createHistory(PromotionalItemHistoryD);
  }

  async archive(user: User, id: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const promotionalItem: any = await this.promotionalItemRepository.findOne(
        {
          where: { id, is_archived: false },
          relations: ['created_by', 'promotion_id'],
        }
      );

      if (!promotionalItem) {
        throw new NotFoundException('promotionalItem not found');
      }

      const collectionOperations: any =
        await this.promotionalItemCollectionOperationHistoryRepository.find({
          where: {
            promotional_item_id: In([promotionalItem.id]),
          },
          relations: ['collection_operation_id'],
        });

      promotionalItem.is_archived = true;
      promotionalItem.collectionOperations = collectionOperations;
      // Archive the promotionalItem entity
      await queryRunner.manager.save(promotionalItem);
      const PromotionalItemHistoryD = new PromotionalItemsHistory();
      PromotionalItemHistoryD.history_reason = 'D';
      PromotionalItemHistoryD.id = promotionalItem.id;
      PromotionalItemHistoryD.name = promotionalItem.name;
      PromotionalItemHistoryD.short_name = promotionalItem.short_name;
      PromotionalItemHistoryD.promotion_id = promotionalItem.promotion_id;
      PromotionalItemHistoryD.description = promotionalItem.description;
      PromotionalItemHistoryD.collection_operations = collectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      PromotionalItemHistoryD.status = promotionalItem.status;
      PromotionalItemHistoryD.is_archived = promotionalItem.is_archived;
      PromotionalItemHistoryD.retire_on = promotionalItem.retire_on;
      PromotionalItemHistoryD.created_by = user.id;
      await this.createHistory(PromotionalItemHistoryD);
      promotionalItem.is_archived = true;
      promotionalItem.updated_by = user.id;
      await queryRunner.commitTransaction();

      return resSuccess(
        'promotionalItem Archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.GONE,
        {}
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByCollectionOperation(
    getAllMarketingMaterialCOInterface: GetAllPromotionalItemCOInterface
  ) {
    try {
      const where = {
        tenant_id: {
          id: getAllMarketingMaterialCOInterface?.tenantId,
        },
        is_archived: false,
        retire_on: MoreThanOrEqual(new Date()),
      };
      const response = await this.promotionalItemRepository
        .createQueryBuilder('promotional_item')
        .leftJoinAndSelect('promotional_item.tenant_id', 'tenant_id')
        .leftJoinAndSelect(
          'promotional_item.promotionalItem_collection_operations',
          'promotionalItem_collection_operations'
        )
        .where(where)
        .andWhere(
          `promotionalItem_collection_operations.collection_operation_id = :id`,
          {
            id: getAllMarketingMaterialCOInterface?.collectionOperationId,
          }
        )
        .getMany();
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Promotional Items Fetched successfully',
        status_code: HttpStatus.OK,
        data: response,
      };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }
}
