import {
  Body,
  Controller,
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
  BadRequestException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PromotionsService } from '../services/promotions_services';
import {
  CreatePromotionDto,
  UpdatePromotionDto,
} from '../dto/create-promotion.dto';
import {
  GetAllPromotionsInterface,
  GetPromotionsForDriveInterface,
} from '../interface/promotions.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Promotions')
@Controller('')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('/marketing-equipment/promotions')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_WRITE
  )
  findAll(@Query() getAllPromotionsInterface: GetAllPromotionsInterface) {
    return this.promotionsService.findAll(getAllPromotionsInterface);
  }

  @Get('/marketing-equipment/promotions/drives')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_WRITE
  // )
  findAllForDrives(
    @Query() getPromotionsInterface: GetPromotionsForDriveInterface
  ) {
    return this.promotionsService.findAllForDrives(getPromotionsInterface);
  }

  @Post('/marketing-equipment/promotions/search')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_WRITE
  )
  async findByFilter(
    @Body() getAllPromotionsInterface: GetAllPromotionsInterface
  ) {
    return this.promotionsService.findAll(getAllPromotionsInterface);
  }

  @Post('/marketing-equipment/promotions')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_WRITE
  )
  async create(
    @Headers() headers,
    @Body() createPromotionDto: CreatePromotionDto,
    @Request() req: UserRequest
  ) {
    createPromotionDto.created_by = req.user.id;
    return this.promotionsService.create(createPromotionDto);
  }

  @Put('/marketing-equipment/promotions/:promotionsId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'promotionsId', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_WRITE
  )
  update(
    @Headers() headers,
    @Param('promotionsId') id: any,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @Request() req: UserRequest
  ) {
    updatePromotionDto.created_by = req.user.id;
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Get('/marketing-equipment/promotions/:promotionsId')
  @ApiParam({ name: 'promotionsId', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_WRITE
  )
  @UsePipes(new ValidationPipe())
  findOne(@Param('promotionsId') id: any) {
    return this.promotionsService.findOne(id);
  }

  @Patch('/marketing-equipment/promotions/archive/:promotionId')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'promotionId', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONS_ARCHIVE
  )
  @HttpCode(HttpStatus.OK)
  async archive(@Param('promotionId') id: any, @Request() req: UserRequest) {
    if (!id) {
      throw new BadRequestException('Promotion Id is required');
    }
    const userId = req.user.id;

    return this.promotionsService.archive(id, userId);
  }
}
