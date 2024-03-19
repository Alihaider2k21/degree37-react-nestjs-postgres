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
  Request,
  Patch,
  Put,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';

// import { ApiParam, ApiTags } from "@nestjs/swagger";
// import { AccountsService } from "../services/accounts.service";
// import { AccountsDto } from "../dto/accounts.dto";
import { UserRequest } from '../../../../common/interface/request';
import { LocationsDto } from '../dto/locations.dto';
import { LocationsService } from '../services/locations.services';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  GetAllLocationInterface,
  GetDrivesHistoryQuery,
} from '../interface/locations.interface';
// import { GetAllAccountsInterface } from "../interface/accounts.interface";
// import { AccountFiltersDto } from "../dto/accounts-filters.dto";
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
@ApiTags('CrmLocations')
@Controller('crm/locations')
export class LocationsController {
  constructor(private readonly locationService: LocationsService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_LOCATIONS_WRITE)
  async create(
    @Request() req: UserRequest,
    @Body() createLocationsDto: LocationsDto
  ) {
    return this.locationService.create(req.user, createLocationsDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_LOCATIONS_WRITE)
  async update(
    @Request() req: UserRequest,
    @Body() createLocationsDto: LocationsDto,
    @Param('id') id: any
  ) {
    // console.log({ id });
    return this.locationService.update(id, req.user, createLocationsDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.CRM_LOCATIONS_WRITE,
  //   PermissionsEnum.CRM_LOCATIONS_READ
  // )
  async findAllFilters(
    @Request() req: UserRequest,
    @Query() GetAllLocationInterface: GetAllLocationInterface
  ) {
    return await this.locationService.findAll(
      req.user,
      GetAllLocationInterface
    );
  }

  @Get('/withDirections')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findAllWithDirections(@Request() req: UserRequest) {
    return this.locationService.findAllWithDirections(req.user);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_LOCATIONS_WRITE,
    PermissionsEnum.CRM_LOCATIONS_READ
  )
  async getItemByid(
    @Request() req: UserRequest,
    // @Body() createLocationsDto: LocationsDto,
    @Param('id') id: any
  ) {
    // console.log({ id });
    return this.locationService.getItemByid(id, req.user);
  }

  @Patch('archive/:id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_LOCATIONS_ARCHIVE)
  async archive(
    @Request() req: UserRequest,
    // @Body() createLocationsDto: LocationsDto,
    @Param('id') id: any
  ) {
    // console.log({ id });
    return this.locationService.Archive(id, req.user);
  }

  @Get('/:id/drives-history')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async driveHistory(
    @Param('id') id: any,
    @Query() params: GetDrivesHistoryQuery,
    @Request() req: UserRequest
  ) {
    return this.locationService.driveHistory(id, params, req?.user);
  }

  @Get('/:id/drives-history/kpi')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async driveHistoryKPI(@Param('id') id: any) {
    return this.locationService.driveHistoryKPI(id);
  }

  @Get('/:id/drives-history/detail/:driveId')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'driveId', required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async driveHistoryDetail(
    @Param('id') id: any,
    @Param('driveId') driveId: any,
    @Query() params: GetDrivesHistoryQuery,
    @Request() req: UserRequest
  ) {
    return this.locationService.driveHistoryDetail(
      id,
      params,
      req?.user,
      driveId
    );
  }
  // { path: "/crm/locations/archive/:id", method: RequestMethod.PATCH }
  //   @Get("filters")
  //   @UsePipes(new ValidationPipe())
  //   @HttpCode(HttpStatus.OK)
  //   async findAllFilters(
  //     @Query() GetAllAccountsInterface: GetAllAccountsInterface
  //   ) {
  //     return this.accountsService.findAllFilters();
  //   }

  //   @Post("filters")
  //   @UsePipes(new ValidationPipe())
  //   @HttpCode(HttpStatus.CREATED)
  //   async createFilter(
  //     @Request() req: UserRequest,
  //     @Body() createAccountFilterDto: AccountFiltersDto
  //   ) {
  //     return this.accountsService.createFilter(req.user, createAccountFilterDto);
  //   }

  //   // @Put(':id')
  //   // @UsePipes(new ValidationPipe())
  //   // @HttpCode(HttpStatus.CREATED)
  //   // async update(@Param('id') id: any, @Body() updateAccountDto: AccountsDto) {
  //   //   return {};
  //   // }

  //   // @Get(':id')
  //   // @ApiParam({ name: 'id', required: true })
  //   // @HttpCode(HttpStatus.OK)
  //   // async findOne(@Param('id') id: any) {
  //   //   return {};
  //   // }

  //   // @Delete(':id')
  //   // @UsePipes(new ValidationPipe())
  //   // @HttpCode(HttpStatus.GONE)
  //   // @ApiParam({ name: 'id', required: true })
  //   // async delete(@Param('id') id: any) {
  //   //   return {};
  //   // }
}
