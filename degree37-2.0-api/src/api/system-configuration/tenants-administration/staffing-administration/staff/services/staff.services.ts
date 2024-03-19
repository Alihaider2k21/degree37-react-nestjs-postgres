import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Not, Repository } from 'typeorm';
import { GetAllTeamStaffDto, GetStaffOtherTeamDto } from '../dto/staff.dto';
import { StaffCollectionOperation } from '../entity/staff-collection-operation.entity';
import { TeamStaff } from '../../teams/entity/team-staff.entiity';
import { Team } from '../../teams/entity/team.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { StaffRolesMapping } from 'src/api/crm/contacts/staff/staffRolesMapping/entities/staff-roles-mapping.entity';

@Injectable({ scope: Scope.REQUEST })
export class StaffService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(StaffRolesMapping)
    private staffRolesMapping: Repository<StaffRolesMapping>,
    @InjectRepository(StaffCollectionOperation)
    private readonly staffCollectionOperation: Repository<StaffCollectionOperation>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamStaff)
    private readonly teamStaffRepository: Repository<TeamStaff>,
    private readonly entityManager: EntityManager
  ) {}

  async getStaffWithTeams(params: GetAllTeamStaffDto) {
    try {
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      let staffIds = [];

      if (params?.status) {
        Object.assign(where, {
          is_active: params?.status,
        });
      }

      if (params?.collection_operation) {
        const collectionOperationValues = params?.collection_operation
          .split(',')
          .map((item) => item.trim());

        if (collectionOperationValues.length > 0) {
          // Use the array directly with In operator
          Object.assign(where, {
            collection_operation_id: In(collectionOperationValues),
          });
        } else {
          // Use the single value without wrapping it in an array
          Object.assign(where, {
            collection_operation_id: params?.collection_operation,
          });
        }
        // Object.assign(where, {
        //   collection_operation_id: params?.collection_operation,
        // });
      }

      if (params?.team) {
        const teamData = await this.teamStaffRepository
          .createQueryBuilder('team_staff')
          .select(['team_staff.team_id', 'team_staff.staff_id'])
          .getRawMany();
        const teamStaffIds = teamData
          .filter((team) => team.team_id === Number(params.team))
          .map((team) => team.staff_id);
        staffIds = teamStaffIds;
      }

      if (params?.team) {
        Object.assign(where, {
          id: In(staffIds),
        });
      }

      if (params?.name) {
        Object.assign(where, {
          first_name: ILike(`%${params?.name}%`),
        });
      }

      const teamData = await this.teamStaffRepository
        .createQueryBuilder('staff_team')
        .select(['staff_team.team_id', 'staff_team.staff_id'])
        .getRawMany();

      const teamIdsArray = teamData.map((team) => team.team_id);

      const teams = await this.teamRepository.find({
        where: {
          id: In(teamIdsArray),
        },
        select: ['id', 'name'],
      });

      Object.assign(where, {
        tenant_id: { id: this.request.user?.tenant?.id },
      });
      let staff: any = [];
      if (params?.fetchAll) {
        staff = this.staffRepository
          .createQueryBuilder('staff')
          .leftJoinAndSelect('staff.created_by', 'created_by')
          .leftJoinAndSelect(
            'staff.collection_operation_id',
            'collection_operation'
          )
          .leftJoinAndSelect('staff.tenant_id', 'tenant_id')
          .orderBy({ 'staff.id': 'DESC' })
          .where(where);
      } else if (params?.sortName && params?.sortName !== 'team_name') {
        staff = this.staffRepository
          .createQueryBuilder('staff')
          .leftJoinAndSelect('staff.created_by', 'created_by')
          .leftJoinAndSelect(
            'staff.collection_operation_id',
            'collection_operation'
          )
          .leftJoinAndSelect('staff.tenant_id', 'tenant_id')
          .take(limit)
          .orderBy(
            params.sortName === 'collection_operation'
              ? {
                  [`collection_operation.name`]:
                    params.sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
              : {
                  [`staff.${params.sortName}`]:
                    params.sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
          )
          .skip((page - 1) * limit)
          .where({ ...where, is_archived: false });
      } else {
        staff = this.staffRepository
          .createQueryBuilder('staff')
          .leftJoinAndSelect('staff.created_by', 'created_by')
          .leftJoinAndSelect(
            'staff.collection_operation_id',
            'collection_operation'
          )
          .leftJoinAndSelect('staff.tenant_id', 'tenant_id')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'staff.id': 'DESC' })
          .where(where);
      }

      const [data, count] = await staff.getManyAndCount();

      const roles = await this.staffRolesMapping.find({
        where: {
          staff_id: In(data.map((staff) => staff.id)),
        },
        relations: ['role_id', 'staff_id'],
      });

      const dataWithTeamName = data?.map((singleStaff) => {
        const allStaffIds = teamData
          ?.filter((entry) => entry.staff_id === singleStaff.id)
          .map((entry) => entry.team_id);
        const allRoleNames = roles
          ?.filter((entry) => {
            return entry.staff_id.id === singleStaff.id;
          })
          .map((entry) => entry.role_id.name);

        const concatNameRole = allRoleNames.join(', ');
        const concatName = teams.filter((team) =>
          allStaffIds.includes(team.id)
        );
        return {
          ...singleStaff,
          teams_name: concatName,
          roles_name: concatNameRole,
        };
      });

      const collectionOperations = await this.staffCollectionOperation.find({
        where: {
          staff_id: In(data.map((team) => team.id)),
        },
        relations: ['staff_id', 'collection_operation_id'],
      });

      return {
        status: HttpStatus.OK,
        message: 'Staff Fetched Successfully',
        count: count,
        data: { staff: dataWithTeamName, collectionOperations },
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        { error: e, message: ['Something went wrong'] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getStaffOtherTeams(params: GetStaffOtherTeamDto) {
    try {
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      let staffIdsToExclude = [];
      if (params?.team) {
        const teamIdToExclude = params.team;
        const staffIdsInSameTeam = await this.teamStaffRepository
          .createQueryBuilder('staff_team')
          .select('staff_team.staff_id', 'staff_id')
          .where('staff_team.team_id = :teamId', { teamId: teamIdToExclude })
          .getRawMany();

        staffIdsToExclude = staffIdsInSameTeam.map((row) => row.staff_id) ?? [];

        let staffIds = [];
        if (params?.role) {
          const qb = this.staffRolesMapping
            .createQueryBuilder('staffRolesMapping')
            .select('staffRolesMapping.staff_id', 'staff_id')
            .where('staffRolesMapping.role_id = :role_id', {
              role_id: params.role,
            });

          const result = await qb.getRawMany();

          staffIds = result.map((row) => row.staff_id);
        }
        if (staffIds?.length > 0 || params?.role) {
          const filteredStaffIds = staffIds.filter(
            (staffId) => !staffIdsToExclude.includes(staffId)
          );

          Object.assign(where, {
            id: In(filteredStaffIds),
          });
        } else if (staffIdsToExclude?.length > 0) {
          Object.assign(where, {
            id: Not(In(staffIdsToExclude)),
          });
        }
      }

      const teamData = await this.teamStaffRepository
        .createQueryBuilder('staff_team')
        .select(['staff_team.team_id', 'staff_team.staff_id'])
        .where('staff_team.team_id != :excludedTeamId', {
          excludedTeamId: params.team,
        })
        .getRawMany();

      const teamIdsArray = teamData.map((team) => team.team_id);

      const teams = await this.teamRepository.find({
        where: {
          id: In(teamIdsArray),
        },
        select: ['id', 'name'],
      });

      if (params?.collection_operation) {
        Object.assign(where, {
          collection_operation_id: Number(params?.collection_operation),
        });
      }
      if (params?.name) {
        Object.assign(where, {
          first_name: ILike(`%${params?.name}%`),
        });
      }

      Object.assign(where, {
        tenant_id: { id: this.request.user?.tenant?.id },
      });

      let staff: any = [];
      if (params?.fetchAll) {
        staff = this.staffRepository
          .createQueryBuilder('staff')
          .leftJoinAndSelect('staff.created_by', 'created_by')
          .leftJoinAndSelect(
            'staff.collection_operation_id',
            'collection_operation_id'
          )
          .orderBy({ 'staff.id': 'DESC' })
          .where({
            ...where,
            is_archived: false,
            id: Not(In(staffIdsToExclude)),
          });
      } else if (params?.sortName && params?.sortName !== 'team_name') {
        staff = this.staffRepository
          .createQueryBuilder('staff')
          .leftJoinAndSelect('staff.created_by', 'created_by')
          .leftJoinAndSelect(
            'staff.collection_operation_id',
            'collection_operation_id'
          )

          .take(limit)
          .orderBy(
            params.sortName === 'collection_operation'
              ? {
                  [`collection_operation_id.name`]:
                    params.sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
              : {
                  [`staff.${params.sortName}`]:
                    params.sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
          )
          .skip((page - 1) * limit)
          .where({ ...where, is_archived: false });
      } else {
        staff = this.staffRepository
          .createQueryBuilder('staff')
          .leftJoinAndSelect('staff.created_by', 'created_by')
          .leftJoinAndSelect(
            'staff.collection_operation_id',
            'collectionOperationId'
          )
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'staff.id': 'DESC' })
          .where({
            ...where,
            is_archived: false,
          });
      }

      const [data, count] = await staff.getManyAndCount();

      const roles = await this.staffRolesMapping.find({
        where: {
          staff_id: In(data.map((staff) => staff.id)),
        },
        relations: ['role_id', 'staff_id'],
      });
      const dataWithTeamName = data?.map((singleStaff) => {
        const allStaffIds = teamData
          ?.filter((entry) => entry.staff_id === singleStaff.id)
          .map((entry) => entry.team_id);

        const concatName = teams
          .filter((team) => allStaffIds.includes(team.id))
          .map((team) => team.name);
        const allRoleNames = roles
          ?.filter((entry) => {
            return entry.staff_id.id === singleStaff.id;
          })
          .map((entry) => entry.role_id.name);

        const concatNameRole = allRoleNames.join(', ');
        return {
          ...singleStaff,
          teams_name: concatName.join(', '),
          roles_name: concatNameRole,
        };
      });

      return {
        status: HttpStatus.OK,
        message: 'Other Staff Fetched Successfully',
        count: count,
        data: { staff: dataWithTeamName },
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        { error: e, message: 'Internel Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
