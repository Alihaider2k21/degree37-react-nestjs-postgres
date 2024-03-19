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
  Patch,
  Put,
  Query,
  Request,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { FacilityService } from '../services/facility.services';
import { CreateFacilityDto } from '../dto/create-facility.dto';

import { GetAllFacilityDto } from '../dto/get-all-facility.dto';
import { UserRequest } from 'src/common/interface/request';
import { GetAllDonorCenterFilterDto } from '../interface/get-donor-center-filter.dto';
import { SaveFilterDTO } from '../dto/save-filter.dto';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import {
  QuerySessionHistoryDto,
  QuerySessionHistoryKPIDto,
} from '../dto/query-session-history.dto';
import { GetDonorCenterStagingSitesInterface } from '../interface/facility.interface';

@ApiTags('Facilities')
@Controller('/system-configuration/facilities')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_FACILITIES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_FACILITIES_WRITE
  )
  async getFacilities(
    @Query() getAllFacilitiesTypeInterface: GetAllFacilityDto
  ) {
    return this.facilityService.getFacilities(getAllFacilitiesTypeInterface);
  }

  @Get('/donor-centers/filters')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_READ)
  async getDonorCenterFilter() {
    return this.facilityService.getDonorCenterFilter();
  }

  @Post('/donor-centers/filters')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_READ)
  async addDonorCenterFilter(
    @Body() createDonorCenterFilterDto: SaveFilterDTO,
    @Request() req: UserRequest
  ) {
    createDonorCenterFilterDto.created_by = req.user.id;
    return this.facilityService.addDonorCenterFilter(
      createDonorCenterFilterDto
    );
  }

  @Post('/donor-centers/search')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.CRM_DONOR_CENTERS_READ,
  //   PermissionsEnum.STAFFING_MANAGEMENT_STAFF_LIST_READ
  // )
  async searchByDonorCenterFilter(
    @Body() getDonorCentersFilter: GetAllDonorCenterFilterDto,
    @Request() request: UserRequest
  ) {
    return this.facilityService.searchByDonorCenterFilter(
      getDonorCentersFilter,
      request?.user
    );
  }

  @Get('/collection_operation/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_READ)
  async getFacilityofCollectionOperation(@Param('id') id: string) {
    return this.facilityService.getFacilityBasedonCollectionOperation(id);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_FACILITIES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_FACILITIES_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getFacility(@Param('id') id: string) {
    return this.facilityService.getFacility({ id });
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_FACILITIES_WRITE
  )
  async addFacility(
    @Request() req: UserRequest,
    @Body() createFacilityDto: CreateFacilityDto
  ) {
    return this.facilityService.addFacility(createFacilityDto, req.user);
  }

  @Put('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_RESOURCES_FACILITIES_WRITE
  )
  async updateFacility(
    @Param('id') id: string,
    @Body() updateFacilityDto: CreateFacilityDto,
    @Request() req: UserRequest
  ) {
    updateFacilityDto.updated_by = req.user.id;
    return this.facilityService.UpdateFacility({ id }, updateFacilityDto);
  }

  @Get('/:id/sessions-histories/key-performance-indicators')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async getSessionHistoryKPI(
    @Res() res,
    @Param('id') id: number,
    @Query() query: QuerySessionHistoryKPIDto
  ) {
    const data = await this.facilityService.getSessionHistoryKPI(
      id,
      query.kind
    );
    return res.status(data.status_code).json(data);
  }

  @Get('/:id/sessions-histories')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async getSessionHistory(
    @Res() res,
    @Param('id') id: number,
    @Query() query: QuerySessionHistoryDto
  ) {
    const { page, limit, sortName, sortOrder, ...filters } = query;
    const data = await this.facilityService.getSessionHistory(
      page,
      limit,
      { sortName, sortOrder },
      { ...filters, facility_id: id }
    );
    return res.status(data.status_code).json(data);
  }

  @Get('/:id/sessions-histories/:sessionId')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async getSessionHistoryDetail(
    @Res() res,
    @Param('id') id: number,
    @Param('sessionId') sessionId: number
  ) {
    const data = await this.facilityService.getSessionHistoryDetail(
      id,
      sessionId
    );
    return res.status(data.status_code).json(data);
  }

  @Delete('/donor-centers/filters/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_READ)
  @HttpCode(HttpStatus.OK)
  async deleteDonorCenterFilter(
    @Param('id') id: bigint,
    @Request() req: UserRequest
  ) {
    return this.facilityService.deleteDonorCenterFilter(req.user.id, id);
  }

  @Patch('/donor-centers/archive/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_ARCHIVE)
  @HttpCode(HttpStatus.OK)
  async archiveDonorCenter(
    @Param('id') id: bigint,
    @Request() request: UserRequest
  ) {
    return this.facilityService.deleteDonorCenter(request.user.id, id);
  }

  @Get('/donor-centers/city-sate')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_READ)
  @ApiBearerAuth()
  async donorCenterCityState(@Request() request: UserRequest) {
    return this.facilityService.donorCenterCityState(request.user);
  }

  @Get('/get/stagingsite-donorcenters')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getStagingSitesandDonorCenters(
    @Query() query: GetDonorCenterStagingSitesInterface
  ) {
    return this.facilityService.getStagingSitesandDonorCenters(query);
  }
}
