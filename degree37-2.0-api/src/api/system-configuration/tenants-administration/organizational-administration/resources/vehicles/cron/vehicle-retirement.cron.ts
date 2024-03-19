import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Vehicle } from '../entities/vehicle.entity';
import { VehicleHistory } from '../entities/vehicle-history.entity';
import moment from 'moment';

@Injectable()
export class VehicleRetirement {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly entityManager: EntityManager
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async triggerVehicleRetirement() {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      console.log(
        'CRON: Vehicle Retirement - Job Started _______________________________',
        moment().format()
      );
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const vehicles: any = await this.vehicleRepository.find({
        where: {
          retire_on: LessThan(moment().format('YYYY-MM-DD')),
          is_active: true,
        },
        relations: [
          'vehicle_type_id',
          'created_by',
          'collection_operation_id',
          'replace_vehicle_id',
        ],
      });
      const updatePromises = [];
      const historyPromises = [];
      for (const vehicleData of vehicles) {
        const vehicleHistory = new VehicleHistory();
        vehicleHistory.history_reason = 'C';
        vehicleHistory.id = vehicleData.id;
        vehicleHistory.name = vehicleData.name;
        vehicleHistory.short_name = vehicleData.short_name;
        vehicleHistory.description = vehicleData.description;
        vehicleHistory.vehicle_type_id = vehicleData.vehicle_type_id.id;
        vehicleHistory.collection_operation_id =
          vehicleData.collection_operation_id.id;
        vehicleHistory.replace_vehicle_id = vehicleData.replace_vehicle_id.id;
        vehicleHistory.retire_on = vehicleData.retire_on;
        vehicleHistory.is_active = vehicleData.is_active;
        vehicleHistory.created_by = vehicleData.created_by.id;
        historyPromises.push(queryRunner.manager.save(vehicleHistory));

        updatePromises.push(
          queryRunner.manager.update(
            Vehicle,
            { id: vehicleData.id },
            { is_active: false }
          )
        );
      }
      await Promise.all(historyPromises);
      await Promise.all(updatePromises);
      await queryRunner.commitTransaction();

      console.log(
        'CRON: Vehicle Retirement - No. of the records affected: ',
        vehicles.length
      );

      console.log(
        'CRON: Vehicle Retirement - Job Finished _______________________________',
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
