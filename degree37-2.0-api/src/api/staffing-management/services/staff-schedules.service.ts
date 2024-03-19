import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonFunction } from 'src/api/crm/contacts/common/common-functions';
import { StaffAssignments } from 'src/api/crm/contacts/staff/staffSchedule/entity/self-assignment.entity';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { Repository } from 'typeorm';
import { FilterStaffSchedulesInterface } from '../staff-schedule/interfaces/filter-staff-schedules';
import { SelectQueryBuilder } from 'typeorm/browser';
import { StaffScheduleInfoDto } from '../staff-schedule/dto/staff-schedules.dto';
import { ScheduleStatusEnum } from '../build-schedules/entities/schedules.entity';

@Injectable()
export class StaffSchedulesService {
  private readonly message = 'Staff Schedule';

  constructor(
    private readonly commonFunction: CommonFunction,
    @InjectRepository(StaffAssignments)
    private readonly staffAssignmentsRepository: Repository<StaffAssignments>
  ) {}

  /**
   * Gets the base query used to fetch staff schedule list data
   *
   * The staff_assignments table is at the root of the query, it has relationships through:
   * - staff_id to join with staff table - staff_id, staff_name
   * - role_id to join with contacts_roles table - role_name
   * - shift_id to join with shifts table - shift_start_time, shift_end_time, return_time, depart_time
   *
   * Here we join the three operation type tables(sessions, drives, oc_non_collection_events) using a left join.
   *
   * Now we can COALESCE and return the data based on type of table, there we get the following values:
   *
   * date, account_name, is_on_leave
   *
   * @param page The current page in a pagination list.
   * @param limit The limit of returned data.
   * @returns The base query without any filtering added.
   */
  getBaseQuery(
    page: number,
    limit: number
  ): SelectQueryBuilder<StaffAssignments> {
    let query = this.staffAssignmentsRepository
      .createQueryBuilder('staff_assignments')
      .innerJoin('staff', 'staff', 'staff_assignments.staff_id = staff.id')
      .innerJoin(
        'contacts_roles',
        'contact_role',
        'staff_assignments.role_id = contact_role.id'
      )
      .innerJoin('shifts', 'shift', 'staff_assignments.shift_id = shift.id')
      .leftJoin('staff_leave', 'staff_leave', 'staff.id = staff_leave.staff_id')
      .leftJoin(
        'sessions',
        'session',
        `staff_assignments.operation_id = session.id AND staff_assignments.operation_type = 'session'`
      )
      .leftJoin(
        'drives',
        'drive',
        `staff_assignments.operation_id = drive.id AND staff_assignments.operation_type = 'drives'`
      )
      .leftJoin(
        'oc_non_collection_events',
        'oc_non_collection_event',
        `staff_assignments.operation_id = oc_non_collection_event.id AND staff_assignments.operation_type = 'non_collection_events'`
      )
      .leftJoin('accounts', 'account', 'drive.account_id = account.id')
      .leftJoin(
        'facility',
        'facility',
        'session.donor_center_id = facility.id AND facility.donor_center IS TRUE'
      )
      .select([
        '(staff.id) as staff_id',
        `(staff.first_name || ' ' || staff.last_name) as staff_name`,
        '(contact_role.name) as role_name',
        '(staff_assignments.total_hours) as total_hours',
        '(shift.start_time) as shift_start_time',
        '(shift.end_time) as shift_end_time',
        `(shift.start_time + (staff_assignments.lead_time || ' MINUTES')::interval) as return_time`,
        `(shift.end_time + (staff_assignments.breakdown_time || ' MINUTES')::interval) as depart_time`,
        'COALESCE(drive.date, session.date, oc_non_collection_event.date) as date',
        'COALESCE(account.name, facility.name, oc_non_collection_event.event_name) as account_name',
        '((COALESCE(drive.date, session.date, oc_non_collection_event.date) BETWEEN staff_leave.begin_date AND staff_leave.end_date)) as is_on_leave',
      ])
      .where('staff_assignments.is_archived = false');

    if (page && limit) {
      const { skip, take } = this.commonFunction.pagination(limit, page);

      query = query.limit(take).offset(skip);
    }
    return query;
  }

  /**
   * Gets all of the staff schedule data
   *
   * @param page The current page in a pagination list.
   * @param limit The limit of returned data.
   * @returns An array of staff schedules.
   */
  async get(page: number, limit: number) {
    try {
      const response = await this.getBaseQuery(page, limit).getRawMany();

      return resSuccess(
        `${this.message} fetched successfully.`,
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        response,
        response.length
      );
    } catch (exception) {
      return resError(
        exception.message,
        ErrorConstants.Error,
        exception.status
      );
    }
  }

  /**
   * Gets all of the filtered staff schedule data
   *
   * @param filter The filter for the staff schedule data.
   * @returns An array of staff schedules.
   */
  async search(filter: FilterStaffSchedulesInterface) {
    try {
      const query = this.getBaseQuery(filter?.page, filter?.limit);

      if (filter?.keyword) {
        query.andWhere(
          `(staff.first_name || ' ' || staff.last_name) ILIKE '%${filter.keyword}%'`
        );
      }
      if (filter?.staff_id) {
        query.andWhere(`staff.id = ${filter.staff_id}`);
      }

      if (filter?.team_id) {
        query
          .leftJoin(
            'team_staff',
            'team_staff',
            'staff.id = team_staff.staff_id'
          )
          .andWhere(`team_staff.team_id = ${filter.team_id}`);
      }

      if (filter?.collection_operation_id) {
        query.andWhere(
          `staff.collection_operation_id = ${filter.collection_operation_id} `
        );
      }

      if (filter?.donor_id) {
        query
          .leftJoin(
            'staff_donor_centers_mapping',
            'staff_donor_center',
            'staff.id = staff_donor_center.staff_id'
          )
          .andWhere(`staff_donor_center.donor_center_id = ${filter.donor_id}`);
      }

      if (filter?.schedule_status_id || filter?.schedule_status_id == 0) {
        const enumValue =
          Object.values(ScheduleStatusEnum)[filter?.schedule_status_id];
        query
          .leftJoin(
            'schedule',
            'schedule',
            'staff.collection_operation_id = schedule.collection_operation_id'
          )
          .andWhere(`schedule.schedule_status = '${enumValue}'`);
      }

      if (filter?.schedule_start_date) {
        query.andWhere(
          `COALESCE(drive.date, session.date, oc_non_collection_event.date) = '${filter.schedule_start_date}'`
        );
      }

      const response = await query.getRawMany<StaffScheduleInfoDto>();

      return resSuccess(
        `${this.message} fetched successfully.`,
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        response,
        response.length
      );
    } catch (exception) {
      return resError(
        exception.message,
        ErrorConstants.Error,
        exception.status
      );
    }
  }
}
