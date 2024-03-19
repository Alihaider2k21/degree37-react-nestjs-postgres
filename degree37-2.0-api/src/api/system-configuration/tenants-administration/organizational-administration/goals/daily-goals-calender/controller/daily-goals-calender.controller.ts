import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DailyGoalsCalenderService } from '../service/daily-goals-calender.service';
import { DailyGoalsCalenderFiltersInterface } from '../interface/daily-goals-calender.interface';
import { UpdateDailyGoalsCalendarDto } from '../dto/update-daily-goals-calendar.dto';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Daily Goals Calender')
@Controller('daily-goals-calender')
export class DailyGoalsCalenderController {
  constructor(
    private readonly dailyGoalsCalenderService: DailyGoalsCalenderService
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_CALENDAR_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_CALENDAR_WRITE
  )
  findAll(
    @Query()
    dailyGoalAllocationsFiltersInterface: DailyGoalsCalenderFiltersInterface,
    @Request() req: UserRequest
  ) {
    dailyGoalAllocationsFiltersInterface.tenant_id = req.user.tenant.id;
    return this.dailyGoalsCalenderService.findAll(
      dailyGoalAllocationsFiltersInterface
    );
  }

  @Post('/allocation')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_CALENDAR_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_CALENDAR_WRITE
  // )
  getRedistributedValues(
    @Body() updateCalendarDTO: UpdateDailyGoalsCalendarDto,
    @Request() req: UserRequest
  ) {
    updateCalendarDTO.tenant_id = req.user.tenant.id;
    return this.dailyGoalsCalenderService.getRedistributedValues(
      updateCalendarDTO
    );
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_CALENDAR_WRITE
  )
  update(
    @Body() updateCalendarDTO: UpdateDailyGoalsCalendarDto,
    @Request() req: UserRequest
  ) {
    updateCalendarDTO.tenant_id = req.user.tenant.id;
    return this.dailyGoalsCalenderService.update(updateCalendarDTO);
  }
}
