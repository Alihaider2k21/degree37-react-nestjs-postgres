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
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeviceService } from '../services/device.services';
import { CreateDeviceDto } from '../dto/create-device.dto';
import {
  GetAllDevicesInterface,
  GetDevicesForDriveInterface,
} from '../interface/device.interface';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { DeviceMaintenanceDto } from '../dto/device-maintenance.dto';
import { DeviceRetirementDto } from '../dto/device-retirement.dto';
import { DeviceShareDto } from '../dto/device-share.dto';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { DeviceUnscheduleRetirementDto } from '../dto/device-unschedule-retirement.dto';

@ApiTags('Device')
@Controller('/devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_WRITE
  )
  async listDevice(@Query() getAllDeviceInterface: GetAllDevicesInterface) {
    return this.deviceService.getDevices(getAllDeviceInterface);
  }

  @Get('/drives')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_WRITE
  // )
  async listDeviceByCollectionOperation(
    @Query() getAllDeviceInterface: GetDevicesForDriveInterface
  ) {
    return this.deviceService.getDevicesByCollectionOperation(
      getAllDeviceInterface
    );
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_WRITE
  )
  async addDevice(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.addDevice(createDeviceDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_WRITE
  )
  async update(
    @Param('id') id: any,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @Request() req: UserRequest
  ) {
    updateDeviceDto.id = id;
    updateDeviceDto.updated_by = req.user.id;
    return this.deviceService.updateDevice(updateDeviceDto);
  }
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_WRITE
  )
  async getDevice(@Param('id') id: any) {
    return this.deviceService.getDevice(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.GONE)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_ARCHIVE
  )
  deleteEmailTemplate(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req.user.id;
    return this.deviceService.remove(id, updatedBy);
  }

  @Post(':id/maintenances')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_SCHEDULE_MAINTENANCE
  )
  @ApiParam({ name: 'id', required: true })
  async scheduleMaintenance(
    @Param('id') id: any,
    @Body() deviceMaintenanceDto: DeviceMaintenanceDto
  ) {
    return this.deviceService.scheduleMaintenance(id, deviceMaintenanceDto);
  }

  @Get(':id/maintenances')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_SCHEDULE_MAINTENANCE
  )
  @ApiParam({ name: 'id', required: true })
  async findVehicleMaintenances(@Param('id') id: any) {
    return this.deviceService.findMaintenances(id);
  }

  @Post(':id/retirement')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_SCHEDULE_RETIREMENT
  )
  @ApiParam({ name: 'id', required: true })
  async scheduleRetirement(
    @Param('id') id: any,
    @Body() retirementDto: DeviceRetirementDto
  ) {
    return this.deviceService.scheduleRetirement(id, retirementDto);
  }

  @Post(':id/unschedule/retirement')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_SCHEDULE_RETIREMENT
  )
  @ApiParam({ name: 'id', required: true })
  async unScheduleRetirement(
    @Param('id') id: any,
    @Body() retirementDto: DeviceUnscheduleRetirementDto
  ) {
    return this.deviceService.unScheduleRetirement(id, retirementDto);
  }

  @Post(':id/shares')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_SHARE_DEVICE
  )
  @ApiParam({ name: 'id', required: true })
  async share(@Param('id') id: any, @Body() shareDtto: DeviceShareDto) {
    return this.deviceService.share(id, shareDtto);
  }

  @Get(':id/shares')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_DEVICES_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  async findVehicleShares(@Param('id') id: any) {
    return this.deviceService.findShares(id);
  }
}
