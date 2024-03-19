import {
  Controller,
  Post,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Body,
  Get,
  Query,
  Param,
  Put,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interface/request';
import { StaffService } from '../services/staff.service';
import {
  AssignStaffMembersDto,
  AssignStaffPrimaryTeam,
  CreateStaffDto,
  UpdateStaffDto,
} from '../dto/create-staff.dto';
import {
  GetAllStaffFilteredInterface,
  GetAllStaffInterface,
} from '../interface/staff.interface';
import { StaffRolesMappingService } from '../staffRolesMapping/services/staff-roles-mapping.service';
import {
  CreateStaffRolesMappingDto,
  UpdateStaffRolesMappingDto,
} from '../staffRolesMapping/dto/create-staff-roles-mapping.dto';
import { StaffDonorCentersMappingService } from '../staffDonorCentersMapping/services/staff-donor-centers-mapping.service';
import {
  CreateStaffDonorCentersMappingDto,
  UpdateStaffDonorCentersMappingDto,
} from '../staffDonorCentersMapping/dto/create-donor-centers-mapping.dto';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
@ApiTags('CRM Staff')
@Controller('contact-staff')
export class StaffController {
  constructor(
    private readonly service: StaffService,
    private readonly staffRolesMappingService: StaffRolesMappingService,
    private readonly staffDonorCentersMappingService: StaffDonorCentersMappingService
  ) {}

  /**
   * create entity
   * @param createDto
   * @returns
   */
  @Post('')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_CONTACTS_STAFF_WRITE)
  create(@Body() createDto: CreateStaffDto, @Request() req: UserRequest) {
    createDto.created_by = req.user.id;
    createDto.tenant_id = req.user.tenant.id;
    return this.service.create(createDto, req.user);
  }

  /**
   * Gets the dropdown filter data for staff members
   *
   * Warning do not move this method, the ordering matters because of the hoisting of similar
   * endpoints that take a parameter instead of a fixed route. For example if we move this method
   * under the method with the @Put('/:id') endpoint, it will interpret the /all route as a param and throw
   *
   * @returns an array of staff members
   */
  @Get('/all')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getDropdownFilterData() {
    return this.service.getDropdownFilterData();
  }

  /**
   * update entity
   * @param id
   * @param updateDto
   * @returns {object}
   */
  @Put('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_CONTACTS_STAFF_WRITE)
  async update(
    @Param('id') id: any,
    @Body() updateDto: UpdateStaffDto,
    @Request() req: UserRequest
  ) {
    updateDto.created_by = req.user.id;
    updateDto.tenant_id = req.user.tenant.id;
    return this.service.update(id, updateDto, req.user);
  }

  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_CONTACTS_STAFF_ARCHIVE,
    PermissionsEnum.STAFFING_MANAGEMENT_STAFF_LIST_ARCHIVE
  )
  async archive(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req?.user?.id;
    return this.service.archive(id, updatedBy);
  }

  /**
   * list of entity
   * @param getAllInterface
   * @returns {objects}
   * @deprecated
   */
  @Get('')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_CONTACTS_STAFF_WRITE,
    PermissionsEnum.CRM_CONTACTS_STAFF_READ
  )
  findAll(
    @Query() getAllInterface: GetAllStaffInterface,
    @Request() req: UserRequest
  ) {
    getAllInterface.tenant_id = req.user.tenant.id;
    return this.service.findAll(getAllInterface);
  }

  /**
   * list of filtered entity
   * @param getAllInterface
   * @returns {objects}
   */
  @Get('/filtered')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAllFiltered(
    @Query() getAllInterface: GetAllStaffFilteredInterface,
    @Request() req: UserRequest
  ) {
    getAllInterface['tenant_id'] = req.user.tenant.id;
    return this.service.findAllFiltered(getAllInterface);
  }

  /**
   * view of entity
   * @param id
   * @returns {object}
   */
  @Get('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_CONTACTS_STAFF_WRITE,
    PermissionsEnum.CRM_CONTACTS_STAFF_READ
  )
  async findOne(@Param('id') id: any, @Request() req: UserRequest) {
    return this.service.findOne(id);
  }

  /* --------------------staff role --------------------*/

  /**
   * create staff role
   * @param createDto
   * @returns
   */
  @Post(':id/roles')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  createStaffRoles(
    @Param('id') id: any,
    @Body() createDto: CreateStaffRolesMappingDto,
    @Request() req: UserRequest
  ) {
    createDto.created_by = req.user.id;
    createDto.tenant_id = req.user.tenant.id;
    return this.staffRolesMappingService.create(createDto);
  }

  /**
   * view of entity
   * @param id
   * @returns {object}
   */
  @Get(':id/roles')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findStaffRole(@Param('id') id: any, @Request() req: UserRequest) {
    return this.staffRolesMappingService.findOne(id);
  }

  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Patch('/:id/roles/:role_id/primary-status')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiParam({ name: 'role_id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateStaffRoles(
    @Param('id') id: any,
    @Param('role_id') role_id: any,
    @Body() updateDto: UpdateStaffRolesMappingDto,
    @Request() req: UserRequest
  ) {
    updateDto.created_by = req.user.id;
    updateDto.tenant_id = req.user.tenant.id;
    return this.staffRolesMappingService.update(id, role_id, updateDto);
  }

  @Patch('/:id/roles/:role_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiParam({ name: 'role_id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async archiveStaffRoles(
    @Param('id') id: any,
    @Param('role_id') role_id: any,
    @Body() updateDto: UpdateStaffRolesMappingDto,
    @Request() req: UserRequest
  ) {
    updateDto.created_by = req.user.id;
    updateDto.tenant_id = req.user.tenant.id;
    return this.staffRolesMappingService.archive(id, role_id, updateDto);
  }

  /* --------------------staff donor centers --------------------*/

  /**
   * create staff donor center
   * @param createDto
   * @returns
   */
  @Post(':id/donor-centers')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  createStaffDonorCenter(
    @Param('id') id: any,
    @Body() createDto: CreateStaffDonorCentersMappingDto,
    @Request() req: UserRequest
  ) {
    createDto.created_by = req.user.id;
    createDto.tenant_id = req.user.tenant.id;
    return this.staffDonorCentersMappingService.create(createDto);
  }

  /**
   * view of entity
   * @param id
   * @returns {object}
   */
  @Get(':id/donor-centers')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findStaffDonorCenter(
    @Param('id') id: any,
    @Request() req: UserRequest
  ) {
    return this.staffDonorCentersMappingService.findOne(id);
  }

  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Patch('/:id/donor-centers/:donor_center_id/primary-status')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiParam({ name: 'donor_center_id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateStaffDonorCenter(
    @Param('id') id: any,
    @Param('donor_center_id') donor_center_id: any,
    @Body() updateDto: UpdateStaffDonorCentersMappingDto,
    @Request() req: UserRequest
  ) {
    updateDto.created_by = req.user.id;
    updateDto.tenant_id = req.user.tenant.id;
    return this.staffDonorCentersMappingService.update(
      id,
      donor_center_id,
      updateDto
    );
  }

  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Patch('/:id/donor-centers/:donor_center_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiParam({ name: 'donor_center_id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async removeStaffDonorCenter(
    @Param('id') id: any,
    @Param('donor_center_id') donor_center_id: any,
    @Body() updateDto: UpdateStaffDonorCentersMappingDto,
    @Request() req: UserRequest
  ) {
    updateDto.created_by = req.user.id;
    updateDto.tenant_id = req.user.tenant.id;
    return this.staffDonorCentersMappingService.remove(
      id,
      donor_center_id,
      updateDto
    );
  }

  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Post('/staffs/:id/teams')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async assignStaffMembers(
    @Body() assignMembersDto: AssignStaffMembersDto,
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.service.assignStaffMembers(
      assignMembersDto,
      req.user.id,
      req.user.tenant.id
    );
  }
  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Patch('/staffs/:id/teams/primary')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async setPrimaryTeam(
    @Body() assignStaffPrimaryTeam: AssignStaffPrimaryTeam,
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.service.setPrimaryTeam(assignStaffPrimaryTeam, req.user.id);
  }
  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Patch('/staffs/:id/teams/remove')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async removeTeam(
    @Body() assignStaffPrimaryTeam: AssignStaffPrimaryTeam,
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.service.removeTeam(assignStaffPrimaryTeam, req.user.id);
  }
  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Get('/staffs/:id/teams')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async getStaffTeams(@Request() req: UserRequest, @Param('id') id: any) {
    return this.service.getStaffTeams(id);
  }
}
