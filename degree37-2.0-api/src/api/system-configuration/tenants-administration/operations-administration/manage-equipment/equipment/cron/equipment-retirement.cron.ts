import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EquipmentEntity } from '../entity/equipment.entity';
import { EquipmentHistory } from '../entity/equipment-history.entity';
import moment from 'moment';

@Injectable()
export class EquipmentRetirement {
  constructor(
    @InjectRepository(EquipmentEntity)
    private readonly equipmentRepository: Repository<EquipmentEntity>,
    private readonly entityManager: EntityManager
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async triggerEquipmentRetirement() {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      console.log(
        'EQUIPMENT CRON Job Started _______________________________',
        moment().format()
      );
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const equipments: any = await this.equipmentRepository.find({
        where: {
          retire_on: LessThan(moment().format('YYYY-MM-DD')),
          is_active: true,
        },
        relations: ['created_by'],
      });

      const updatePromises = [];
      const historyPromises = [];
      for (const equipmentData of equipments) {
        const equipmentHistory = new EquipmentHistory();
        equipmentHistory.history_reason = 'C';
        equipmentHistory.id = equipmentData.id;
        equipmentHistory.name = equipmentData.name;
        equipmentHistory.short_name = equipmentData.short_name;
        equipmentHistory.description = equipmentData.description;
        equipmentHistory.collection_operations =
          equipmentData.collection_operations;
        equipmentHistory.resign_on_date = equipmentData.resign_on_date;
        equipmentHistory.is_active = equipmentData.is_active;
        equipmentHistory.created_by = equipmentData?.created_by?.id;
        historyPromises.push(queryRunner.manager.save(equipmentHistory));

        updatePromises.push(
          queryRunner.manager.update(
            EquipmentEntity,
            { id: equipmentData.id },
            { is_active: false }
          )
        );
      }
      await Promise.all(historyPromises);
      await Promise.all(updatePromises);
      await queryRunner.commitTransaction();

      console.log('No. of the records affected: ', equipments.length);

      console.log(
        'EQUIPMENT Job Finished _______________________________',
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
