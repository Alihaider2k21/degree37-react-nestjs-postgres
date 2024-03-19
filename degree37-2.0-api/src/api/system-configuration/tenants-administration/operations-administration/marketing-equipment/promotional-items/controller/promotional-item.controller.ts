import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../../../../../../../common/interface/request';
import { PromotionalItemService } from '../services/promotional-item.service';
import {
  GetAllPromotionalItemCOInterface,
  GetAllPromotionalItemInterface,
} from '../interface/promotional-item.interface';
import { UpdatePromotionalItemDto } from '../dto/update-promotional-item.dto';
import { CreatePromotionalItemDto } from '../dto/create-promotional-item.dto';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Promotional Items')
@Controller('marketing-equipment/promotional-items')
export class PromotionalItemController {
  constructor(
    private readonly promotionalItemService: PromotionalItemService
  ) {}

  @Post('/')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_WRITE
  )
  @UsePipes(new ValidationPipe())
  create(
    @Request() req: UserRequest,
    @Body() createPromotionalItemDto: CreatePromotionalItemDto
  ) {
    createPromotionalItemDto.created_by = req.user?.id;
    createPromotionalItemDto.tenant_id = req.user?.tenant?.id;
    return this.promotionalItemService.create(createPromotionalItemDto);
  }

  @Get('/')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_WRITE
  // )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() getAllPromotionalItemInterface: GetAllPromotionalItemInterface,
    @Request() req: UserRequest
  ) {
    getAllPromotionalItemInterface.tenantId = req.user?.tenant?.id;
    return this.promotionalItemService.findAll(getAllPromotionalItemInterface);
  }

  @Post('/search')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_WRITE
  )
  async searchClassifications(
    @Body() getAllPromotionalItemInterface: GetAllPromotionalItemInterface
  ) {
    return this.promotionalItemService.findAll(getAllPromotionalItemInterface);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any) {
    return this.promotionalItemService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Body() updatePromotionalItemDto: UpdatePromotionalItemDto
  ) {
    updatePromotionalItemDto.created_by = req.user?.id;
    return this.promotionalItemService.update(id, updatePromotionalItemDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_ARCHIVE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  archive(@Request() req: UserRequest, @Param('id') id: any) {
    return this.promotionalItemService.archive(req.user, id);
  }

  @Get('/drives/byCollectionOperation')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_PROMOTIONAL_ITEMS_WRITE
  // )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAllByCollectionOperation(
    @Query()
    getAllPromotionalItemCOInterface: GetAllPromotionalItemCOInterface,
    @Request() req: UserRequest
  ) {
    getAllPromotionalItemCOInterface.tenantId = req.user?.tenant?.id;
    return this.promotionalItemService.findAllByCollectionOperation(
      getAllPromotionalItemCOInterface
    );
  }
}
