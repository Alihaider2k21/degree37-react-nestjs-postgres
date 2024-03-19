import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Put,
  Delete,
  Request,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { BannerService } from '../services/banner.services';
import { BannerDto } from '../dto/banner.dto';
import { UserRequest } from '../../../../../../../common/interface/request';
import { BannerInterface } from '../interface/banner.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Banners')
@Controller('/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_BANNER_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_BANNER_READ
  )
  async findAll(@Query() getAllBannersInterface: BannerInterface) {
    return this.bannerService.findAll(getAllBannersInterface);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_BANNER_WRITE
  )
  async create(
    @Request() req: UserRequest,
    @Body() createBannerDto: BannerDto
  ) {
    return this.bannerService.create(req.user, createBannerDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_BANNER_WRITE
  )
  async update(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Body() updateBannerDto: BannerDto
  ) {
    return this.bannerService.update(req.user, id, updateBannerDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_BANNER_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_BANNER_READ
  )
  async findOne(@Param('id') id: any) {
    return this.bannerService.findOne(id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.GONE)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_BANNER_MANAGEMENT_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  async archive(@Request() req: UserRequest, @Param('id') id: any) {
    return this.bannerService.archive(req.user, id);
  }
}
