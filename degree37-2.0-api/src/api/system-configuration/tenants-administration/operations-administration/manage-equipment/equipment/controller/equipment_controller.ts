import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Put,
  Query,
  Headers,
  Patch,
  Req,
  BadRequestException,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { EquipmentService } from '../services/equipment_services';
import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from '../dto/create-equipment.dto';
import {
  GetAllEquipmentInterface,
  GetEquipmentForDriveInterface,
} from '../interface/equipment.interface';
import { UserRequest } from '../../../../../../../common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('equipment')
@Controller('')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('/marketing-equipment/equipment')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(@Query() getAllEquipmentInterface: GetAllEquipmentInterface) {
    return this.equipmentService.findAll(getAllEquipmentInterface);
  }

  @Get('/marketing-equipment/equipment/drives')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAllForDrives(@Query() params: GetEquipmentForDriveInterface) {
    return this.equipmentService.findAllForDrives(params);
  }

  @Post('/marketing-equipment/equipment')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_EQUIPMENTS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_EQUIPMENTS_WRITE
  )
  async create(
    @Headers() headers,
    @Body() createEquipmentDto: CreateEquipmentDto
  ) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Put('/marketing-equipment/equipment/:equipmentId')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_EQUIPMENTS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'equipmentId', required: true })
  update(
    @Headers() headers,
    @Param('equipmentId') id: any,
    @Body() updateNoteCategoryDto: UpdateEquipmentDto,
    @Request() req: UserRequest
  ) {
    return this.equipmentService.update(id, updateNoteCategoryDto, req);
  }

  @Get('/marketing-equipment/equipment/:equipmentId')
  @ApiParam({ name: 'equipmentId', required: true })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_EQUIPMENTS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_EQUIPMENTS_WRITE
  )
  findOne(@Param('equipmentId') id: any) {
    return this.equipmentService.findOne(id);
  }

  @Patch('/marketing-equipment/equipment/archive/:equipmentId')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_EQUIPMENTS_ARCHIVE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'equipmentId', required: true })
  @HttpCode(HttpStatus.OK)
  async archive(@Param('equipmentId') id: any, @Request() req: UserRequest) {
    if (!id) {
      throw new BadRequestException('Equipment Id is required');
    }

    return this.equipmentService.archive(id, req);
  }
}
