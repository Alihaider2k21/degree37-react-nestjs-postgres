import { Repository } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { GetAllStaffSchedule } from '../dto/staff-schedule.dto';
import { StaffAssignments } from '../entity/self-assignment.entity';
import { Staff } from '../../entities/staff.entity';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { resError } from 'src/api/system-configuration/helpers/response';
dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class StaffScheduleService {
  private message = 'Staff Schedule';

  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(StaffAssignments)
    private readonly entityStaffAssignmentsRepository: Repository<StaffAssignments>,
    @InjectRepository(Staff)
    private readonly entityStaffRepository: Repository<Staff>
  ) {}

  /**
   * check entity exist in database
   * @param repository
   * @param query
   * @param entityName
   * @returns {object}
   */
  async entityExist<T>(
    repository: Repository<T>,
    query,
    entityName
  ): Promise<T> {
    const entityObj = await repository.findOne(query);
    if (!entityObj) {
      throw new HttpException(`${entityName} not found.`, HttpStatus.NOT_FOUND);
    }

    return entityObj;
  }

  async getStaffSchedules(
    getAllStaffSchedule: GetAllStaffSchedule,
    id: bigint
  ) {
    try {
      let { sortBy, sortOrder } = getAllStaffSchedule;
      const {
        page,
        limit,
        status,
        role,
        search,
        description,
        dateRange,
        period,
      } = getAllStaffSchedule;
      const staff = await this.entityStaffRepository.findOneBy({
        id: id,
        tenant_id: { id: this.request?.user?.tenant?.id },
      });
      if (!staff) {
        return resError(
          'Staff does not exist',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }
      if (sortOrder && sortBy) {
        if (sortBy === 'start_time') {
          sortBy = `(SELECT CAST(staff_assignments.clock_in_time as time))`;
        }
        if (sortBy === 'end_time') {
          sortBy = `(SELECT CAST(staff_assignments.clock_out_time as time))`;
        }
        if (sortBy === 'total_hours') {
          sortBy = 'staff_assignments.total_hours';
        }
        if (sortBy === 'status') {
          sortBy = 'staff_assignments.status';
        }
        if (sortBy === 'role') {
          sortBy = `(SELECT contacts_roles.name
        FROM contacts_roles 
        WHERE staff_assignments.role_id = contacts_roles.id)`;
        }
        sortOrder = sortOrder?.toUpperCase();
      }
      const dateQuery = ` (
        SELECT COALESCE(
          (
            SELECT DATE_TRUNC('day', sessions.date) 
            FROM sessions 
            WHERE "staff_assignments"."operation_id" = sessions.id 
            AND "staff_assignments"."operation_type" = 'session'
          ),
          (
            SELECT DATE_TRUNC('day', drives.date)
            FROM drives 
            WHERE "staff_assignments"."operation_id" = drives.id 
            AND "staff_assignments"."operation_type" = 'drives'
          ),
          (
            SELECT DATE_TRUNC('day', oc_non_collection_events.date)
            FROM oc_non_collection_events 
            WHERE "staff_assignments"."operation_id" = oc_non_collection_events.id 
            AND "staff_assignments"."operation_type" = 'non_collection_events'
            )
        )
      )`;
      if (sortBy === 'date') {
        sortBy = dateQuery;
        sortOrder = sortOrder?.toUpperCase();
      }
      const descriptionQuery = `(
        SELECT COALESCE(
              (
                  SELECT facility.name
                  FROM facility 
                  WHERE facility.id = (
                  SELECT "sessions"."donor_center_id"
                  FROM sessions
                  WHERE staff_assignments.operation_id = sessions.id 
                  AND staff_assignments.operation_type = 'session')
              ),
              (
                  SELECT accounts.name || ' ' || loc.room 
                  FROM crm_locations loc
                  JOIN drives ON loc.id = drives.location_id
                  JOIN accounts ON drives.account_id = accounts.id
                  WHERE staff_assignments.operation_id = drives.id 
                  AND staff_assignments.operation_type = 'drives'
                ),                  
                (
                  SELECT oc_non_collection_events.event_name || ' ' || loc.room
                  FROM crm_locations loc
                  JOIN oc_non_collection_events ON loc.id = oc_non_collection_events.location_id
                  WHERE staff_assignments.operation_id = oc_non_collection_events.id 
                  AND staff_assignments.operation_type = 'non_collection_events'
              )
        )
      )`;
      if (sortBy === 'description') {
        sortBy = descriptionQuery;
        sortOrder = sortOrder?.toUpperCase();
      }
      const query = this.entityStaffAssignmentsRepository
        .createQueryBuilder('staff_assignments')
        .select(
          `(
            JSON_BUILD_OBJECT(
            'id',staff_assignments.id,
            'status',staff_assignments.status,
            'start_time', staff_assignments.clock_in_time,
            'end_time', staff_assignments.clock_out_time,
            'total_hours',total_hours)
            )
            as staff_assignments`
        )
        .addSelect(
          `(
            SELECT contacts_roles.name
            FROM contacts_roles 
            WHERE staff_assignments.role_id = contacts_roles.id
              )`,
          'role'
        )
        .addSelect(
          `( 
             SELECT COALESCE(
              (SELECT JSON_BUILD_OBJECT('date', sessions.date,'description',(
                SELECT dc.name
                FROM facility dc
                WHERE dc.id = sessions.donor_center_id
              ) ) 
              FROM sessions 
              WHERE staff_assignments.operation_id = sessions.id 
              AND staff_assignments.operation_type = 'session'
              ),
              (SELECT JSON_BUILD_OBJECT('date', drives.date,'description',(
                SELECT accounts.name || ' ' || loc.room 
               FROM crm_locations loc
                JOIN drives ON loc.id = drives.location_id
                JOIN accounts ON drives.account_id = accounts.id
                WHERE staff_assignments.operation_id = drives.id 
                AND staff_assignments.operation_type = 'drives'
            ))
              FROM drives 
              WHERE staff_assignments.operation_id = drives.id 
              AND staff_assignments.operation_type = 'drives'
              ),
              (SELECT JSON_BUILD_OBJECT('date', oc_non_collection_events.date,'description',(
                SELECT oc_non_collection_events.event_name || ' ' || loc.room 
                FROM crm_locations loc
                WHERE loc.id = oc_non_collection_events.location_id
            )) 
              FROM oc_non_collection_events 
              WHERE staff_assignments.operation_id = oc_non_collection_events.id 
              AND staff_assignments.operation_type = 'non_collection_events'
              )
          ))`,
          'date_description'
        )
        .leftJoin('staff_assignments.role_id', 'role_id')
        .orderBy(
          sortBy || 'staff_assignments.id',
          (sortOrder as 'ASC' | 'DESC') || 'DESC'
        )
        .where(`staff_assignments.is_archived = false`)
        .getQuery();

      let withWhereQuery = query.split('ORDER BY')[0];
      const orderQuery = query.split('ORDER BY')[1];

      withWhereQuery += ` AND staff_assignments.staff_id = ${staff.id}`;
      withWhereQuery += ` AND staff_assignments.tenant_id = ${this.request?.user?.tenant?.id}`;

      if (role) {
        withWhereQuery += ` AND staff_assignments.role_id = ${role}`;
      }

      if (status) {
        withWhereQuery += ` AND staff_assignments.status = '${status}'`;
      }

      if (dateRange) {
        const startDate = dateRange?.split(' ')[0];
        const endDate = dateRange?.split(' ')[1];
        withWhereQuery += ` AND ${dateQuery} >= DATE '${startDate}'`;
        withWhereQuery += ` AND ${dateQuery} <= DATE '${endDate}'`;
      }

      if (period) {
        withWhereQuery += (() => {
          switch (period) {
            case 'today':
              return ` AND ${dateQuery} = CURRENT_DATE`;
            case 'this_week':
              return ` AND DATE_PART('week',${dateQuery}) = DATE_PART('week',CURRENT_DATE)`;
            case 'next_2_weeks':
              return ` AND DATE_PART('week',${dateQuery}) > DATE_PART('week',CURRENT_DATE) AND ${dateQuery} <= (CURRENT_DATE + INTERVAL '2 weeks')`;
            case 'past_2_weeks':
              return ` AND ${dateQuery} >= CURRENT_DATE - INTERVAL '2 weeks' AND DATE_PART('week',${dateQuery}) < DATE_PART('week',CURRENT_DATE)`;
            case 'this_month':
              return ` AND ${dateQuery} BETWEEN DATE_TRUNC('month', CURRENT_DATE) AND DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') - INTERVAL '1 day'`;
            case 'last_month':
              return ` AND ${dateQuery} BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day')`;
            case 'all_past':
              return ` AND ${dateQuery} < CURRENT_DATE`;
            case 'all_future':
              return ` AND ${dateQuery} >= CURRENT_DATE`;
            default:
              return '';
          }
        })();
      }

      if (description) {
        withWhereQuery += ` AND ${descriptionQuery} = '${description}'`;
      }
      if (search) {
        withWhereQuery += ` AND ( ${descriptionQuery} ILIKE '%${search}%' OR (
            SELECT cr.name
            FROM contacts_roles cr
            WHERE staff_assignments.role_id = cr.id) ILIKE '%${search}%')`;
      }

      const count = await this.entityStaffAssignmentsRepository.query(
        ` SELECT COUNT(*) OVER()
        FROM (${withWhereQuery} ORDER BY ${orderQuery} ) as subquery`
      );

      const assignments = await this.entityStaffAssignmentsRepository.query(
        withWhereQuery +
          ' ORDER BY ' +
          orderQuery +
          ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`
      );
      return {
        status: HttpStatus.OK,
        message: 'Staff Schedules Fetched Successfully',
        count: count?.[0]?.count,
        data: assignments,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        { message: ['Something went wrong'], e },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDescriptionDropdown() {
    try {
      const query = this.entityStaffAssignmentsRepository
        .createQueryBuilder('staff_assignments')
        .select(
          `(
            SELECT COALESCE(
                  (
                      SELECT facility.name
                      FROM facility 
                      WHERE facility.id = (
                      SELECT "sessions"."donor_center_id"
                      FROM sessions
                      WHERE staff_assignments.operation_id = sessions.id 
                      AND staff_assignments.operation_type = 'session')
                  ),
                  (
                      SELECT accounts.name || ' ' || loc.room 
                      FROM crm_locations loc
                      JOIN drives ON loc.id = drives.location_id
                      JOIN accounts ON drives.account_id = accounts.id
                      WHERE staff_assignments.operation_id = drives.id 
                      AND staff_assignments.operation_type = 'drives'
                    ),                  
                    (
                      SELECT oc_non_collection_events.event_name || ' ' || loc.room
                      FROM crm_locations loc
                      JOIN oc_non_collection_events ON loc.id = oc_non_collection_events.location_id
                      WHERE staff_assignments.operation_id = oc_non_collection_events.id 
                      AND staff_assignments.operation_type = 'non_collection_events'
                  )
            )
          )`,
          'date_description'
        )
        .leftJoin('staff_assignments.role_id', 'role_id')
        .orderBy('staff_assignments.id', 'DESC')
        .where(`staff_assignments.is_archived = false`)
        .getQuery();

      let withWhereQuery = query.split('ORDER BY')[0];
      const orderQuery = query.split('ORDER BY')[1];

      withWhereQuery += ` AND staff_assignments.tenant_id = ${this.request?.user?.tenant?.id}`;
      const descriptions = await this.entityStaffAssignmentsRepository.query(
        withWhereQuery + ' ORDER BY ' + orderQuery
      );
      return {
        status: HttpStatus.OK,
        message: 'Staff Schedules Descriptions Fetched Successfully',
        data: descriptions,
      };
    } catch (error) {
      return new HttpException(
        { message: ['Something went wrong'], error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * fetch single schedule
   * @param id
   * @returns {object}
   */
  async findOne(id: any) {
    try {
      const staffAssignment = await this.entityStaffAssignmentsRepository
        .createQueryBuilder('staff_assignments')
        .select(
          `(
          JSON_BUILD_OBJECT(
          'id',staff_assignments.id,
          'status',staff_assignments.status,
          'start_time', staff_assignments.clock_in_time,
          'end_time', staff_assignments.clock_out_time,
          'created_at', staff_assignments.created_at,
          'total_hours',total_hours)
          )
          as staff_assignment`
        )
        .addSelect(
          `(
          SELECT contacts_roles.name
          FROM contacts_roles 
          WHERE staff_assignments.role_id = contacts_roles.id
            )`,
          'role'
        )
        .addSelect(
          `(SELECT  JSON_BUILD_OBJECT('first_name' , "user".first_name,'last_name' , "user".last_name)
           FROM "user" 
          WHERE staff_assignments.created_by = "user".id)`,
          'created_by'
        )
        .addSelect(
          `( 
           SELECT COALESCE(
            (SELECT JSON_BUILD_OBJECT('date', sessions.date,'description',(
              SELECT dc.name
              FROM facility dc
              WHERE dc.id = sessions.donor_center_id
            ) ) 
            FROM sessions 
            WHERE staff_assignments.operation_id = sessions.id 
            AND staff_assignments.operation_type = 'session'
            ),
            (SELECT JSON_BUILD_OBJECT('date', drives.date,'description',(
              SELECT accounts.name || ' ' || loc.room 
             FROM crm_locations loc
              JOIN drives ON loc.id = drives.location_id
              JOIN accounts ON drives.account_id = accounts.id
              WHERE staff_assignments.operation_id = drives.id 
              AND staff_assignments.operation_type = 'drives'
          ))
            FROM drives 
            WHERE staff_assignments.operation_id = drives.id 
            AND staff_assignments.operation_type = 'drives'
            ),
            (SELECT JSON_BUILD_OBJECT('date', oc_non_collection_events.date,'description',(
              SELECT oc_non_collection_events.event_name || ' ' || loc.room 
              FROM crm_locations loc
              WHERE loc.id = oc_non_collection_events.location_id
          )) 
            FROM oc_non_collection_events 
            WHERE staff_assignments.operation_id = oc_non_collection_events.id 
            AND staff_assignments.operation_type = 'non_collection_events'
            )
        ))`,
          'date_description'
        )
        .leftJoin('staff_assignments.role_id', 'role_id')
        .leftJoin('staff_assignments.created_by', 'created_by')
        .where(`staff_assignments.is_archived = false`)
        .andWhere(`staff_assignments.id = ${id}`)
        .getRawOne();
      if (!staffAssignment) {
        throw new HttpException(
          `Staff schedule not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully.`,
        data: { ...staffAssignment },
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< CRM Contact Staff Schedule >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async archive(id: any) {
    try {
      const query = {
        where: {
          id,
          is_archived: false,
        },
      };

      const { is_archived, ...entityStaffAssignmentsRepository } =
        await this.entityExist(
          this.entityStaffAssignmentsRepository,
          query,
          this.message
        );
      entityStaffAssignmentsRepository['is_archived'] = !is_archived;
      const updatedEntityStaffAssignmentsRepository =
        await this.entityStaffAssignmentsRepository.save(
          entityStaffAssignmentsRepository
        );

      return {
        status: HttpStatus.NO_CONTENT,
        message: `${this.message} Archived Successfully`,
        data: updatedEntityStaffAssignmentsRepository,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
