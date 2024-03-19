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
  Put,
  Request,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTerritoriyDto, GetAllTerritoryDto } from '../dto/territory.dto';
import { TerritoryService } from '../services/territories.service';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Territories')
@Controller('/territories')
export class TerritoryController {
  constructor(private readonly territoriesService: TerritoryService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_GEO_ADMINISTRATION_TERRITORY_MANAGEMENT_WRITE
  )
  async create(
    @Body() createTerritoriesDto: CreateTerritoriyDto,
    @Request() req: UserRequest
  ) {
    createTerritoriesDto.created_by = req.user.id;
    return this.territoriesService.create(createTerritoriesDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_GEO_ADMINISTRATION_TERRITORY_MANAGEMENT_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_GEO_ADMINISTRATION_TERRITORY_MANAGEMENT_WRITE
  )
  async geAllTerritories(
    @Query() getAllTerritoriesInterface: GetAllTerritoryDto
  ) {
    const result = await this.territoriesService.getAllTerritories(
      getAllTerritoriesInterface
    );
    return result;
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_GEO_ADMINISTRATION_TERRITORY_MANAGEMENT_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_GEO_ADMINISTRATION_TERRITORY_MANAGEMENT_WRITE
  )
  async getTerritory(@Param('id') id: string) {
    return this.territoriesService.getTerritory(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_GEO_ADMINISTRATION_TERRITORY_MANAGEMENT_WRITE
  )
  update(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() updateTerritoryDto: CreateTerritoriyDto
  ) {
    updateTerritoryDto.created_by = req.user.id;
    return this.territoriesService.update(id, updateTerritoryDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_GEO_ADMINISTRATION_TERRITORY_MANAGEMENT_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    const userId = req.user.id;
    return this.territoriesService.remove(id, userId);
  }
}
