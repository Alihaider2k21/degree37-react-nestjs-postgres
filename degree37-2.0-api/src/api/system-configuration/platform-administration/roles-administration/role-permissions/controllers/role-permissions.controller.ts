import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolePermissionsService } from '../services/role-permissions.service';
import {
  CreateRolePermissionDto,
  CreateTenantRolePermissionDto,
} from '../dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from '../dto/update-role-permission.dto';
import {
  GetAllPermissionsInterface,
  GetAllRolesInterface,
  RemovePermissionsInterface,
} from '../interface/rolePermission.interface';
import { ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ArchiveRoleInterface } from '../interface/archiveRole.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
@ApiTags('Role-Permissions')
@Controller('')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService
  ) {}

  @Post('/roles')
  @UsePipes()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.ROLE_ADMINISTRATION_WRITE)
  create(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
    @Request() req: UserRequest
  ) {
    return this.rolePermissionsService.create(
      createRolePermissionDto,
      req.user
    );
  }

  @Post('/roles/tenant/create')
  @UsePipes()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  createRoleByTenant(
    @Body() createRolePermissionDto: CreateTenantRolePermissionDto,
    @Request() req: UserRequest
  ) {
    return this.rolePermissionsService.createRoleByTenant(
      createRolePermissionDto,
      req.user
    );
  }

  @Delete('/permissions/:roleId/:permissionId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  removePermission(
    @Param() removePermissionsInterface: RemovePermissionsInterface
  ) {
    return this.rolePermissionsService.removePermission(
      removePermissionsInterface
    );
  }

  @Get('/permissions')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(@Query() getAllPermissionsInterface: GetAllPermissionsInterface) {
    return this.rolePermissionsService.findAll(getAllPermissionsInterface);
  }

  @Get('/roles')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.ROLE_ADMINISTRATION_WRITE,
    PermissionsEnum.ROLE_ADMINISTRATION_READ,
    PermissionsEnum.ROLE_ADMINISTRATION_ARCHIVE
  )
  findAllRoles(
    @Query() getAllRolesInterface: GetAllRolesInterface,
    @Request() req: any
  ) {
    return this.rolePermissionsService.findAllRoles(
      getAllRolesInterface,
      req.user
    );
  }

  @Get('/roles/all')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  getAllRoles(@Request() req: any) {
    return this.rolePermissionsService.getAllRoles(req.user);
  }

  @Get('/roles/tenant/list')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAllTenantRoles(
    @Query() getAllRolesInterface: GetAllRolesInterface,
    @Request() req: UserRequest
  ) {
    return this.rolePermissionsService.findAllTenantRoles(
      getAllRolesInterface,
      req.user
    );
  }

  @Get('/roles/tenant/all')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  getAllTenantRoles(@Request() req: any) {
    return this.rolePermissionsService.getAllTenantRole(req.user);
  }
  @Get('/roles/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.ROLE_ADMINISTRATION_WRITE,
    PermissionsEnum.ROLE_ADMINISTRATION_READ
  )
  findOneRole(@Param('id') id: any) {
    return this.rolePermissionsService.findOneRole(id);
  }

  @Get('/roles/tenant/:id')
  @ApiParam({ name: 'id', required: true })
  findOneTenantRole(@Param('id') id: any) {
    return this.rolePermissionsService.findOneTenantRole(id);
  }

  @Get('/roles/tenant/assigned/:id')
  @ApiParam({ name: 'id', required: true })
  findAssignedTenantRole(
    @Query() getAllRolesInterface: GetAllRolesInterface,
    @Param('id') id: any
  ) {
    return this.rolePermissionsService.findAssignedTenantRole(
      getAllRolesInterface,
      id
    );
  }

  @Patch('/roles/archive/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  archiveRole(
    @Param('id') id: any,
    @Body() archiveRoleInterface: ArchiveRoleInterface
  ) {
    return this.rolePermissionsService.archiveRole(id, archiveRoleInterface);
  }

  @Get('/roles/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.ROLE_ADMINISTRATION_WRITE,
    PermissionsEnum.ROLE_ADMINISTRATION_READ
  )
  findOne(@Param('id') id: string) {
    return this.rolePermissionsService.findOne(+id);
  }

  @Patch('/roles/:id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.ROLE_ADMINISTRATION_WRITE)
  updateRole(
    @Param('id') id: any,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto
  ) {
    return this.rolePermissionsService.updateRole(id, updateRolePermissionDto);
  }

  @Patch('/roles/tenant/:id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  updateTenantRole(
    @Param('id') id: any,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto
  ) {
    return this.rolePermissionsService.updateRole(id, updateRolePermissionDto);
  }
  @Delete('/roles/:id')
  remove(@Param('id') id: string) {
    return this.rolePermissionsService.remove(+id);
  }
}
