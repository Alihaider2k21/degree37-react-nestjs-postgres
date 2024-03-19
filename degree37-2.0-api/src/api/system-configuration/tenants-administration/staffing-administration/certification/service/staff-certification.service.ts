import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { AssignStaffCertificationDto } from '../dto/assign-staff-certification.dto';
import { Certification } from '../entity/certification.entity';

import { StaffCertification } from '../entity/staff-certification.entity';
import { StaffCertificationHistory } from '../entity/staff-certification-history.entity';
import { resError, resSuccess } from '../../../../helpers/response';
import { SuccessConstants } from '../../../../constants/success.constants';
import { ErrorConstants } from '../../../../constants/error.constants';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from '../../../../../../common/interface/request';
import { pagination } from 'src/common/utils/pagination';
import { Sort } from 'src/common/interface/sort';
import { FilterStaffCertification } from '../interfaces/query-staff-certification.interface';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
import { HistoryService } from 'src/api/common/services/history.service';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import {
  FilterNotCertifiedStaff,
  SortNotCertifiedStaff,
} from '../interfaces/query-not-certified-staff.interface';
import { TeamStaff } from '../../teams/entity/team-staff.entiity';
import { StaffRolesMapping } from 'src/api/crm/contacts/staff/staffRolesMapping/entities/staff-roles-mapping.entity';

@Injectable({ scope: Scope.REQUEST })
export class StaffCertificationService extends HistoryService<StaffCertificationHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(TeamStaff)
    private readonly staffTeamsRepository: Repository<TeamStaff>,
    @InjectRepository(StaffRolesMapping)
    private readonly staffRolesRepository: Repository<StaffRolesMapping>,
    @InjectRepository(StaffCertification)
    private readonly staffCertificationRepository: Repository<StaffCertification>,
    @InjectRepository(StaffCertificationHistory)
    private readonly staffCertificationHistoryRepository: Repository<StaffCertificationHistory>
  ) {
    super(staffCertificationHistoryRepository);
  }

  async getNotCertifiedStaff(
    page: number,
    limit: number,
    keyword?: string,
    sortBy?: SortNotCertifiedStaff,
    filters?: FilterNotCertifiedStaff
  ) {
    try {
      let excludeStaffIds = [];
      if (filters.certificate_id) {
        // Query Already assigned Staffs
        const certificates = await this.staffCertificationRepository.find({
          where: {
            certificate_id: filters.certificate_id,
            is_archived: false,
          },
        });
        excludeStaffIds = certificates.map((certif) => certif.staff_id);
      }

      // Building queries
      let where =
        'staff.is_archived = false' + ' AND staff.tenant_id = :tenant_id';
      const params = { tenant_id: this?.request?.user?.tenant?.id };

      let teamsQuery = this.staffTeamsRepository
        .createQueryBuilder('teams')
        .leftJoinAndSelect(
          'team',
          'team',
          'team.id = teams.team_id AND (team.is_archived = false)'
        )
        .select([
          `STRING_AGG("team"."name", ', ') AS "teams"`,
          `"teams"."staff_id" AS staff_id`,
        ])
        .groupBy('teams.staff_id');

      if (filters?.team_id) {
        teamsQuery = teamsQuery.where('team.id = :team_id');
        where += ' AND teams IS NOT NULL';
        params['team_id'] = filters?.team_id;
      }

      let rolesQuery = this.staffRolesRepository
        .createQueryBuilder('staff_roles')
        .leftJoinAndSelect(
          'contacts_roles',
          'role',
          'role.id = staff_roles.role_id AND (role.is_archived = false)'
        )
        .select([
          `STRING_AGG("role"."name", ', ') AS "roles"`,
          `staff_roles.staff_id AS staff_id`,
        ])
        .where('(staff_roles.is_archived = FALSE)')
        .groupBy('staff_roles.staff_id');

      if (filters?.role_id) {
        rolesQuery = rolesQuery.andWhere('role.id = :role_id');
        where += ' AND roles IS NOT NULL';
        params['role_id'] = filters?.role_id;
      }

      let staffsQuery = this.staffRepository
        .createQueryBuilder('staff')
        .leftJoinAndSelect(
          'staff.created_by',
          'created_by',
          'created_by.is_archived = false'
        )
        .leftJoinAndSelect(
          'staff.collection_operation_id',
          'collection_operation',
          'collection_operation.is_archived = false'
        )
        .leftJoinAndSelect(
          `(${rolesQuery.getQuery()})`,
          'roles',
          'roles.staff_id = staff.id'
        )
        .leftJoinAndSelect(
          `(${teamsQuery.getQuery()})`,
          'teams',
          'teams.staff_id = staff.id'
        )
        .select([
          `"staff"."id" AS "id"`,
          `concat("staff"."first_name", ' ', "staff"."last_name") AS "staff_name"`,
          `"collection_operation"."name" AS "collection_operation_name"`,
          'roles',
          'teams',
        ]);

      // Applying staffs filters
      if (keyword) {
        where += ` AND concat("staff"."first_name", ' ', "staff"."last_name") ILIKE :staff_name`;
        params['staff_name'] = `%${keyword}%`;
      }
      if (filters.status !== undefined) {
        where += ' AND staff.is_active = :status';
        params['status'] = filters?.status;
      }
      if (filters.co_id) {
        where += ' AND collection_operation.id = :co_id';
        params['co_id'] = filters?.co_id;
      }
      staffsQuery = staffsQuery.where(where, params).andWhere({
        ...(excludeStaffIds.length && {
          id: Not(In(excludeStaffIds)),
        }),
      });

      // Applying staffs Sorting
      if (sortBy?.sortName && sortBy.sortOrder)
        staffsQuery = staffsQuery.orderBy(sortBy.sortName, sortBy.sortOrder);

      const count = await staffsQuery.getCount();

      // Applying staffs Pagination
      if (page && limit) {
        const { skip, take } = pagination(page, limit);
        staffsQuery = staffsQuery.limit(take).offset(skip);
      }

      const records = await staffsQuery.getRawMany();

      return resSuccess(
        'Not Certified Staff Records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async assign(assignStaffCertificationDto: AssignStaffCertificationDto) {
    try {
      const certificate = await this.certificationRepository.findOne({
        where: {
          id: assignStaffCertificationDto.certification_id,
          is_archived: false,
        },
      });

      if (!certificate) {
        return resError(
          'Not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const unqiue_staff_ids = Array.from(
        new Set(assignStaffCertificationDto.staff_ids)
      );

      const staffs = await this.staffRepository.find({
        where: {
          id: In(unqiue_staff_ids),
          is_archived: false,
        },
      });

      if (staffs.length !== unqiue_staff_ids.length) {
        return resError(
          'Some Staffs are Not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const staffCertifications = staffs.map((staff) => {
        const staffCertification = new StaffCertification();
        staffCertification.certificate = certificate;
        staffCertification.certificate_start_date =
          assignStaffCertificationDto.start_date;
        staffCertification.created_by = this.request.user;
        staffCertification.staff = staff;
        staffCertification.tenant = this.request.user?.tenant;
        return staffCertification;
      });

      await this.staffCertificationRepository.insert(staffCertifications);

      return resSuccess(
        'Certification is assigned to given staff.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        null
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async get(
    page: number,
    limit: number,
    keyword?: string,
    sortBy?: Sort,
    filters?: FilterStaffCertification
  ) {
    try {
      // Building query
      let where =
        'staff_certification.is_archived = false' +
        ' AND staff_certification.tenant_id = :tenant_id';
      const params = { tenant_id: this?.request?.user?.tenant?.id };

      let teamsQuery = this.staffTeamsRepository
        .createQueryBuilder('teams')
        .leftJoinAndSelect(
          'team',
          'team',
          'team.id = teams.team_id AND (team.is_archived = false)'
        )
        .select([
          `STRING_AGG("team"."name", ', ') AS "teams"`,
          `"teams"."staff_id" AS staff_id`,
        ])
        .groupBy('teams.staff_id');

      if (filters?.team_id) {
        const teamIdArray = filters.team_id.split(',').map((id) => id.trim());

        if (teamIdArray.length === 1) {
          // Single team_id as bigint
          teamsQuery = teamsQuery.where('team.id = :team_id');
          where += ' AND teams IS NOT NULL';
          params['team_id'] = teamIdArray[0];
        } else {
          // Multiple team_id as string array
          teamsQuery = teamsQuery.where('team.id IN (:...team_id)');
          where += ' AND teams IS NOT NULL';
          params['team_id'] = teamIdArray;
        }
      }

      const rolesQuery = this.staffRolesRepository
        .createQueryBuilder('staff_roles')
        .leftJoinAndSelect(
          'contacts_roles',
          'role',
          'role.id = staff_roles.role_id AND (role.is_archived = false)'
        )
        .select([
          `STRING_AGG("role"."name", ', ') AS "roles"`,
          `staff_roles.staff_id AS staff_id`,
        ])
        .where('(staff_roles.is_archived = FALSE)')
        .groupBy('staff_roles.staff_id');

      let staffCertificationsQuery = this.staffCertificationRepository
        .createQueryBuilder('staff_certification')
        .leftJoinAndSelect('staff_certification.created_by', 'created_by')
        .leftJoinAndSelect('staff_certification.certificate', 'certificate')
        .leftJoinAndSelect(
          'staff_certification.staff',
          'staff',
          'staff.is_archived = false'
        )
        .leftJoinAndSelect(
          'business_units',
          'business_unit',
          'business_unit.id = staff.collection_operation_id AND (business_unit.is_archived = false)'
        )
        .leftJoinAndSelect(
          `(${rolesQuery.getQuery()})`,
          'roles',
          'roles.staff_id = staff.id'
        )
        .leftJoinAndSelect(
          `(${teamsQuery.getQuery()})`,
          'teams',
          'teams.staff_id = staff.id'
        )
        .select([
          'staff.id AS staff_id',
          'staff_certification.id AS staff_certification_id',
          "concat(staff.first_name, ' ', staff.last_name) AS staff_name",
          'certificate.name AS certificate_name',
          'business_unit.name AS collection_operation_name',
          'staff_certification.certificate_start_date AS certificate_start_date',
          "(certificate_start_date + concat(certificate.expiration_interval, ' months')::interval) as expiration_date",
          'roles',
          'teams',
          'certificate.expires AS expires',
        ])
        .addSelect(
          'CASE' +
            ' WHEN' +
            " (staff_certification.certificate_start_date < certificate.created_at + concat(certificate.expiration_interval, ' months')::interval) THEN true" +
            ' WHEN' +
            " (staff_certification.certificate_start_date >= certificate.created_at + concat(certificate.expiration_interval, ' months')::interval) THEN false" +
            ' END is_active'
        );

      // Applying filters
      if (keyword) {
        const [first_name, ...last_name] = keyword.split(' ');
        if (first_name) {
          where += ' AND staff.first_name ILIKE :first_name';
          params['first_name'] = `%${first_name}%`;
        }
        if (last_name.length) {
          where += ' AND staff.last_name ILIKE :last_name';
          params['last_name'] = `%${last_name.join(' ')}%`;
        }
      }
      if (filters.status !== undefined) {
        switch (filters.status) {
          case 'true': {
            where +=
              " AND (staff_certification.certificate_start_date < certificate.created_at + concat(certificate.expiration_interval, ' months')::interval)";
            break;
          }
          default: {
            where +=
              " AND (staff_certification.certificate_start_date >= certificate.created_at + concat(certificate.expiration_interval, ' months')::interval)";
            break;
          }
        }
      }
      if (filters.certification_id) {
        const certArray = filters.certification_id
          .split(',')
          .map((id) => id.trim());

        if (certArray.length === 1) {
          // Single co_id as bigint
          where += ' AND certificate.id = :certification_id';
          params['certification_id'] = certArray[0];
        } else {
          // Multiple co_ids as string array
          where += ' AND certificate.id IN (:...certification_id)';
          params['certification_id'] = certArray;
        }
      }
      if (filters?.co_id) {
        const coIdArray = filters.co_id.split(',').map((id) => id.trim());

        if (coIdArray.length === 1) {
          // Single co_id as bigint
          where += ' AND business_unit.id = :co_id';
          params['co_id'] = coIdArray[0];
        } else {
          // Multiple co_ids as string array
          where += ' AND business_unit.id IN (:...co_ids)';
          params['co_ids'] = coIdArray;
        }
      }
      if (filters.staff_id) {
        where += ' AND staff.id = :staff_id';
        params['staff_id'] = filters?.staff_id;
      }
      staffCertificationsQuery = staffCertificationsQuery.where(where, params);

      if (this.request.user?.tenant?.id) {
        where += ' AND staff_certification.tenant_id = :tenant_id';
        params['tenant_id'] = this.request.user?.tenant?.id;
      }
      // Applying Sorting
      if (sortBy.sortName && sortBy.sortOrder)
        staffCertificationsQuery = staffCertificationsQuery.orderBy(
          sortBy.sortName,
          sortBy.sortOrder
        );

      const count = await staffCertificationsQuery.getCount();

      // Applying Pagination
      if (page && limit) {
        const { skip, take } = pagination(page, limit);
        staffCertificationsQuery = staffCertificationsQuery
          .limit(take)
          .offset(skip);
      }

      const records = await staffCertificationsQuery.getRawMany();

      return resSuccess(
        'Assigned Certification Records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async delete(id: bigint) {
    try {
      const instance = await this.staffCertificationRepository.findOne({
        where: { id },
        relations: ['tenant'],
      });

      if (!instance) {
        return resError(
          'Not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const history = this.staffCertificationHistoryRepository.create({
        id: instance.id,
        staff_id: instance.staff_id,
        certificate_id: instance.certificate_id,
        certificate_start_date: instance.certificate_start_date,
        is_archived: instance.is_archived,
        history_reason: HistoryReason.D,
        created_at: new Date(),
        created_by: this.request.user?.id,
        tenant_id: instance?.tenant?.id,
      });

      // archive certification
      instance.is_archived = true;
      this.staffCertificationRepository.save(instance);

      // create certification history
      await this.createHistory(history);

      return resSuccess(
        'Certification removed.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        instance
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
