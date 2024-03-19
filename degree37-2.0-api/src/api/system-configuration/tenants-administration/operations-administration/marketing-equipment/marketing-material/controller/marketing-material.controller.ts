import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../../../../../../../common/interface/request';
import { CreateMarketingMaterialDto } from '../dto/create-marketing-material.dto';
import { MarketingMaterialService } from '../services/marketing-material.service';
import { UpdateMarketingMaterialDto } from '../dto/update-marketing-material.dto';
import {
  GetAllMarketingMaterialCOInterface,
  GetAllMarketingMaterialInterface,
} from '../interface/marketing-material.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Marketing Material')
@Controller('marketing-equipment/marketing-material')
export class MarketingMaterialController {
  constructor(
    private readonly marketingMaterialService: MarketingMaterialService
  ) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_WRITE
  )
  create(
    @Request() req: UserRequest,
    @Body() createMarketingMaterialDto: CreateMarketingMaterialDto
  ) {
    createMarketingMaterialDto.created_by = req.user?.id;
    createMarketingMaterialDto.tenant_id = req.user?.tenant?.id;
    return this.marketingMaterialService.create(createMarketingMaterialDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any) {
    return this.marketingMaterialService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateMarketingMaterialDto: UpdateMarketingMaterialDto
  ) {
    return this.marketingMaterialService.update(id, updateMarketingMaterialDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() getAllMarketingMaterialInterface: GetAllMarketingMaterialInterface,
    @Request() req: UserRequest
  ) {
    getAllMarketingMaterialInterface.tenantId = req.user?.tenant?.id;
    return this.marketingMaterialService.findAll(
      getAllMarketingMaterialInterface
    );
  }

  @Get('/drives/byCollectionOperation')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_WRITE
  // )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAllByCollectionOperation(
    @Query()
    getAllMarketingMaterialCOInterface: GetAllMarketingMaterialCOInterface,
    @Request() req: UserRequest
  ) {
    getAllMarketingMaterialCOInterface.tenantId = req.user?.tenant?.id;
    return this.marketingMaterialService.findAllByCollectionOperation(
      getAllMarketingMaterialCOInterface
    );
  }

  @Put('/archive/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_MARKETING_MATERIAL_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any) {
    return this.marketingMaterialService.archiveMarketingMaterial(id);
  }
}
