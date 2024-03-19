import {
  HttpStatus,
  Inject,
  Injectable,
  Scope,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import {
  resError,
  resSuccess,
} from '../../../../../system-configuration/helpers/response';
import { SuccessConstants } from '../../../../../system-configuration/constants/success.constants';
import { ErrorConstants } from '../../../../../system-configuration/constants/error.constants';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from '../../../../../../common/interface/request';
import { HistoryService } from '../../../../../common/services/history.service';
import { User } from '../../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { StaffShiftScheduleDto } from '../dto/staff-shift-schedule.dto';
import { StaffShiftSchedule } from '../entity/staff-shift-schedule.entity';
import { StaffShiftScheduleHistory } from '../entity/staff-shift-schedule-history';

@Injectable({ scope: Scope.REQUEST })
export class StaffShiftScheduleService extends HistoryService<StaffShiftScheduleHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(StaffShiftSchedule)
    private readonly staffShiftScheduleRepository: Repository<StaffShiftSchedule>,
    @InjectRepository(StaffShiftScheduleHistory)
    private readonly staffShiftScheduleHistoryRepository: Repository<StaffShiftScheduleHistory>,
    private readonly entityManager: EntityManager
  ) {
    super(staffShiftScheduleHistoryRepository);
  }

  async update(
    staff_id: any,
    user: any,
    staffShiftSchedulDto: StaffShiftScheduleDto
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      const {
        monday_start_time,
        monday_end_time,
        tuesday_start_time,
        tuesday_end_time,
        wednesday_start_time,
        wednesday_end_time,
        thursday_start_time,
        thursday_end_time,
        friday_start_time,
        friday_end_time,
        saturday_start_time,
        saturday_end_time,
        sunday_start_time,
        sunday_end_time,
      } = staffShiftSchedulDto;

      await queryRunner.connect();
      await queryRunner.startTransaction();
      const where: any = {
        staff_id: { id: staff_id },
        is_archived: false,
      };

      const staffId: any = staff_id;
      const staff = await this.staffRepository.findOne({
        where: {
          id: staffId,
          is_archived: false,
        },
      });

      if (!staff) {
        throw new HttpException(`Staff not found.`, HttpStatus.NOT_FOUND);
      }

      const staffShiftSchedule =
        await this.staffShiftScheduleRepository.findOne({
          where,
        });

      if (staffShiftSchedule) {
        const staffShiftScheduleBeforeUpdate = { ...staffShiftSchedule };
        const staffShiftScheduleHistory = new StaffShiftScheduleHistory();
        Object.assign(
          staffShiftScheduleHistory,
          staffShiftScheduleBeforeUpdate
        );

        staffShiftScheduleHistory.history_reason = 'C';
        staffShiftScheduleHistory.created_by = user.id;
        staffShiftScheduleHistory.tenant_id = user.tenant.id;
        staffShiftScheduleHistory.staff_id = staffId;
        await this.createHistory(staffShiftScheduleHistory);

        staffShiftSchedule.monday_start_time = monday_start_time;
        staffShiftSchedule.monday_end_time = monday_end_time;
        staffShiftSchedule.tuesday_start_time = tuesday_start_time;
        staffShiftSchedule.tuesday_end_time = tuesday_end_time;
        staffShiftSchedule.wednesday_start_time = wednesday_start_time;
        staffShiftSchedule.wednesday_end_time = wednesday_end_time;
        staffShiftSchedule.thursday_start_time = thursday_start_time;
        staffShiftSchedule.thursday_end_time = thursday_end_time;
        staffShiftSchedule.friday_start_time = friday_start_time;
        staffShiftSchedule.friday_end_time = friday_end_time;
        staffShiftSchedule.saturday_start_time = saturday_start_time;
        staffShiftSchedule.saturday_end_time = saturday_end_time;
        staffShiftSchedule.sunday_start_time = sunday_start_time;
        staffShiftSchedule.sunday_end_time = sunday_end_time;
        staffShiftSchedule.staff_id = staffId;

        const updatedStaffShiftSchedule = await queryRunner.manager.save(
          staffShiftSchedule
        );

        await queryRunner.commitTransaction();

        return resSuccess(
          'Staff shift schedule updated successfully',
          SuccessConstants.SUCCESS,
          HttpStatus.OK,
          updatedStaffShiftSchedule
        );
      } else {
        const newStaffShiftSchedule = new StaffShiftSchedule();
        newStaffShiftSchedule.monday_start_time = monday_start_time;
        newStaffShiftSchedule.monday_end_time = monday_end_time;
        newStaffShiftSchedule.tuesday_start_time = tuesday_start_time;
        newStaffShiftSchedule.tuesday_end_time = tuesday_end_time;
        newStaffShiftSchedule.wednesday_start_time = wednesday_start_time;
        newStaffShiftSchedule.wednesday_end_time = wednesday_end_time;
        newStaffShiftSchedule.thursday_start_time = thursday_start_time;
        newStaffShiftSchedule.thursday_end_time = thursday_end_time;
        newStaffShiftSchedule.friday_start_time = friday_start_time;
        newStaffShiftSchedule.friday_end_time = friday_end_time;
        newStaffShiftSchedule.saturday_start_time = saturday_start_time;
        newStaffShiftSchedule.saturday_end_time = saturday_end_time;
        newStaffShiftSchedule.sunday_start_time = sunday_start_time;
        newStaffShiftSchedule.sunday_end_time = sunday_end_time;
        newStaffShiftSchedule.staff_id = staffId;
        newStaffShiftSchedule.created_by = user;
        newStaffShiftSchedule.tenant_id = user.tenant.id;

        const savedNewStaffShiftSchedule =
          await this.staffShiftScheduleRepository.save(newStaffShiftSchedule);

        return resSuccess(
          'Staff shift schedule created successfully',
          SuccessConstants.SUCCESS,
          HttpStatus.CREATED,
          savedNewStaffShiftSchedule
        );
      }
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Staff_Shift_Schedule Update >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async get(staff_id: any, user: any) {
    try {
      const staffId: any = staff_id;
      const staff = await this.staffRepository.findOne({
        where: {
          id: staffId,
          is_archived: false,
        },
      });

      if (!staff) {
        throw new HttpException(`Staff not found.`, HttpStatus.NOT_FOUND);
      }

      const where: any = {
        staff_id: {
          id: staffId,
        },
        is_archived: false,
      };

      const staffShiftSchedule =
        await this.staffShiftScheduleRepository.findOne({
          where,
        });

      if (!staffShiftSchedule) {
        return resSuccess(
          'No staff shift schedule found',
          SuccessConstants.SUCCESS,
          HttpStatus.OK,
          null
        );
      }
      return resSuccess(
        'Staff shift schedule fetched successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        staffShiftSchedule
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
