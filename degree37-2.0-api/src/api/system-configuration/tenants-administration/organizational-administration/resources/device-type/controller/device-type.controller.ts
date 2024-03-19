import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeviceTypeService } from '../services/device-type.services';
import { CreateDeviceTypeDto } from '../dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from '../dto/update-device-type.dto';
import {
  ArchiveDeviceTypeInterface,
  GetAllDeviceTypesInterface,
} from '../interface/device-type.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Device Type')
@Controller('/system-configuration/device-type')
export class DeviceTypeController {
  constructor(private readonly deviceTypeService: DeviceTypeService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICE_TYPE_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICE_TYPE_WRITE
  )
  async listDeviceType(
    @Query() getAllDeviceTypesInterface: GetAllDeviceTypesInterface
  ) {
    return this.deviceTypeService.findAll(getAllDeviceTypesInterface);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICE_TYPE_WRITE
  )
  async addDeviceType(@Body() createDeviceTypeDto: CreateDeviceTypeDto) {
    return this.deviceTypeService.addDeviceType(createDeviceTypeDto);
  }

  @Put('/edit')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICE_TYPE_WRITE
  )
  async update(
    @Body() updateDeviceTypeDto: UpdateDeviceTypeDto,
    @Request() req: UserRequest
  ) {
    updateDeviceTypeDto.updated_by = req.user.id;
    return this.deviceTypeService.updateDeviceType(updateDeviceTypeDto);
  }
  @Put('/archive')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICE_TYPE_ARCHIVE
  )
  async archive(
    @Body() archiveDeviceTypeInterface: ArchiveDeviceTypeInterface,
    @Request() req: UserRequest
  ) {
    const updatedBy = req.user.id;
    return this.deviceTypeService.archiveDeviceType(
      archiveDeviceTypeInterface,
      updatedBy
    );
  }
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICE_TYPE_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICE_TYPE_WRITE
  )
  async getDeviceType(@Param('id') id: any) {
    return this.deviceTypeService.find(id);
  }
}
