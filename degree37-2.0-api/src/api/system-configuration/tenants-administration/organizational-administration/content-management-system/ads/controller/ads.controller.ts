import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Put,
  Get,
  Query,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from '../services/ads.service';
import { CreateAdsDto } from '../dto/create-ads.dto';
import { UpdateAdsDto } from '../dto/update-ads.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  AdsSearchInterface,
  AdsHistoryInterface,
  AdsStatusInterface,
} from '../interface/ads.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Ads')
@Controller('ad')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_WRITE
  )
  create(@Body() createAdsDto: CreateAdsDto) {
    return this.adsService.create(createAdsDto);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_WRITE
  )
  async update(@Body() updateAdsDto: UpdateAdsDto, @Req() req) {
    updateAdsDto.updated_by = req.user?.id;
    return this.adsService.update(updateAdsDto);
  }

  @Put('/archive/:id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_ARCHIVE
  )
  archiveAd(@Param('id') id: any, @Req() req) {
    const updatedBy = req?.user?.id;
    return this.adsService.archiveAd(id, updatedBy);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_WRITE
  )
  findAll(@Req() req, @Query() adsSearchInterface: AdsSearchInterface) {
    return this.adsService.findAll(adsSearchInterface, req?.user);
  }

  @Get('/history')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_WRITE
  )
  async getAdsHistory(@Query() adsHistoryInterface: AdsHistoryInterface) {
    return this.adsService.getAdsHistory(adsHistoryInterface);
  }

  @Get('/:id/:flag')
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'is_active' })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_WRITE
  )
  @HttpCode(HttpStatus.OK)
  async updateAdStatus(@Param() adsStatusInterface: AdsStatusInterface) {
    return this.adsService.updateAdStatus(adsStatusInterface);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_WRITE
  )
  async getAd(@Param('id') id: any) {
    return this.adsService.getAd(id);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.GONE)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_CONTENT_MANAGEMENT_SYSTEM_ADS_ARCHIVE
  )
  async deleteAds(@Param('id') id: any, @Req() req) {
    const updatedBy = req?.user?.id;
    return this.adsService.deleteAd(id, updatedBy);
  }
}
