import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Put,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { VehicleTypeDto } from '../dto/vehicle-type.dto';
import { VehicleTypeService } from '../services/vehicle-type.service';
import { GetAllVehicleTypesInterface } from '../interface/vehicle-type.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Vehicle Types')
@Controller('vehicle-types')
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLE_TYPE_WRITE
  )
  create(@Body() createVehicleTypeDto: VehicleTypeDto) {
    return this.vehicleTypeService.create(createVehicleTypeDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLE_TYPE_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLE_TYPE_WRITE
  )
  findAll(@Query() getAllVehicleTypesInterface: GetAllVehicleTypesInterface) {
    return this.vehicleTypeService.findAll(getAllVehicleTypesInterface);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLE_TYPE_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLE_TYPE_WRITE
  )
  findOne(@Param('id') id: any) {
    return this.vehicleTypeService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLE_TYPE_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateVehicleTypeDto: VehicleTypeDto,
    @Request() req: UserRequest
  ) {
    updateVehicleTypeDto.updated_by = req.user.id;
    return this.vehicleTypeService.update(id, updateVehicleTypeDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_VEHICLE_TYPE_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  async delete(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req.user.id;
    return this.vehicleTypeService.delete(id, updatedBy);
  }
}
