import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { MarketingMaterials } from '../entities/marketing-material.entity';
import { MarketingMaterialsHistory } from '../entities/marketing-material-history.entity';

@Injectable()
export class MarketingMaterialRetirement {
  constructor(
    @InjectRepository(MarketingMaterials)
    private readonly marketingMaterialRepository: Repository<MarketingMaterials>,
    private readonly entityManager: EntityManager
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async triggerMarketingMaterialsRetirement() {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      console.log(
        'MARKETING MATERIAL CRON Job Started _______________________________',
        moment().format()
      );
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const marketingMaterials: any =
        await this.marketingMaterialRepository.find({
          where: {
            retire_on: LessThan(moment().toDate()),
            status: true,
          },
          relations: ['created_by'],
        });

      const updatePromises = [];
      const historyPromises = [];
      for (const marketingMaterial of marketingMaterials) {
        const marketingMaterialsHistory = new MarketingMaterialsHistory();
        marketingMaterialsHistory.history_reason = 'C';
        marketingMaterialsHistory.id = marketingMaterial.id;
        marketingMaterialsHistory.name = marketingMaterial.name;
        marketingMaterialsHistory.short_name = marketingMaterial.short_name;
        marketingMaterialsHistory.description = marketingMaterial.description;
        marketingMaterialsHistory.retire_on = marketingMaterial.retire_on;
        marketingMaterialsHistory.status = marketingMaterial.status;
        marketingMaterialsHistory.created_by =
          marketingMaterial?.created_by?.id;
        marketingMaterialsHistory.tenant_id = marketingMaterial.tenant_id;
        historyPromises.push(
          queryRunner.manager.save(marketingMaterialsHistory)
        );

        updatePromises.push(
          queryRunner.manager.update(
            MarketingMaterials,
            { id: marketingMaterial.id },
            { status: false }
          )
        );
      }
      await Promise.all(historyPromises);
      await Promise.all(updatePromises);
      await queryRunner.commitTransaction();

      console.log('No. of the records affected: ', marketingMaterials.length);

      console.log(
        'MARKETING MATERIAL CRON Job Finished _______________________________',
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
