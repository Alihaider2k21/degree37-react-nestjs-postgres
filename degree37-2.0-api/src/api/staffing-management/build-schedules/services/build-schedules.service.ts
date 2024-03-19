import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedules.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, EntityRepository } from 'typeorm';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity'; // Update with the actual path
import { StaffScheduleStatusEnum } from 'src/api/crm/contacts/staff/staffSchedule/enum/staff-schedule.enum'; // Update with the actual path  // Update with the actual path
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Sessions } from 'src/api/operations-center/operations/sessions/entities/sessions.entity';
import { NonCollectionEvents } from 'src/api/operations-center/operations/non-collection-events/entities/oc-non-collection-events.entity';
import { ScheduleOperationStatus } from '../entities/schedule-operation-status.entity';

@Injectable()
@EntityRepository(Schedule)
export class BuildSchedulesService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(OperationsStatus)
    private readonly operationsStatusRepository: Repository<OperationsStatus>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(ScheduleOperationStatus)
    private readonly scheduleOperationStatusRepository: Repository<ScheduleOperationStatus>
  ) {}
  async createSchedule(createScheduleDto: any) {
    if (!createScheduleDto) {
      throw new HttpException('Invalid schedule data', HttpStatus.BAD_REQUEST);
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const schedule = new Schedule();
      schedule.start_date = createScheduleDto.start_date;
      schedule.end_date = createScheduleDto.end_date;
      schedule.schedule_status = createScheduleDto.schedule_status;
      schedule.collection_operation_id =
        createScheduleDto.collection_operation_id;
      schedule.is_archived = createScheduleDto.is_archived;
      schedule.is_flagged = createScheduleDto.is_flagged;
      schedule.is_paused = createScheduleDto.is_paused;
      schedule.is_locked = createScheduleDto.is_locked;
      schedule.created_by = createScheduleDto.created_by;

      const newSchedule = this.scheduleRepository.create(schedule);
      const scheduleData = await this.scheduleRepository.save(newSchedule);
      const operations = await this.createScheduleOperation(
        createScheduleDto,
        scheduleData.id
      );

      scheduleData.operation_status = operations;

      return scheduleData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Failed to create schedule',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createScheduleOperation(createScheduleDto: any, scheduleId: any) {
    if (!createScheduleDto) {
      throw new HttpException('Invalid schedule data', HttpStatus.BAD_REQUEST);
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const promises: any[] = [];
      for (const status of createScheduleDto.operation_status) {
        const scheduleOperation = new ScheduleOperationStatus();
        scheduleOperation.is_archived = createScheduleDto.is_archived;
        scheduleOperation.created_by = createScheduleDto.created_by;
        scheduleOperation.schedule_id = scheduleId;
        scheduleOperation.operation_status_id = status;
        const newObj =
          this.scheduleOperationStatusRepository.create(scheduleOperation);
        const promise = this.scheduleOperationStatusRepository.save(newObj);
        promises.push(promise);
      }
      const savedEntries: any = await Promise.all(promises);
      await queryRunner.commitTransaction();
      return savedEntries;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Failed to create schedule operation:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
