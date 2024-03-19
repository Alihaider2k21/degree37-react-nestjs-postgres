import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination';
import { StaffSchedulesService } from '../../services/staff-schedules.service';
import { FilterStaffSchedulesInterface } from '../interfaces/filter-staff-schedules';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';

@ApiTags('Staff Schedules')
@Controller('view-schedules')
export class StaffSchedulesController {
  constructor(private readonly staffSchedulesService: StaffSchedulesService) {}

  @Get('staff-schedules')
  @UsePipes(new ValidationPipe())
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Permissions(PermissionsEnum.STAFFING_MANAGEMENT_VIEW_SCHEDULE_STAFF_SCHEDULE)
  async get(@Query() query: PaginationDto) {
    const { page, limit } = query;
    return await this.staffSchedulesService.get(page, limit);
  }
  @Post('staff-schedules/search')
  @UsePipes(new ValidationPipe())
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Permissions(PermissionsEnum.STAFFING_MANAGEMENT_VIEW_SCHEDULE_STAFF_SCHEDULE)
  async search(@Body() query: FilterStaffSchedulesInterface) {
    return await this.staffSchedulesService.search(query);
  }
}
