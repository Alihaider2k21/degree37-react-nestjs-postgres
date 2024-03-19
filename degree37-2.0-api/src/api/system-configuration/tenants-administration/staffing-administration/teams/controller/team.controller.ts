import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Request,
  Get,
  Query,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AssignMembersDto, CreateTeamDto } from '../dto/create-team.dto';
import { TeamService } from '../services/team.services';
import { UserRequest } from 'src/common/interface/request';
import {
  GetAllTeamsInterface,
  UpdateTeamInterface,
} from '../interface/team.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Teams')
@Controller('/staff-admin/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getTeams(@Query() getAllTeamsInterface: GetAllTeamsInterface) {
    return this.teamService.getTeams(getAllTeamsInterface);
  }
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_TEAMS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_TEAMS_WRITE
  )
  async getUser(@Param('id') id: any) {
    return this.teamService.getSingleTeam(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_TEAMS_WRITE
  )
  async update(
    @Param('id') id: any,
    @Body() updateTeamInterface: UpdateTeamInterface,
    @Request() req: UserRequest
  ) {
    updateTeamInterface.updated_by = req.user?.id;
    updateTeamInterface.id = id;
    return this.teamService.update(updateTeamInterface);
  }

  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_TEAMS_WRITE
  )
  async addTeam(
    @Body() createTeamDto: CreateTeamDto,
    @Request() req: UserRequest
  ) {
    createTeamDto.created_by = req.user?.id;
    return this.teamService.addTeam(createTeamDto);
  }

  @Delete('/:team_id/team-members/:staff_id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_TEAMS_ARCHIVE
  )
  async removeTeamMembers(
    @Param('team_id') team_id: any,
    @Param('staff_id') staff_id: any,
    @Request() req: UserRequest
  ) {
    return this.teamService.removeTeamMembers({ team_id, staff_id });
  }

  @Post('/team-members')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_ASSIGNED_ASSIGNED_MEMBER_WRITE
  )
  async assignMembers(
    @Body() assignMembersDto: AssignMembersDto,
    @Request() req: UserRequest
  ) {
    assignMembersDto.created_by = req.user?.id;
    return this.teamService.assignMembers(assignMembersDto);
  }

  @Delete('/archive/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_TEAMS_ARCHIVE
  )
  async deleteTeam(
    @Param('id') id: any,
    @Body() deleteData: any,
    @Request() req: UserRequest
  ) {
    const updated_by = req.user?.id;
    return this.teamService.deleteTeam(id, updated_by, deleteData);
  }
}
