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
import { UserService } from '../services/user.services';
import { CreateUserDto, SearchUserDto } from '../dto/create-user.dto';
import {
  GetAllUsersInterface,
  ResetPasswordInterface,
  UpdateUserInterface,
  UserInterface,
} from '../interface/user.interface';
import * as dotenv from 'dotenv';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
dotenv.config();

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.USER_ADMINISTRATION_READ,
    PermissionsEnum.USER_ADMINISTRATION_WRITE,
    PermissionsEnum.USER_ADMINISTRATION_ARCHIVE
  )
  async getUsers(
    @Req() req: any,
    @Query() getAllUsersInterface: GetAllUsersInterface
  ) {
    return this.userService.getUsers(getAllUsersInterface, req.user);
  }

  @Get('/recruiters')
  @UsePipes(new ValidationPipe())
  async getBusinessUnitRecruiters(@Req() req: any, @Query('id') id: any) {
    return this.userService.getBusinessUnitRecruiters(req.user, id);
  }

  @Post('/search')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.USER_ADMINISTRATION_READ,
    PermissionsEnum.USER_ADMINISTRATION_WRITE,
    PermissionsEnum.USER_ADMINISTRATION_ARCHIVE
  )
  async searchUsers(@Body() searchUserDto: SearchUserDto) {
    return this.userService.searchUsers(searchUserDto);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.USER_ADMINISTRATION_WRITE)
  async addUser(
    @Req() req: any,
    @Headers() headers,
    @Body() createUserDto: CreateUserDto
  ) {
    const subdomain =
      headers?.origin?.split('/')?.[2]?.split('.')?.[0] ??
      process.env.REALM_NAME;
    createUserDto.tenant = req?.user?.tenant?.id;
    return this.userService.addUser(createUserDto, subdomain);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.USER_ADMINISTRATION_WRITE)
  async update(
    @Headers() headers,
    @Body() updateUserInterface: UpdateUserInterface,
    @Request() req: UserRequest
  ) {
    const subdomain =
      headers?.origin?.split('/')?.[2]?.split('.')?.[0] ??
      process.env.REALM_NAME;

    return this.userService.update(updateUserInterface, subdomain, req);
  }

  @Get('/all-users')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAllUsers(@Req() req: any) {
    return this.userService.getAllUsers(req.user);
  }

  @Get('/all-owners')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getOwners(@Query('id') id: any, @Req() req: any) {
    return this.userService.getOwner(req.user, id);
  }

  @Get('/collection-operation/:id/all-owners')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getCollectionOperationOwner(@Param('id') id: any, @Req() req: any) {
    return this.userService.getCollectionOperationOwner(req.user, id);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: any) {
    return this.userService.getUser(id);
  }
  @Patch('/archive/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', required: true })
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.USER_ADMINISTRATION_ARCHIVE)
  async deleteUser(
    @Headers() headers,
    @Param('id') id: any,
    @Request() req: UserRequest
  ) {
    const subdomain =
      headers?.origin?.split('/')?.[2]?.split('.')?.[0] ??
      process.env.REALM_NAME;

    return this.userService.deleteUser(id, subdomain, req);
  }

  @Patch('/:id/update_password')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.USER_ADMINISTRATION_UPDATE_PASSWORD)
  async updatePassword(
    @Headers() headers,
    @Param('id') id: any,
    @Body() password: ResetPasswordInterface,
    @Request() req: UserRequest
  ) {
    const subdomain =
      headers?.origin?.split('/')?.[2]?.split('.')?.[0] ??
      process.env.REALM_NAME;

    return this.userService.updatePassword(id, password, subdomain, req);
  }

  @Get('/current/detail')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: UserRequest) {
    const userId = req?.user?.id;
    return this.userService.getCurrentUser(userId);
  }

  @Get('admin_user/:tenantId')
  @ApiBearerAuth()
  @ApiParam({ name: 'tenantId', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAdminUser(@Param('tenantId') tenantId: any) {
    return this.userService.getAdminUser(tenantId);
  }
}
