import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { PromotionalItems } from '../entities/promotional-item.entity';
import { PromotionalItemsHistory } from '../entities/promotional-item-history.entity';

@Injectable()
export class PromotionalItemsRetirement {
  constructor(
    @InjectRepository(PromotionalItems)
    private readonly promotionalItemsRepository: Repository<PromotionalItems>,
    private readonly entityManager: EntityManager
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async triggerPromotionalItemsRetirement() {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      console.log(
        'PROMOTIONAL ITEMS CRON Job Started _______________________________',
        moment().format()
      );
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const promotionalItems: any = await this.promotionalItemsRepository.find({
        where: {
          retire_on: LessThan(moment().toDate()),
          status: true,
        },
        relations: [
          'created_by',
          'promotionalItem_collection_operations',
          'promotion_id',
        ],
      });

      const updatePromises = [];
      const historyPromises = [];
      for (const promotionalItem of promotionalItems) {
        const promotionalItemsHistory = new PromotionalItemsHistory();
        promotionalItemsHistory.history_reason = 'C';
        promotionalItemsHistory.id = promotionalItem.id;
        promotionalItemsHistory.name = promotionalItem.name;
        promotionalItemsHistory.short_name = promotionalItem.short_name;
        promotionalItemsHistory.description = promotionalItem.description;
        promotionalItemsHistory.retire_on = promotionalItem.retire_on;
        promotionalItemsHistory.promotion_id = promotionalItem.promotion_id;
        promotionalItemsHistory.status = promotionalItem.status;
        promotionalItemsHistory.created_by = promotionalItem?.created_by?.id;
        promotionalItemsHistory.tenant_id = promotionalItem.tenant_id;

        promotionalItemsHistory.collection_operations =
          promotionalItem.promotionalItem_collection_operations.map(
            (co) => co.collection_operation_id.id
          );
        historyPromises.push(queryRunner.manager.save(promotionalItemsHistory));

        updatePromises.push(
          queryRunner.manager.update(
            PromotionalItems,
            { id: promotionalItem.id },
            { status: false }
          )
        );
      }
      await Promise.all(historyPromises);
      await Promise.all(updatePromises);
      await queryRunner.commitTransaction();

      console.log('No. of the records affected: ', promotionalItems.length);

      console.log(
        'PROMOTIONAL ITEMS CRON Job Finished _______________________________',
        moment().format()
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }
}
