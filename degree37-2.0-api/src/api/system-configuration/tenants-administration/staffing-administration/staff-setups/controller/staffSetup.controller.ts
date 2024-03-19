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
  Query,
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { StaffSetupService } from '../services/staffSetup.service';
import {
  CreateStaffSetupDto,
  UpdateStaffSetupDto,
} from '../dto/create-staffSetup.dto';
import {
  GetStaffSetupsBluePrintParamsInterface,
  GetStaffSetupsByIdsInterface,
  GetStaffSetupsDriveParamsInterface,
  GetStaffSetupsParamsInterface,
  GetUserId,
} from '../interface/StaffSetupsParams';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Staff Admininistration')
@Controller('/staffing-admin/staff-setup')
export class StaffSetupController {
  constructor(private readonly staffSetup: StaffSetupService) {}

  // create
  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE
  )
  create(
    @Body() createStaffSetupDto: CreateStaffSetupDto,
    @Request() req: UserRequest
  ) {
    createStaffSetupDto.created_by = req?.user?.id || 1;
    return this.staffSetup.create(createStaffSetupDto);
  }
  /* get all */
  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_READ
  )
  async getAllRoomSizes(@Query() queryParams: GetStaffSetupsParamsInterface) {
    return this.staffSetup.getAllStaffetups(queryParams);
  }

  /* get all for Drive */
  @Get('/drive')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_READ
  )
  async getAllStaffSetupForDrive(
    @Query() queryParams: GetStaffSetupsDriveParamsInterface
  ) {
    return this.staffSetup.getAllStaffSetupForDrive(queryParams);
  }

  @Get('/blueprint/donor_center')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_READ
  )
  async getAllStaffSetupForDonorCenterBluePrint(
    @Query() queryParams: GetStaffSetupsBluePrintParamsInterface
  ) {
    return this.staffSetup.getAllStaffSetupForDonorCenterBluePrint(queryParams);
  }

  // get by id
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_READ
  )
  @HttpCode(HttpStatus.OK)
  async getStaffSetup(@Param('id') id: any) {
    return this.staffSetup.getStaffSetup(id);
  }

  // get many by ids
  @Get('/drives/byIds')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_READ
  )
  async getStaffSetupByIds(@Query() queryParams: GetStaffSetupsByIdsInterface) {
    return this.staffSetup.getStaffSetupsById(queryParams);
  }

  // archeive staffsetup
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_ARCHIVE
  )
  async arhiveStaffSetup(
    @Body() body: GetUserId,
    @Param('id') id: any,
    @Request() req: UserRequest
  ) {
    return this.staffSetup.arhiveStaffSetup(id, req?.user?.id, body.created_by);
  }
  // update staffsetup
  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_STAFF_SETUPS_WRITE
  )
  async updateStaffFetup(
    @Body() body: UpdateStaffSetupDto,
    @Param('id') id: any,
    @Request() req: UserRequest
  ) {
    body.updated_by = req.user?.id;
    return this.staffSetup.updateStaffFetup(id, body);
  }
}
