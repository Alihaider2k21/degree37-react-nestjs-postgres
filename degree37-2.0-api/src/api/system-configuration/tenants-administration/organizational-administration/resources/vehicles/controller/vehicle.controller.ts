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
import { VehicleService } from '../services/vehicle.service';
import { VehicleDto } from '../dto/vehicle.dto';
import { VehicleMaintenanceDto } from '../dto/vehicle-maintenance.dto';
import { VehicleShareDto } from '../dto/vehicle-share.dto';
import { VehicleRetirementDto } from '../dto/vehicle-retirement.dto';
import {
  GetAllVehiclesForDricveInterface,
  GetAllVehiclesInterface,
} from '../interface/vehicle.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { VehicleUnscheduleRetirementDto } from '../dto/vehicle-unschedule-retirement.dto';

@ApiTags('Vehicles')
@Controller('/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_WRITE
  )
  async findAll(@Query() getAllVehicleInterface: GetAllVehiclesInterface) {
    return this.vehicleService.findAll(getAllVehicleInterface);
  }

  @Get('/drives')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_WRITE
  )
  async findAllForDrives(
    @Query() getAllVehicleInterface: GetAllVehiclesForDricveInterface
  ) {
    return this.vehicleService.findAllForDrives(getAllVehicleInterface);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_WRITE
  )
  async create(@Body() createVehicleDto: VehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_WRITE
  )
  async update(
    @Param('id') id: any,
    @Body() updateVehicleDto: VehicleDto,
    @Request() req: UserRequest
  ) {
    updateVehicleDto.updated_by = req.user.id;
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_WRITE
  )
  async findOne(@Param('id') id: any) {
    return this.vehicleService.findOne(id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.GONE)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLES_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req.user.id;
    return this.vehicleService.delete(id, updatedBy);
  }

  @Post(':id/maintenances')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  async scheduleMaintenance(
    @Param('id') id: any,
    @Body() vehicleMaintenanceDto: VehicleMaintenanceDto
  ) {
    return this.vehicleService.scheduleMaintenance(id, vehicleMaintenanceDto);
  }

  @Post(':id/shares')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  async share(@Param('id') id: any, @Body() vehicleShareDto: VehicleShareDto) {
    return this.vehicleService.share(id, vehicleShareDto);
  }

  @Post(':id/retirement')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  async scheduleRetirement(
    @Param('id') id: any,
    @Body() vehicleRetirementDto: VehicleRetirementDto
  ) {
    return this.vehicleService.scheduleRetirement(id, vehicleRetirementDto);
  }

  @Post(':id/unschedule/retirement')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  async unScheduleRetirement(
    @Param('id') id: any,
    @Body() vehicleRetirementDto: VehicleUnscheduleRetirementDto
  ) {
    return this.vehicleService.unScheduleRetirement(id, vehicleRetirementDto);
  }

  @Get(':id/maintenances')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  async findVehicleMaintenances(@Param('id') id: any) {
    return this.vehicleService.findVehicleMaintenances(id);
  }

  @Get(':id/maintenances/:maintenanceId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'maintenanceId', required: true })
  async findVehicleSingleMaintenances(
    @Param('id') id: any,
    @Param('maintenanceId') maintenanceId: any
  ) {
    return this.vehicleService.findVehicleSingleMaintenances(id, maintenanceId);
  }

  @Put(':id/maintenances/:maintenanceId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'maintenanceId', required: true })
  async updateScheduleMaintenance(
    @Param('id') id: any,
    @Param('maintenanceId') maintenanceId: any,
    @Body() vehicleMaintenanceDto: VehicleMaintenanceDto
  ) {
    return this.vehicleService.updateScheduleMaintenance(
      id,
      maintenanceId,
      vehicleMaintenanceDto
    );
  }

  @Get(':id/shares')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  async findVehicleShares(@Param('id') id: any) {
    return this.vehicleService.findVehicleShares(id);
  }

  @Get(':id/share/:shareId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'shareId', required: true })
  async findShare(@Param('id') id: any, @Param('shareId') shareId: any) {
    return this.vehicleService.findShare(id, shareId);
  }

  @Put(':id/share/:shareId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'shareId', required: true })
  async editShare(
    @Param('id') id: any,
    @Param('shareId') shareId: any,
    @Body() vehicleShareDto: VehicleShareDto
  ) {
    return this.vehicleService.editShare(id, shareId, vehicleShareDto);
  }
}
