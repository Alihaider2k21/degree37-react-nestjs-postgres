import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Request,
  Get,
  Query,
  Param,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateClassificationSettingDto,
  GetAllClassificationSettingDto,
  SearchClassificationSettingDto,
  UpdateClassificationSettingsDto,
} from '../dto/setting.dto';
import { ClassificationSettingService } from '../services/setting.service';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Classification Settings')
@Controller('/staffing-admin/setting')
export class ClassificationSettingController {
  constructor(private readonly settingervice: ClassificationSettingService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_WRITE
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSettingDto: CreateClassificationSettingDto,
    @Request() req: UserRequest
  ) {
    createSettingDto.created_by = req.user?.id;
    return this.settingervice.create(createSettingDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_WRITE
  )
  async geAllClassificationSettings(
    @Query()
    geAllClassificationSettingsInterface: GetAllClassificationSettingDto
  ) {
    const result = await this.settingervice.geAllClassificationSettings(
      geAllClassificationSettingsInterface
    );
    return result;
  }

  @Post('/search')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_WRITE
  )
  async searchClassificationSettings(
    @Query() searchClassificationDto: SearchClassificationSettingDto
  ) {
    return this.settingervice.searchClassificationSettings(
      searchClassificationDto
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_WRITE
  )
  async getClassificationSetting(@Param('id') id: string) {
    return this.settingervice.getClassificationSetting(id);
  }

  @Get('classification/:classificationId')
  @ApiParam({ name: 'classificationId', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_WRITE
  )
  async getClassificationSettingByClassification(
    @Param('classificationId') classificationId: string
  ) {
    return this.settingervice.getClassificationSettingByClassification(
      classificationId
    );
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_WRITE
  )
  update(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() updateClassificationDto: UpdateClassificationSettingsDto
  ) {
    updateClassificationDto.created_by = req.user?.id;
    return this.settingervice.update(id, updateClassificationDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_SETTINGS_ARCHIVE
  )
  @HttpCode(HttpStatus.GONE)
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    const userId = req.user?.id;
    return this.settingervice.remove(id, userId);
  }
}
