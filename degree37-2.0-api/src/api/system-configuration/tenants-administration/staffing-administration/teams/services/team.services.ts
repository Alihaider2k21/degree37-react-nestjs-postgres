import { EntityManager, ILike, In, Repository } from 'typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import {
  AssignMembersDto,
  CreateTeamDto,
  RemoveMembersDto,
} from '../dto/create-team.dto';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Team } from '../entity/team.entity';
import {
  GetAllTeamsInterface,
  UpdateTeamInterface,
} from '../interface/team.interface';
import { TeamHistory } from '../entity/teamHistory';
import { TeamCollectionOperation } from '../entity/team-collection-operation.entity';
import { TeamStaff } from '../entity/team-staff.entiity';
import { TeamStaffHistory } from '../entity/team-staff-history';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { User } from '../../../user-administration/user/entity/user.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { te } from 'date-fns/locale';
dotenv.config();
@Injectable({ scope: Scope.REQUEST })
export class TeamService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(TeamHistory)
    private readonly teamHistoryRepository: Repository<TeamHistory>,

    @InjectRepository(TeamStaffHistory)
    private readonly teamStaffHistoryRepository: Repository<TeamStaffHistory>,

    @InjectRepository(TeamStaff)
    private readonly teamStaffRepository: Repository<TeamStaff>,

    @InjectRepository(TeamCollectionOperation)
    private readonly teamCollectionOperation: Repository<TeamCollectionOperation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly entityManager: EntityManager
  ) {}
  async verifyCollectionOperationIds(
    collectionOperationIds: bigint[]
  ): Promise<void> {
    for (const id of collectionOperationIds) {
      const collectionOp = await this.businessUnitsRepository.findOne({
        where: { id },
      });
      if (!collectionOp) {
        throw new BadRequestException(
          `Collection Operation with id ${id} not found`
        );
      }
    }
  }

  async addTeam(createTeamnDto: CreateTeamDto) {
    this.verifyCollectionOperationIds(createTeamnDto?.collection_operation_id);
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const newTeam = new Team();
      newTeam.name = createTeamnDto?.name;
      newTeam.description = createTeamnDto?.description;
      newTeam.created_by = createTeamnDto?.created_by;
      newTeam.created_at = new Date();
      newTeam.short_description = createTeamnDto?.short_description;
      newTeam.is_active = createTeamnDto.is_active;
      newTeam.tenant = this.request.user?.tenant;

      const savedTeam = await this.teamRepository.save(newTeam);

      const promises = [];
      for (const collectionOperations of createTeamnDto.collection_operation_id) {
        const teamCollectionOperation = new TeamCollectionOperation();
        teamCollectionOperation.team_id = newTeam.id;
        teamCollectionOperation.collection_operation_id = collectionOperations;
        teamCollectionOperation.created_by = createTeamnDto.created_by;
        teamCollectionOperation.tenant = this.request.user?.tenant;
        promises.push(
          this.teamCollectionOperation.save(teamCollectionOperation)
        );
      }
      await Promise.all(promises);
      await queryRunner.commitTransaction();

      return {
        status: 'success',
        response: 'Team Created Successfully',
        status_code: 201,
        data: savedTeam,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new HttpException(
        { message: ['Something went wrong'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getTeams(params: GetAllTeamsInterface) {
    try {
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};

      if (params?.name) {
        Object.assign(where, {
          name: ILike(`%${params?.name}%`),
        });
      }
      if (params?.status) {
        Object.assign(where, {
          is_active: params?.status,
        });
      }

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      if (params?.collection_operation) {
        const collectionOperations = params.collection_operation.split(',');

        let teamIds = [];
        const qb = this.teamCollectionOperation
          .createQueryBuilder('collectionOperation')
          .select('collectionOperation.team_id', 'team_id')
          .where(
            'collectionOperation.collection_operation_id IN (:...collectionOperations)',
            { collectionOperations }
          );

        const result = await qb.getRawMany();
        teamIds = result.map((row) => row.team_id);

        Object.assign(where, {
          id: In(teamIds),
        });
      }

      let teams: any = [];
      if (params?.fetchAll) {
        teams = this.teamRepository
          .createQueryBuilder('teams')
          .leftJoinAndSelect('teams.created_by', 'created_by')
          .orderBy({ 'teams.id': 'DESC' })
          .where({ ...where, is_archived: false });
      } else if (
        params?.sortName &&
        params?.sortName !== 'collection_operation' &&
        params?.sortName !== 'member_count'
      ) {
        teams = this.teamRepository
          .createQueryBuilder('teams')
          .leftJoinAndSelect('teams.created_by', 'created_by')
          .take(limit)
          .orderBy({
            [`teams.${params.sortName}`]:
              params.sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
          })
          .skip((page - 1) * limit)
          .where({ ...where, is_archived: false });
      } else {
        teams = this.teamRepository
          .createQueryBuilder('teams')
          .leftJoinAndSelect('teams.created_by', 'created_by')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'teams.id': 'DESC' })
          .where({ ...where, is_archived: false });
      }

      const [data, count] = await teams.getManyAndCount();

      const teamsWithCountPromises = data.map(async (team) => {
        const num = await this.teamStaffRepository
          .createQueryBuilder('team-staff')
          .leftJoinAndSelect('team-staff.team_id', 'team_ud')
          .where({ team_id: team.id })
          .getCount();

        return { ...team, member_count: num };
      });

      const teamsWithCount = await Promise.all(teamsWithCountPromises);

      const collectionOperations = await this.teamCollectionOperation.find({
        where: {
          team_id: In(data.map((team) => team.id)),
        },
        relations: ['team_id', 'collection_operation_id'],
      });
      return {
        status: HttpStatus.OK,
        message: 'Teams Fetched Successfully',
        count: count,
        data: { teams: teamsWithCount, collectionOperations },
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        { message: ['Something went wrong'] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSingleTeam(id: any) {
    const team = await this.teamRepository.findOne({
      where: { id, is_archived: false },
      relations: ['created_by'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }
    const collectionOperations = await this.teamCollectionOperation.find({
      where: {
        team_id: In([team.id]),
      },
      relations: ['collection_operation_id'],
    });
    const modifiedData: any = await getModifiedDataDetails(
      this.teamHistoryRepository,
      id,
      this.userRepository
    );

    return { team: { ...team, ...modifiedData }, collectionOperations };
  }
  async update(teamInterface: UpdateTeamInterface) {
    const teamId = teamInterface?.id;

    const team = await this.teamRepository.findOne({
      relations: ['created_by', 'tenant'],
      where: { id: teamId, is_archived: false },
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const updatedTeam = {
        name: teamInterface?.name,
        description: teamInterface?.description,
        short_description: teamInterface.short_description,
        is_active: teamInterface.is_active,
      };
      const oldCollectionOperations: any =
        await this.teamCollectionOperation.find({
          where: {
            team_id: In([teamId]),
          },
          relations: ['collection_operation_id'],
        });

      const teamHistory = new TeamHistory();
      teamHistory.id = teamId;
      teamHistory.name = team.name;
      teamHistory.collection_operations = oldCollectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      teamHistory.description = team.description;
      teamHistory.history_reason = 'C';
      teamHistory.is_archived = false;
      teamHistory.is_active = team.is_active;
      teamHistory.short_description = team.short_description;
      teamHistory.created_by = teamInterface.updated_by;
      teamHistory.created_at = new Date();
      teamHistory.tenant_id = team?.tenant?.id;

      await this.saveTeamHistory(teamHistory);

      await this.teamRepository.update({ id: teamId }, { ...updatedTeam });

      await this.teamCollectionOperation
        .createQueryBuilder('team_collection_operations')
        .delete()
        .from(TeamCollectionOperation)
        .where('team_id = :team_id', { team_id: teamId })
        .execute();

      const promises = [];
      for (const collectionOperations of teamInterface.collection_operation_id) {
        const teamCollectionOperation = new TeamCollectionOperation();
        teamCollectionOperation.team_id = teamId;
        teamCollectionOperation.collection_operation_id = collectionOperations;
        teamCollectionOperation.created_by = teamInterface.created_by;
        teamCollectionOperation.tenant = this.request.user?.tenant;
        promises.push(
          this.teamCollectionOperation.save(teamCollectionOperation)
        );
      }
      await Promise.all(promises);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Changes Saved.',
        status_code: 204,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('Failed to update team data.');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteTeam(id: any, updated_by: any, deleteData: any) {
    const team = await this.teamRepository.findOne({
      where: { id, is_archived: false },
      relations: ['created_by', 'tenant'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const collectionOperations: any = await this.teamCollectionOperation.find(
        {
          where: {
            team_id: In([id]),
          },
          relations: ['collection_operation_id'],
        }
      );

      const teamHistory = new TeamHistory();
      teamHistory.id = id;
      (teamHistory.name = team.name),
        (teamHistory.collection_operations = collectionOperations.map(
          (co) => co.collection_operation_id.id
        )),
        (teamHistory.description = team.description),
        (teamHistory.deleted_at = new Date());
      teamHistory.history_reason = 'C';
      teamHistory.is_archived = false;
      teamHistory.created_at = new Date();

      teamHistory.is_active = team.is_active;
      teamHistory.short_description = team.short_description;
      teamHistory.created_by = updated_by;
      teamHistory.tenant_id = team?.tenant?.id;
      await this.saveTeamHistory(teamHistory);
      teamHistory.history_reason = 'D';
      await this.saveTeamHistory(teamHistory);

      team.is_archived = true;
      team.deleted_at = new Date();

      await this.teamRepository.save(team);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Team Archived.',
        status_code: 204,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: ['Something went wrong'], error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  async assignMembers(assignMembersDto: AssignMembersDto) {
    const { staff_ids, team_id, created_by } = assignMembersDto;

    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const staff_id of staff_ids) {
        const teamStaff = new TeamStaff();
        teamStaff.staff_id = BigInt(staff_id);
        teamStaff.team_id = BigInt(team_id);
        teamStaff.created_by = BigInt(created_by);
        teamStaff.tenant = this.request?.user?.tenant;
        await queryRunner.manager.save(teamStaff);
      }

      await queryRunner.commitTransaction();

      return {
        status: 'success',
        response: 'Staff members assigned to the team successfully',
        code: 201,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async removeTeamMembers(removeMembersDto: RemoveMembersDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const recordsToDelete = await this.teamStaffRepository
        .createQueryBuilder('team_staff')
        .where('team_staff.staff_id = :staffId', {
          staffId: removeMembersDto.staff_id,
        })
        .andWhere('team_staff.team_id = :teamId', {
          teamId: removeMembersDto.team_id,
        })
        .select([
          'team_staff.id AS team_staff_id',
          'team_staff.created_at AS team_staff_created_at',
          'staff_id.id AS staff_id_id',
          'team_id.id AS team_id_id',
          'team_id.created_by AS created_by_user',
          'team_id.tenant AS tenant',
        ])
        .leftJoin('team_staff.created_by', 'created_by')
        .leftJoin('team_staff.staff_id', 'staff_id')
        .leftJoin('team_staff.team_id', 'team_id')
        .leftJoin('team_staff.tenant', 'tenant')
        .getRawMany();

      const teamStaffHist = new TeamStaffHistory();
      teamStaffHist.created_at = recordsToDelete[0].team_staff_created_at;
      teamStaffHist.created_by = recordsToDelete[0].created_by_user;
      teamStaffHist.team_id = BigInt(removeMembersDto.team_id);
      teamStaffHist.staff_id = BigInt(removeMembersDto.staff_id);
      teamStaffHist.tenant_id = recordsToDelete[0].tenant;
      teamStaffHist.history_reason = 'D';
      teamStaffHist.id = recordsToDelete[0].team_staff_id;
      await this.teamStaffHistoryRepository.save(teamStaffHist);
      await this.teamStaffRepository.delete(recordsToDelete[0].team_staff_id);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Resource Removed',
        status_code: 200,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();

      throw new HttpException(
        { error: error, message: 'Internel Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }
  async saveTeamHistory(team: TeamHistory) {
    try {
      const teamHistory = new TeamHistory();
      teamHistory.collection_operations = team.collection_operations;
      teamHistory.created_at = new Date();
      teamHistory.created_by = team.created_by;
      teamHistory.deleted_at = team.deleted_at;
      teamHistory.id = team.id;
      teamHistory.description = team.description;
      teamHistory.short_description = team.short_description;
      teamHistory.history_reason = team.history_reason;
      teamHistory.is_active = team.is_active;
      teamHistory.is_archived = team.is_archived;
      teamHistory.name = team.name;
      teamHistory.tenant_id = team?.tenant_id;
      await this.teamHistoryRepository.save(teamHistory);
    } catch (error) {
      console.log(error);

      throw new Error('History storation failed!');
    }
  }
}
