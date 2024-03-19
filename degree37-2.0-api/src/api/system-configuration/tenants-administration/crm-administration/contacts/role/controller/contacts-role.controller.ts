import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  Put,
  Request,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContactsRoleService } from '../services/contacts-role.service';
import {
  CreateContactsRoleDto,
  ArchiveDto,
} from '../dto/create-contacts-role.dto';
import { UpdateContactsRoleDto } from '../dto/update-contacts-role.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetAllRolesInterface } from '../interface/contact-role.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Contact Roles')
@Controller('contact-roles')
export class ContactsRoleController {
  constructor(private readonly contactsRoleService: ContactsRoleService) {}

  @Post('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_ROLES_WRITE
  )
  create(
    @Body() createContactsRoleDto: CreateContactsRoleDto,
    @Request() req: UserRequest
  ) {
    createContactsRoleDto.created_by = req?.user?.id;
    createContactsRoleDto.tenant_id = req?.user?.tenant?.id;
    return this.contactsRoleService.create(createContactsRoleDto);
  }

  @Get()
  @ApiBearerAuth()
  findAll(@Query() getAllrolesInterface: GetAllRolesInterface, @Req() req) {
    return this.contactsRoleService.findAll(getAllrolesInterface, req.user);
  }

  @Get('/volunteer')
  @ApiBearerAuth()
  findVolunteerContacRoles(@Request() req: UserRequest) {
    return this.contactsRoleService.findVolunteerContactRoles(req.user);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_ROLES_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_ROLES_READ
  )
  findOne(@Param('id') id: any) {
    return this.contactsRoleService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_ROLES_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateContactsRoleDto: UpdateContactsRoleDto,
    @Request() req: UserRequest
  ) {
    updateContactsRoleDto.updated_by = req?.user?.id;
    return this.contactsRoleService.update(id, updateContactsRoleDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_ROLES_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  remove(
    @Param('id') id: any,
    @Body() archiveDto: ArchiveDto,
    @Request() req: UserRequest
  ) {
    archiveDto.updated_by = req?.user?.id;
    return this.contactsRoleService.archive(id, archiveDto);
  }
}
