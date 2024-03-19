import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { StaffConfig } from 'src/api/system-configuration/tenants-administration/staffing-administration/staff-setups/entity/StaffConfig.entity';
import { StaffAssignments } from 'src/api/crm/contacts/staff/staffSchedule/entity/self-assignment.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { GetAllStaffingFilterInterface } from '../interface/get-staffing-filter.interface';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Roles } from '../../../../../system-configuration/platform-administration/roles-administration/role-permissions/entities/role.entity';
import { ShiftsRoles } from '../../../../../crm/crm-non-collection-profiles/blueprints/entities/shifts-roles.entity';

@Injectable()
export class StaffingService {
  constructor(
    @InjectRepository(Shifts)
    private shiftsRepository: Repository<Shifts>,
    @InjectRepository(ShiftsProjectionsStaff)
    private shiftsProjectionsStaffRepository: Repository<ShiftsProjectionsStaff>,
    @InjectRepository(StaffConfig)
    private staffSetupConfigurationRepository: Repository<StaffConfig>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
    @InjectRepository(StaffAssignments)
    private staffAssignmentsRepository: Repository<StaffAssignments>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(ShiftsRoles)
    private shiftRolesRepository: Repository<ShiftsRoles>
  ) {}

  /**
   * Calculate limit and skip
   * @param limit
   * @param page
   * @returns {skip, take}
   */
  pagination(limit: number, page: number) {
    page = page <= 0 ? 1 : page;
    const take: any = limit;
    const skip: any = (page - 1) * limit;

    return { skip, take };
  }

  getDrawHours(shifts) {
    if (shifts.length > 0) {
      // Find the earliest start time and latest end time
      const { earliestStartTime, latestEndTime } = shifts.reduce(
        (acc, shift) => {
          const startTime = new Date(shift.start_time).getTime();
          const endTime = new Date(shift.end_time).getTime();

          // Update earliest start time if the current shift has an earlier start time
          if (!acc.earliestStartTime || startTime < acc.earliestStartTime) {
            acc.earliestStartTime = startTime;
          }

          // Update latest end time if the current shift has a later end time
          if (!acc.latestEndTime || endTime > acc.latestEndTime) {
            acc.latestEndTime = endTime;
          }

          return acc;
        },
        {
          earliestStartTime: null as number | null,
          latestEndTime: null as number | null,
        }
      );

      const earliestStartDate = new Date(earliestStartTime);
      const latestEndDate = new Date(latestEndTime);

      const earliestTimeString = earliestStartDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      const latestTimeString = latestEndDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      // Combine into the desired format
      const formattedTimeRange = `${earliestTimeString} - ${latestTimeString}`;

      return formattedTimeRange;
    }
  }

  async getStaffScheduleDetails(
    driveId: bigint,
    getStaffingFilterInterface: GetAllStaffingFilterInterface
  ): Promise<any> {
    try {
      const shifts = await this.shiftsRepository.find({
        where: {
          shiftable_id: driveId,
          shiftable_type: getStaffingFilterInterface.shiftable_type,
        },
      });

      if (shifts.length === 0) {
        return {
          status: 'success',
          response: 'No shifts found',
          code: 200,
          record_count: 0,
          data: null,
        };
      }

      const drawHours = this.getDrawHours(shifts);

      // Extract shiftIds from the shifts data
      const shiftIds = shifts.map((shift) => shift.id);

      // Retrieve staff setup ids from shifts_projections_staff table
      const staffSetupIds = await this.shiftsProjectionsStaffRepository
        .createQueryBuilder('sp')
        .select('sp.staff_setup_id')
        .where('sp.shift_id IN (:...shiftIds)', {
          shiftIds: shiftIds.map((sp) => sp),
        })
        .getRawMany();

      // Extract roleIds and quantities from staff_setup_configuration table
      const staffSetupConfigurations =
        await this.staffSetupConfigurationRepository
          .createQueryBuilder('ssc')
          .select('ssc.contact_role_id, ssc.qty')
          .where('ssc.staff_setup_id IN (:...staffSetupIds)', {
            staffSetupIds: staffSetupIds.map((sp) => sp.sp_staff_setup_id),
          })
          .getRawMany();

      const roleNames = await this.rolesRepository
        .createQueryBuilder('r')
        .select('r.id, r.name')
        .whereInIds(staffSetupConfigurations.map((ssc) => ssc.contact_role_id))
        .getRawMany();

      let order: any;

      if (getStaffingFilterInterface?.sortBy) {
        const orderDirection = getStaffingFilterInterface.sortOrder || 'DESC';

        if (getStaffingFilterInterface?.sortBy == 'role') {
          order = { name: 'role', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'staff_name') {
          order = { name: 'staff_name', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'begin_day') {
          order = { name: 'begin_day', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'draw_hours') {
          order = { name: 'draw_hours', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'end_day') {
          order = { name: 'end_day', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'total_hours') {
          order = { name: 'total_hours', orderDirection };
        } else {
          const orderBy = getStaffingFilterInterface?.sortBy;
          order = { name: orderBy, orderDirection };
        }
      } else {
        order = { name: 'id', orderDirection: 'DESC' };
      }

      const limit: number = getStaffingFilterInterface?.limit
        ? +getStaffingFilterInterface?.limit
        : +process.env.PAGE_SIZE;

      const page = getStaffingFilterInterface?.page
        ? +getStaffingFilterInterface?.page
        : 1;

      const staffAssignments = await this.staffAssignmentsRepository
        .createQueryBuilder('sa')
        .select(
          'sa.id, sa.clock_in_time, sa.clock_out_time, sa.total_hours, sa.staff_id, sa.role_id'
        )
        .where('sa.shift_id IN (:...shiftIds)', { shiftIds })
        .andWhere('sa.role_id IN (:...roleIds)', {
          roleIds: roleNames.map((role) => role.id),
        })
        .andWhere({ operation_id: driveId })
        .andWhere({
          operation_type: getStaffingFilterInterface.shiftable_type,
        })
        .getRawMany();

      const staffDetails = await this.staffRepository
        .createQueryBuilder('s')
        .select('s.id, s.first_name, s.last_name')
        .whereInIds(staffAssignments.map((sa) => sa.staff_id))
        .getRawMany();

      const duplicateRows = [];
      staffAssignments.forEach((item) => {
        const staffSetup = staffSetupConfigurations.find(
          (sd) => sd.contact_role_id === item.role_id
        );
        if (staffSetup) {
          for (let i = 0; i < staffSetup.qty - 1; i++) {
            duplicateRows.push({ ...item });
          }
        }
      });

      // Combine original and duplicated rows
      const allRows = [...staffAssignments, ...duplicateRows];
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const paginatedRows = allRows.slice(startIdx, endIdx);

      const totalCount = allRows.length;

      const mergedData = paginatedRows
        .map((sa) => {
          const staffDetail = staffDetails.find((sd) => sd.id === sa.staff_id);

          if (staffDetail)
            return {
              id: staffDetail.id,
              begin_day: sa.clock_in_time,
              end_day: sa.clock_out_time,
              draw_hours: drawHours,
              role: roleNames.find((item) => item.id == sa.role_id)?.name,
              staff_name: `${staffDetail.first_name} ${staffDetail.last_name}`,
              total_hours: sa.total_hours,
              is_archived: false,
            };
        })
        .filter(Boolean);

      if (order.name === 'begin_day') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(a.begin_day, b.begin_day);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(b.begin_day, a.begin_day);
          });
        }
      } else if (order.name === 'end_day') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(a.end_day, b.end_day);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(b.end_day, a.end_day);
          });
        }
      } else if (order.name === 'total_hours') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(
              a.total_hours.toString(),
              b.total_hours.toString()
            );
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(
              b.total_hours.toString(),
              a.total_hours.toString()
            );
          });
        }
      } else if (order.name === 'role') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(a.role, b.role);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(b.role, a.role);
          });
        }
      } else if (order.name === 'draw_hours') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(a.draw_hours, b.draw_hours);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(b.draw_hours, a.draw_hours);
          });
        }
      } else if (order.name === 'staff_name') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(a.staff_name, b.staff_name);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(b.staff_name, a.staff_name);
          });
        }
      }

      return {
        status: 'success',
        response: '',
        code: 200,
        record_count: totalCount,
        data: mergedData,
      };
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  sortObj(a: string, b: string): number {
    const fa: string = a.toLowerCase();
    const fb: string = b.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  }

  sortByDatetime = (a: any, b: any): number => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    // Compare dates
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  };

  async getStaffScheduleNceDetails(
    driveId: bigint,
    getStaffingFilterInterface: GetAllStaffingFilterInterface
  ) {
    try {
      const shifts = await this.shiftsRepository.find({
        where: {
          shiftable_id: driveId,
          shiftable_type: getStaffingFilterInterface.shiftable_type,
        },
      });

      if (shifts.length === 0) {
        return {
          status: 'success',
          response: 'No shifts found',
          code: 200,
          record_count: 0,
          data: null,
        };
      }

      const drawHours = this.getDrawHours(shifts);

      // Extract shiftIds from the shifts data
      const shiftIds = shifts.map((shift) => shift.id);

      // Retrieve Shift roles and qty from shift_roles table
      const shiftRoles = await this.shiftRolesRepository
        .createQueryBuilder('sr')
        .select('sr.shift_id,sr.role_id,sr.quantity')
        .where('sr.shift_id IN (:...shiftIds)', {
          shiftIds: shiftIds.map((sp) => sp),
        })
        .getRawMany();

      const roleNames = await this.rolesRepository
        .createQueryBuilder('r')
        .select('r.id, r.name')
        .whereInIds(shiftRoles.map((ssc) => ssc.role_id))
        .getRawMany();

      let order: any;

      if (getStaffingFilterInterface?.sortBy) {
        const orderDirection = getStaffingFilterInterface.sortOrder || 'DESC';

        if (getStaffingFilterInterface?.sortBy == 'role') {
          order = { name: 'role', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'staff_name') {
          order = { name: 'staff_name', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'begin_day') {
          order = { name: 'begin_day', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'draw_hours') {
          order = { name: 'draw_hours', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'end_day') {
          order = { name: 'end_day', orderDirection };
        } else if (getStaffingFilterInterface?.sortBy == 'total_hours') {
          order = { name: 'total_hours', orderDirection };
        } else {
          const orderBy = getStaffingFilterInterface?.sortBy;
          order = { name: orderBy, orderDirection };
        }
      } else {
        order = { name: 'id', orderDirection: 'DESC' };
      }

      const limit: number = getStaffingFilterInterface?.limit
        ? +getStaffingFilterInterface?.limit
        : +process.env.PAGE_SIZE;

      const page = getStaffingFilterInterface?.page
        ? +getStaffingFilterInterface?.page
        : 1;

      const staffAssignments = await this.staffAssignmentsRepository
        .createQueryBuilder('sa')
        .select(
          'sa.id, sa.clock_in_time, sa.clock_out_time, sa.total_hours, sa.staff_id, sa.role_id'
        )
        .where('sa.shift_id IN (:...shiftIds)', { shiftIds })
        .andWhere('sa.role_id IN (:...roleIds)', {
          roleIds: roleNames.map((role) => role.id),
        })
        .andWhere({ operation_id: driveId })
        .andWhere({
          operation_type: getStaffingFilterInterface.shiftable_type,
        })
        .getRawMany();

      const staffDetails = await this.staffRepository
        .createQueryBuilder('s')
        .select('s.id, s.first_name, s.last_name')
        .whereInIds(staffAssignments.map((sa) => sa.staff_id))
        .getRawMany();

      const duplicateRows = [];
      staffAssignments.forEach((item) => {
        const staffSetup = shiftRoles.find((sd) => sd.role_id === item.role_id);
        if (staffSetup) {
          for (let i = 0; i < staffSetup.quantity - 1; i++) {
            duplicateRows.push({ ...item });
          }
        }
      });

      // Combine original and duplicated rows
      const allRows = [...staffAssignments, ...duplicateRows];
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const paginatedRows = allRows.slice(startIdx, endIdx);

      const totalCount = allRows.length;

      const mergedData = paginatedRows
        .map((sa) => {
          const staffDetail = staffDetails.find((sd) => sd.id === sa.staff_id);

          if (staffDetail)
            return {
              id: staffDetail.id,
              begin_day: sa.clock_in_time,
              end_day: sa.clock_out_time,
              draw_hours: drawHours,
              role: roleNames.find((item) => item.id == sa.role_id)?.name,
              staff_name: `${staffDetail.first_name} ${staffDetail.last_name}`,
              total_hours: sa.total_hours,
              is_archived: false,
            };
        })
        .filter(Boolean);

      if (order.name === 'begin_day') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(a.begin_day, b.begin_day);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(b.begin_day, a.begin_day);
          });
        }
      } else if (order.name === 'end_day') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(a.end_day, b.end_day);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortByDatetime(b.end_day, a.end_day);
          });
        }
      } else if (order.name === 'total_hours') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(
              a.total_hours.toString(),
              b.total_hours.toString()
            );
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(
              b.total_hours.toString(),
              a.total_hours.toString()
            );
          });
        }
      } else if (order.name === 'role') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(a.role, b.role);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(b.role, a.role);
          });
        }
      } else if (order.name === 'draw_hours') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(a.draw_hours, b.draw_hours);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(b.draw_hours, a.draw_hours);
          });
        }
      } else if (order.name === 'staff_name') {
        if (order.orderDirection.toLowerCase() === 'asc') {
          mergedData.sort((a, b) => {
            return this.sortObj(a.staff_name, b.staff_name);
          });
        } else {
          mergedData.sort((a, b) => {
            return this.sortObj(b.staff_name, a.staff_name);
          });
        }
      }

      return {
        status: 'success',
        response: '',
        code: 200,
        record_count: totalCount,
        data: mergedData,
      };
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
