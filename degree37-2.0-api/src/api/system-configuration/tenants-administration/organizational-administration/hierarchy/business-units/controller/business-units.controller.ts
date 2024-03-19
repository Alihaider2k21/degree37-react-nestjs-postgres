import {
  Controller,
  Get,
  Post,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Body,
  Query,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { BusinessUnitsService } from '../services/business-units.service';
import {
  BusinessUnitDto,
  GetAllBusinessUnitDto,
  GetAllCollectionOperations,
} from '../dto/business-units.dto';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { QueryBusinessUnitDto } from '../dto/query-business-units.dto';

@ApiTags('Business Units')
@Controller('business_units')
export class BusinessUnitsController {
  constructor(private readonly businessUnitService: BusinessUnitsService) {}

  @Post('')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_BUSINESS_UNITS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() businessUnitDto: BusinessUnitDto,
    @Request() req: UserRequest
  ) {
    const tenant_id = parseInt(req.user.tenant?.id);
    businessUnitDto.tenant_id = tenant_id;
    return this.businessUnitService.create(businessUnitDto);
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_BUSINESS_UNITS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_BUSINESS_UNITS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  listAll(@Request() req: UserRequest, @Query() query: QueryBusinessUnitDto) {
    const tenant_id = parseInt(req.user.tenant?.id);
    return this.businessUnitService.listAll(tenant_id, query);
  }

  @Get('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async geAlltBusinessUnits(
    @Query() getAllBusinessUnitsInterface: GetAllBusinessUnitDto,
    @Request() req: UserRequest
  ) {
    const tenant_id = parseInt(req.user.tenant?.id);
    getAllBusinessUnitsInterface.tenant_id = tenant_id;
    const result = await this.businessUnitService.getAlltBusinessUnits(
      getAllBusinessUnitsInterface
    );
    return result;
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_BUSINESS_UNITS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_BUSINESS_UNITS_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getBusinessUnit(@Param('id') id: string) {
    return this.businessUnitService.getBusinessUnit(id);
  }

  @Get('collection_operations/list')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getUserCollectionOperations(
    @Request() req: UserRequest,
    @Query('id') id: any,
    @Query('isFilter') isFilter: any
  ) {
    return this.businessUnitService.getUserCollectionOperations(
      req.user,
      id,
      isFilter
    );
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_BUSINESS_UNITS_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateBusinessUnit(
    @Param('id') id: string,
    @Body() updateBusinessUnitDto: BusinessUnitDto,
    @Request() req: UserRequest
  ) {
    updateBusinessUnitDto.updated_by = req?.user?.id;
    return this.businessUnitService.updateBusinessUnit(
      id,
      updateBusinessUnitDto
    );
  }

  @Put('/archive/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_BUSINESS_UNITS_ARCHIVE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  archiveBusinessUnit(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req?.user?.id;
    return this.businessUnitService.archiveBusinessUnit(id, updatedBy);
  }
}
