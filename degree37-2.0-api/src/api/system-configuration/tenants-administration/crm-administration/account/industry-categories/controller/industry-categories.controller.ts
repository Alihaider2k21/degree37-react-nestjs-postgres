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
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { IndustryCategoriesService } from '../service/industry-categories.service';
import {
  CreateIndustryCategoriesDto,
  UpdateIndustryCategoriesDto,
} from '../dto/industry-categories.dto';
import { GetAllIndustryCategoriesInterface } from '../interface/industry-categories.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Industry Categories')
@Controller('accounts')
export class IndustryCategoriesController {
  constructor(
    private readonly industryCategoriesService: IndustryCategoriesService
  ) {}

  @Post('industry_categories')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_WRITE
  )
  createCategory(
    @Body() createIndustryCategoriesDto: CreateIndustryCategoriesDto
  ) {
    return this.industryCategoriesService.create(createIndustryCategoriesDto); // Use the category service
  }

  @Get('industry_categories')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_WRITE
  )
  findAllCategories(
    @Query()
    getAllIndustryCategoriesInterface: GetAllIndustryCategoriesInterface
  ) {
    return this.industryCategoriesService.findAll(
      getAllIndustryCategoriesInterface
    ); // Use the category service
  }
  @Get('industry-subcategories/parent/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_SUBCATEGORY_READ
  )
  async findSubCategory(@Param('id') id: any) {
    return this.industryCategoriesService.getSubIndustryCategory(id); // Use the category service
  }

  @Get('industry_categories/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_WRITE
  )
  async findCategory(@Param('id') id: any) {
    return this.industryCategoriesService.findOne(id); // Use the category service
  }

  @Put('industry_categories/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_WRITE
  )
  async updateCategory(
    @Param('id') id: any,
    @Body() updateIndustryCategoriesDto: UpdateIndustryCategoriesDto,
    @Request() req: UserRequest
  ) {
    return this.industryCategoriesService.update(
      id,
      updateIndustryCategoriesDto,
      req
    ); // Use the category service
  }

  @Patch('industry_categories/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_INDUSTRY_CATEGORY_ARCHIVE
  )
  async archiveCategory(@Param('id') id: any, @Request() req: UserRequest) {
    return this.industryCategoriesService.archive(id, req); // Use the category service
  }
}
