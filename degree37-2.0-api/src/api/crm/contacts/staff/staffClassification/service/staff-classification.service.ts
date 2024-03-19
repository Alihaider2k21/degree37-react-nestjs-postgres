import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
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
import { StaffClassification } from '../entity/staff-classification.entity';
import { StaffClassificationDto } from '../dto/staff-classification.dto';
import { StaffClassificationHistory } from '../entity/staff-classification-history.entity';
import { StaffingClassification } from 'src/api/system-configuration/tenants-administration/staffing-administration/classifications/entity/classification.entity';

@Injectable({ scope: Scope.REQUEST })
export class StaffClassificationService extends HistoryService<StaffClassificationHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(StaffClassification)
    private readonly staffClassificationRepository: Repository<StaffClassification>,
    @InjectRepository(StaffClassificationHistory)
    private readonly staffClassificationHistoryRepository: Repository<StaffClassificationHistory>,
    @InjectRepository(StaffingClassification)
    private readonly staffingClassificationRepository: Repository<StaffingClassification>,
    private readonly entityManager: EntityManager
  ) {
    super(staffClassificationHistoryRepository);
  }

  async update(
    staff_id: any,
    user: any,
    staffClassificationDto: StaffClassificationDto
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      const {
        staffing_classification_id,
        target_hours_per_week,
        minimum_hours_per_week,
        maximum_hours_per_week,
        minimum_days_per_week,
        maximum_days_per_week,
        maximum_consecutive_days_per_week,
        maximum_ot_per_week,
        maximum_weekend_hours,
        maximum_consecutive_weekends,
        maximum_weekends_per_month,
        overtime_threshold,
        minimum_recovery_time,
      }: any = staffClassificationDto;

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const staff = await this.staffRepository.findOne({
        where: {
          id: staff_id,
          is_archived: false,
        },
      });

      if (!staff) {
        throw new HttpException(`Staff not found.`, HttpStatus.NOT_FOUND);
      }

      const staffingClassification: any =
        await this.staffingClassificationRepository.findOne({
          where: {
            id: staffing_classification_id,
          },
        });

      if (!staffingClassification) {
        throw new HttpException(
          `Staffing classification not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const staffClassification =
        await this.staffClassificationRepository.findOne({
          where: {
            staff_id: {
              id: staff_id,
            },
            is_archived: false,
          },
          relations: ['staffing_classification_id', 'staff_id'],
        });

      if (staffClassification) {
        const staffClassificationBeforeUpdate = {
          ...staffClassification,
        };

        staffClassification.staffing_classification_id = staffingClassification;
        staffClassification.target_hours_per_week = target_hours_per_week ?? 0;
        staffClassification.minimum_hours_per_week =
          minimum_hours_per_week ?? 0;
        staffClassification.maximum_hours_per_week = maximum_hours_per_week;
        staffClassification.minimum_days_per_week = minimum_days_per_week;
        staffClassification.maximum_days_per_week = maximum_days_per_week;
        staffClassification.maximum_consecutive_days_per_week =
          maximum_consecutive_days_per_week;
        staffClassification.maximum_ot_per_week = maximum_ot_per_week;
        staffClassification.maximum_weekend_hours = maximum_weekend_hours;
        staffClassification.maximum_consecutive_weekends =
          maximum_consecutive_weekends;
        staffClassification.maximum_weekends_per_month =
          maximum_weekends_per_month;
        staffClassification.overtime_threshold = overtime_threshold;
        staffClassification.minimum_recovery_time = minimum_recovery_time;
        staffClassification.created_by = user;
        staffClassification.tenant_id = user.tenant;

        const updatedStaffClassification = await queryRunner.manager.save(
          staffClassification
        );

        const staffClassificationHistory = new StaffClassificationHistory();
        Object.assign(
          staffClassificationHistory,
          staffClassificationBeforeUpdate
        );

        staffClassificationHistory.staffing_classification_id =
          staffingClassification?.id;
        staffClassificationHistory.history_reason = 'C';
        staffClassificationHistory.created_by = user.id;
        staffClassificationHistory.staff_id = staff_id;
        staffClassificationHistory.tenant_id = user.tenant.id;

        await this.createHistory(staffClassificationHistory);
        staff.classification_id = staffingClassification?.id;
        await this.staffRepository.save(staff);
        await queryRunner.commitTransaction();
        return resSuccess(
          'Staff classification updated successfully',
          SuccessConstants.SUCCESS,
          HttpStatus.OK,
          updatedStaffClassification
        );
      } else {
        const newstaffClassification = new StaffClassification();
        newstaffClassification.staff_id = staff_id;
        newstaffClassification.staffing_classification_id =
          staffingClassification;
        newstaffClassification.target_hours_per_week =
          target_hours_per_week ?? 0;
        newstaffClassification.minimum_hours_per_week =
          minimum_hours_per_week ?? 0;
        newstaffClassification.maximum_hours_per_week = maximum_hours_per_week;
        newstaffClassification.minimum_days_per_week = minimum_days_per_week;
        newstaffClassification.maximum_days_per_week = maximum_days_per_week;
        newstaffClassification.maximum_consecutive_days_per_week =
          maximum_consecutive_days_per_week;
        newstaffClassification.maximum_ot_per_week = maximum_ot_per_week;
        newstaffClassification.maximum_weekend_hours = maximum_weekend_hours;
        newstaffClassification.maximum_consecutive_weekends =
          maximum_consecutive_weekends;
        newstaffClassification.maximum_weekends_per_month =
          maximum_weekends_per_month;
        newstaffClassification.overtime_threshold = overtime_threshold;
        newstaffClassification.minimum_recovery_time = minimum_recovery_time;
        newstaffClassification.created_by = user;
        newstaffClassification.tenant_id = user.tenant;
        const savedStaffClassification =
          await this.staffClassificationRepository.save(newstaffClassification);
        staff.classification_id = staffingClassification?.id;
        await this.staffRepository.save(staff);

        return resSuccess(
          'Staff classification created successfully',
          SuccessConstants.SUCCESS,
          HttpStatus.CREATED,
          savedStaffClassification
        );
      }
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< StaffClassification Update >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
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

      const staffClassification =
        await this.staffClassificationRepository.findOne({
          where,
          relations: ['staffing_classification_id'],
        });

      if (!staffClassification) {
        return resSuccess(
          'No staff classification found',
          SuccessConstants.SUCCESS,
          HttpStatus.OK,
          null
        );
      }

      return resSuccess(
        'Staff classification fetched successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        staffClassification
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
