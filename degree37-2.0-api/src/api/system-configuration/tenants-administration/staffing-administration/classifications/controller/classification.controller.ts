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

import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateClassificationDto,
  GetAllClassificationDto,
  SearchClassificationDto,
  UpdateClassificationDto,
} from '../dto/create-classification.dto';
import { ClassificationService } from '../services/classification.services';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Classifications')
@Controller('/staffing-admin/classifications')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  async create(
    @Body() createClassificationDto: CreateClassificationDto,
    @Request() req: UserRequest
  ) {
    createClassificationDto.created_by = req.user?.id;
    return this.classificationService.create(createClassificationDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE,
  //   PermissionsEnum.STAFFING_MANAGEMENT_STAFF_LIST_READ
  // )
  async geAllClassifications(
    @Query() geAllClassificationsInterface: GetAllClassificationDto
  ) {
    const result = await this.classificationService.geAllClassifications(
      geAllClassificationsInterface
    );
    return result;
  }

  @Get('/settingless')
  @ApiExcludeEndpoint()
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  @HttpCode(HttpStatus.OK)
  async getClassificationWithoutSettings() {
    const result =
      await this.classificationService.getClassificationWithoutSettings();
    return result;
  }

  @Post('/search')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  async searchClassifications(
    @Query() searchClassificationDto: SearchClassificationDto
  ) {
    return this.classificationService.searchClassifications(
      searchClassificationDto
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  @HttpCode(HttpStatus.OK)
  async getClassification(@Param('id') id: string) {
    return this.classificationService.getClassification(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() updateClassificationDto: UpdateClassificationDto
  ) {
    updateClassificationDto.created_by = req.user.id;
    return this.classificationService.update(id, updateClassificationDto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_ARCHIVE
  )
  @HttpCode(HttpStatus.GONE)
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    const userId = req.user.id;
    return this.classificationService.remove(id, userId);
  }
}
