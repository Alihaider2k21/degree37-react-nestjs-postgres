import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Put,
  Delete,
  Request,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CloseDateService } from '../services/close-date.services';
import { CloseDateDto } from '../dto/close-date.dto';
import { UserRequest } from '../../../../../../../common/interface/request';
import {
  CloseDateInterface,
  DateClosedInterface,
} from '../interface/close-date.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Close Dates')
@Controller('/close-dates')
export class CloseDateController {
  constructor(private readonly closeDateService: CloseDateService) {}

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() getAllCloseDatessInterface: CloseDateInterface) {
    return this.closeDateService.findAll(getAllCloseDatessInterface);
  }

  @Get('/is_closed')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_CLOSE_DATES_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_CLOSE_DATES_WRITE
  // )
  async isDateClosed(
    @Query() dateClosedInterface: DateClosedInterface,
    @Request() req: UserRequest
  ) {
    return this.closeDateService.isDateClosed(dateClosedInterface);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_CLOSE_DATES_READ
  )
  async create(
    @Request() req: UserRequest,
    @Body() createCloseDateDto: CloseDateDto
  ) {
    return this.closeDateService.create(req.user, createCloseDateDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_CLOSE_DATES_WRITE
  )
  async update(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Body() updateCloseDateDto: CloseDateDto
  ) {
    return this.closeDateService.update(req.user, id, updateCloseDateDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_CLOSE_DATES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_CLOSE_DATES_WRITE
  )
  async findOne(@Param('id') id: any) {
    return this.closeDateService.findOne(id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.GONE)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_CLOSE_DATES_MANAGEMENT_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  async archive(@Request() req: UserRequest, @Param('id') id: any) {
    return this.closeDateService.archive(req.user, id);
  }
}
