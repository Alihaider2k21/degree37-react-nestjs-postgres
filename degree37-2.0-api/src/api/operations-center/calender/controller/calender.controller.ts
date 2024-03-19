import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Request,
} from '@nestjs/common';
import { CalendersService } from '../service/calender.service';
import { CreateCalenderDto } from '../dto/create-calender.dto';
import { UpdateCalenderDto } from '../dto/update-calender.dto';
import { GetMonthlyCalenderInterface } from '../interface/oc-calender-monthly.interface';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interface/request';

@Controller('operations-center/calender')
export class CalendersController {
  constructor(private readonly calenderService: CalendersService) {}

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Get('/monthly-view')
  findAllMonthly(
    @Query() getmonthlyCalender: GetMonthlyCalenderInterface,
    @Request() req: UserRequest
  ) {
    return this.calenderService.findAllMonthly(req.user, getmonthlyCalender);
  }

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @Get('/procedure-type-products/:id')
  findProcedureTypeProducts(@Param('id') id: any) {
    return this.calenderService.findProcedureTypeProducts(id);
  }
}
