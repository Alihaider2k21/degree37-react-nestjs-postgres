import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';
import { Device } from '../entities/device.entity';
import { DeviceHistory } from '../entities/device-history.entity';

@Injectable()
export class DeviceRetirement {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly entityManager: EntityManager
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async triggerDeviceRetirement() {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      console.log(
        'DEVICE CRON Job Started _______________________________',
        moment().format()
      );
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const devices: any = await this.deviceRepository.find({
        where: {
          retire_on: LessThan(moment().toDate()),
          status: true,
        },
        relations: ['created_by'],
      });

      const updatePromises = [];
      const historyPromises = [];
      for (const deviceData of devices) {
        const deviceHistory = new DeviceHistory();
        deviceHistory.history_reason = 'C';
        deviceHistory.id = deviceData.id;
        deviceHistory.name = deviceData.name;
        deviceHistory.short_name = deviceData.short_name;
        deviceHistory.description = deviceData.description;
        deviceHistory.device_type = deviceData.device_type;
        deviceHistory.replace_device = deviceData.replace_device;

        deviceHistory.collection_operation = deviceData.collection_operation;
        deviceHistory.retire_on = deviceData.retire_on;
        deviceHistory.status = deviceData.is_active;
        deviceHistory.created_by = deviceData?.created_by?.id;
        deviceHistory.tenant_id = deviceData.tenant_id;
        historyPromises.push(queryRunner.manager.save(deviceHistory));

        updatePromises.push(
          queryRunner.manager.update(
            Device,
            { id: deviceData.id },
            { status: false }
          )
        );
      }
      await Promise.all(historyPromises);
      await Promise.all(updatePromises);
      await queryRunner.commitTransaction();

      console.log('No. of the records affected: ', devices.length);

      console.log(
        'DEVICE CRON Job Finished _______________________________',
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
