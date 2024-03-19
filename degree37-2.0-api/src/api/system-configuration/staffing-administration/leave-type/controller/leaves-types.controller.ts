import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LeavesTypesServices } from '../service/leaves-types.service';
import { GetAllLeavesTypesInterface } from '../interface/leaves-types.interface';
import { CreateLeaveTypeDto } from '../dto/leaves-types.dto';
import { UserRequest } from 'src/common/interface/request';

@ApiTags('Leaves')
@Controller('/staffing-admin/leave-type')
export class LeavesController {
  constructor(private readonly leavesTypesServices: LeavesTypesServices) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  getLeaves(@Query() getAllLeavesInterface: GetAllLeavesTypesInterface) {
    return this.leavesTypesServices.findAll(getAllLeavesInterface);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  getLeave(@Param('id') id: any) {
    return this.leavesTypesServices.findOne(id);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  createLeave(
    @Body() createLeaveDto: CreateLeaveTypeDto,
    @Request() req: UserRequest
  ) {
    createLeaveDto.created_by = req?.user?.id;
    return this.leavesTypesServices.create(createLeaveDto);
  }

  @Put('/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async updateLeave(
    @Param('id') id: any,
    @Body() updateLeaveDto: CreateLeaveTypeDto,
    @Request() req: UserRequest
  ) {
    updateLeaveDto.created_by = req?.user?.id;
    return this.leavesTypesServices.update(id, updateLeaveDto); // Use the category service
  }

  @Put('/archive/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async archiveLeave(@Param('id') id: any, @Request() req: UserRequest) {
    return this.leavesTypesServices.archive(id, req?.user?.id); // Use the category service
  }
}
