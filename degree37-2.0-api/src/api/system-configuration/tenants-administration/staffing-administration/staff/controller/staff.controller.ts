import {
  Controller,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllTeamStaffDto, GetStaffOtherTeamDto } from '../dto/staff.dto';
import { StaffService } from '../services/staff.services';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Staff')
@Controller('/staffing-admin')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('/team-members')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE
  )
  async getStaffWithTeams(@Query() getAllStaffDto: GetAllTeamStaffDto) {
    return await this.staffService.getStaffWithTeams(getAllStaffDto);
  }

  @Get('/other-teams-staff')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE
  )
  async getStaffOtherTeams(
    @Query() getStaffOtherTeamDto: GetStaffOtherTeamDto
  ) {
    return this.staffService.getStaffOtherTeams(getStaffOtherTeamDto);
  }
}
