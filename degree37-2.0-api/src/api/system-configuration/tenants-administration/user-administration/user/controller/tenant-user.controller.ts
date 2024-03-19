import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Headers,
  Put,
  Param,
  Get,
  Patch,
  Query,
  Req,
  Request,
} from '@nestjs/common';

import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.services';
import {
  CreateTenantUserDto,
  CreateUserDto,
  SearchUserDto,
} from '../dto/create-user.dto';
import {
  AccountStateInterface,
  GetAllTenantUsersInterface,
  ResetPasswordInterface,
  UpdateTenantUserInterface,
  UpdateUserInterface,
  UserInterface,
  updateManagerDto,
} from '../interface/user.interface';
import * as dotenv from 'dotenv';
import { UserRequest } from 'src/common/interface/request';
dotenv.config();

@ApiTags('Tenant Users')
@Controller('tenant-users')
export class TenantUserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async addUser(
    @Req() req: any,
    @Headers() headers,
    @Body() createTenantUserDto: CreateTenantUserDto
  ) {
    const subdomain =
      headers?.origin?.split('/')?.[2]?.split('.')?.[0] ??
      process.env.REALM_NAME;

    createTenantUserDto.tenant = req?.user?.tenant?.id;

    return this.userService.addUser(createTenantUserDto, subdomain);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  async update(
    @Headers() headers,
    @Body() updateTenantUserInterface: UpdateTenantUserInterface,
    @Request() req: UserRequest
  ) {
    const subdomain =
      headers?.origin?.split('/')?.[2]?.split('.')?.[0] ??
      process.env.REALM_NAME;
    return this.userService.update(updateTenantUserInterface, subdomain, req);
  }

  @Patch('/manager')
  @UsePipes(new ValidationPipe())
  async updateManager(
    @Headers() headers,
    @Body() updateTenantUserInterface: updateManagerDto,
    @Req() req: any
  ) {
    const subdomain =
      headers?.origin?.split('/')?.[2]?.split('.')?.[0] ??
      process.env.REALM_NAME;
    return this.userService.updateManager(
      updateTenantUserInterface,
      subdomain,
      req.user
    );
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  async getUsers(
    @Req() req: any,
    @Query() getAllTenantUsersInterface: GetAllTenantUsersInterface
  ) {
    return this.userService.getUsers(getAllTenantUsersInterface, req.user);
  }

  @Get('/managers')
  @UsePipes(new ValidationPipe())
  async getManagers(@Req() req: any) {
    return this.userService.getManagers(req.user);
  }

  @Get('/recruiters')
  @UsePipes(new ValidationPipe())
  async getRecruiters(@Req() req: any) {
    return this.userService.getRecruiters(req.user);
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', required: true })
  async updateAccountSate(
    @Param('id') id: any,
    @Body() accountState: AccountStateInterface
  ) {
    return this.userService.updateAccountSate(id, accountState);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  async getUser(@Param('id') id: any) {
    return this.userService.getUser(id);
  }

  @Get('/email/:work_email')
  @ApiParam({ name: 'work_email', required: true, type: 'string' })
  @UsePipes(new ValidationPipe())
  async getUserByEmail(@Param('work_email') work_email: any) {
    return this.userService.getUserByEmail(work_email);
  }

  @Patch('/archive/:id')
  @ApiParam({ name: 'id', required: true })
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
}
