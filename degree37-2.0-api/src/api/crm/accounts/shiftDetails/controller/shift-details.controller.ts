import {
  Controller,
  Get,
  Param,
  Res,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { ShiftService } from '../service/shift-details.service';
import { UserRequest } from 'src/common/interface/request';

@ApiTags('Accounts Blueprint Shifts')
@Controller('/shifts')
export class ShiftDetailsController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  async get(@Request() req: UserRequest, @Param('id') id: bigint) {
    return this.shiftService.find(id);
  }
}
