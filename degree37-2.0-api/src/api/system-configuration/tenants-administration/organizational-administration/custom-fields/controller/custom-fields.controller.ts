import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Query,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CustomFieldsService } from '../services/custom-fields.service';
import {
  CreateCustomFieldDataDto,
  CreateCustomFieldDto,
} from '../dto/create-custom-field.dto';
import {
  UpdateCustomFieldDto,
  updateCustomFieldDataDto,
} from '../dto/update-custom-field.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  GetAllCustomFieldDataInterface,
  GetAllCustomFieldInterface,
} from '../interface/custom-field.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
@ApiTags('Custom Fields')
@Controller('system-configuration/organization-administration/custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_WRITE
  )
  @UsePipes(new ValidationPipe())
  create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldsService.create(createCustomFieldDto);
  }

  @Post('data')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_WRITE
  )
  @UsePipes(new ValidationPipe())
  createCustomFieldData(
    @Body() createCustomFieldDataDto: CreateCustomFieldDataDto
  ) {
    return this.customFieldsService.createCustomFieldData(
      createCustomFieldDataDto
    );
  }

  @Put('data')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_WRITE
  )
  @UsePipes(new ValidationPipe())
  updateCustomFieldData(
    @Body() updateCustomFieldDataDto: updateCustomFieldDataDto
  ) {
    return this.customFieldsService.updateCustomFieldData(
      updateCustomFieldDataDto
    );
  }

  @Get('modules/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  getCustomFieldModules(@Param('id') id: any) {
    return this.customFieldsService.getCustomFieldModules(id);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_WRITE
  )
  @UsePipes(new ValidationPipe())
  findAll(@Query() getAllCustomFieldInterface: GetAllCustomFieldInterface) {
    return this.customFieldsService.findAll(getAllCustomFieldInterface);
  }

  @Get('data')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_WRITE
  // )
  @UsePipes(new ValidationPipe())
  getCustomFieldData(
    @Query() getAllCustomFieldDataInterface: GetAllCustomFieldDataInterface
  ) {
    return this.customFieldsService.getCustomFieldData(
      getAllCustomFieldDataInterface
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any) {
    return this.customFieldsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: string,
    @Body() updateCustomFieldDto: UpdateCustomFieldDto
  ) {
    return this.customFieldsService.update(+id, updateCustomFieldDto);
  }

  @Patch('archive/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CUSTOM_FIELDS_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  remove(@Param('id') id: any) {
    return this.customFieldsService.archive(+id);
  }
}
