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
import { LockDateService } from '../services/lock-date.services';
import { LockDateDto } from '../dto/lock-date.dto';
import { UserRequest } from '../../../../../../../common/interface/request';
import { LockDateInterface } from '../interface/lock-date.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Lock Dates')
@Controller('/lock-dates')
export class LockDateController {
  constructor(private readonly lockDateService: LockDateService) {}

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_LOCK_DATES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_LOCK_DATES_WRITE
  )
  async findAll(@Query() getAllLockDatessInterface: LockDateInterface) {
    return this.lockDateService.findAll(getAllLockDatessInterface);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_LOCK_DATES_WRITE
  )
  async create(
    @Request() req: UserRequest,
    @Body() createLockDateDto: LockDateDto
  ) {
    createLockDateDto.tenant_id = req.user?.tenant?.id;
    return this.lockDateService.create(req.user, createLockDateDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_LOCK_DATES_WRITE
  )
  async update(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Body() updateLockDateDto: LockDateDto
  ) {
    return this.lockDateService.update(req.user, id, updateLockDateDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_LOCK_DATES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_LOCK_DATES_WRITE
  )
  async findOne(@Param('id') id: any) {
    return this.lockDateService.findOne(id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.GONE)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_LOCK_DATES_MANAGEMENT_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  async archive(@Request() req: UserRequest, @Param('id') id: any) {
    return this.lockDateService.archive(req.user, id);
  }
}
