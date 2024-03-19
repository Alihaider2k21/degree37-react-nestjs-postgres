import {
  Controller,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { StaffScheduleService } from '../service/staff-schedule.service';
import { GetAllStaffSchedule } from '../dto/staff-schedule.dto';

@ApiTags('Staff Schedules')
@Controller('staff-schedules')
export class StaffScheduleController {
  constructor(private readonly staffScheduleService: StaffScheduleService) {}

  @Get('/description-dropdown')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getStaffSchedulesDescription() {
    return this.staffScheduleService.getDescriptionDropdown();
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getStaffSchedules(
    @Query() getAllStaffSchedule: GetAllStaffSchedule,
    @Param('id') id: bigint
  ) {
    return this.staffScheduleService.getStaffSchedules(getAllStaffSchedule, id);
  }

  /**
   * view of entity
   * @param id
   * @returns {object}
   */
  @Get(':id/view')
  @ApiParam({ name: 'id' })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async findOne(@Param('id') id: any) {
    return this.staffScheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async archiveCategory(@Param('id') id: any) {
    return this.staffScheduleService.archive(id);
  }
}
