import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Request,
  Get,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { StaffShiftScheduleService } from '../service/staff-shift-schedule.service';
import { StaffShiftScheduleDto } from '../dto/staff-shift-schedule.dto';

@ApiTags('Staff Shift Schedule')
@Controller('staffs/shift-schedule')
export class StaffShiftScheduleController {
  constructor(
    private readonly staffShiftScheduleService: StaffShiftScheduleService
  ) {}

  @Post('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() staffShiftScheduleDto: StaffShiftScheduleDto
  ) {
    return this.staffShiftScheduleService.update(
      id,
      req.user,
      staffShiftScheduleDto
    );
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  get(@Param('id') id: any, @Request() req: UserRequest) {
    return this.staffShiftScheduleService.get(id, req.user);
  }
}
