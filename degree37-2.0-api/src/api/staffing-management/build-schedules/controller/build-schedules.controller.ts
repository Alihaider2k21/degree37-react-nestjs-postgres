import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto } from '../dto/build-schedules.dto';
import { BuildSchedulesService } from '../services/build-schedules.service';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Staffing-Management')
@Controller('staffing-management/schedules')
export class BuildSchedulesController {
  constructor(private readonly buildScheduledService: BuildSchedulesService) {}
  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.STAFFING_MANAGEMENT_BUILD_SCHEDULES_WRITE)
  @UsePipes(new ValidationPipe())
  async createSchedules(
    @Request() req: UserRequest,
    @Body() createSchedulesDto: CreateScheduleDto
  ) {
    const result = await this.buildScheduledService.createSchedule(
      createSchedulesDto
    );
    return {
      message: 'Schedule created successfully',
      data: result,
    };
  }
}
