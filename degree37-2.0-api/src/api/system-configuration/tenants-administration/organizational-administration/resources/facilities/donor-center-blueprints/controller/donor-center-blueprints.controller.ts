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
  Query,
  Request,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { DonorCenterBlueprintService } from '../services/donor-center-blueprints.services';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { GetAllAccountContactsInterface } from 'src/api/crm/accounts/interface/account-contacts.interface';
import {
  AddShiftSlotDTO,
  CreateBluePrintDTO,
  GetShiftIds,
  UpdateShiftsProjectionStaff,
} from '../dto/create-blueprint.dto';

@ApiTags('Donor Center Blueprints')
@Controller('/facility/donor-center')
export class DonorCenterBlueprintController {
  constructor(
    private readonly donorCenterBlueprintService: DonorCenterBlueprintService
  ) {}

  @Get('/bluePrints/:id/get')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  async getDenorCenterBluePrints(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Query() queryParams: GetAllAccountContactsInterface
  ) {
    console.log({ id });
    return this.donorCenterBlueprintService.findAllWithDonorSessionsFilters(
      req.user,
      id,
      queryParams
    );
  }

  @Get('/bluePrints/:id/get/default')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  async getDefaultDenorCenterBluePrints(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Query() queryParams: GetAllAccountContactsInterface
  ) {
    console.log({ id });
    return this.donorCenterBlueprintService.findDefaultWithDonorSessionsFilters(
      req.user,
      id,
      queryParams
    );
  }

  @Delete('/bluePrints/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  async archiveBlueprint(@Request() req: UserRequest, @Param('id') id: any) {
    return this.donorCenterBlueprintService.archiveBlueprint(req.user, id);
  }

  @Post('/bluePrints/create')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_WRITE)
  async createBluePrint(
    @Body() body: CreateBluePrintDTO,
    @Request() req: UserRequest
  ) {
    body.created_by = req.user.id;
    body.created_by = req.user;
    body.tenant_id = req.user.tenant.id;
    return this.donorCenterBlueprintService.createBluePrint(body);
  }

  @Get('/bluePrints/details/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  async getSingleBluePrintDetails(
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.donorCenterBlueprintService.getBluePrintDetails(req.user, id);
  }

  @Get('/bluePrints/shift-details/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  async getBluePrintShiftDetails(
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.donorCenterBlueprintService.getBluePrintShiftDetails(
      req.user,
      id
    );
  }

  @Get('/bluePrints/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  async getEditData(@Request() req: UserRequest, @Param('id') id: any) {
    return this.donorCenterBlueprintService.findOneDonorCenterBlueprint(
      req.user,
      id
    );
  }

  @Get('/bluePrints/donors-schedules/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  async getBluePrintDonorSchdules(
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.donorCenterBlueprintService.getBluePrintDonorSchdules(
      req.user,
      id
    );
  }

  @Post('/bluePrints/shifts/:shiftId/projection/:procedureTypeId/slots')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  // @ApiParam({ name: 'id', required: true })
  async addShiftSlot(
    @Request() req: UserRequest,
    @Body() addShiftSlotDto: AddShiftSlotDTO
  ) {
    return this.donorCenterBlueprintService.addShiftSlot(
      addShiftSlotDto,
      req.user
    );
  }

  @Patch('/bluePrints/shifts/slots/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  async archiveShiftSlot(@Request() req: UserRequest, @Param('id') id: any) {
    return this.donorCenterBlueprintService.archiveShiftSlot(id);
  }

  @Patch('/bluePrints/shifts/projection/staff')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async updateShiftProjectionStaff(
    @Request() req: UserRequest,
    @Body() updateShiftsProjectionStaff: UpdateShiftsProjectionStaff
  ) {
    return this.donorCenterBlueprintService.updateShiftProjectionStaff(
      updateShiftsProjectionStaff
    );
  }

  @Post('/bluePrints/shifts/procedure-type/slots')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async getProcedureTypeSlots(
    @Request() req: UserRequest,
    @Body() getShiftIds: GetShiftIds
  ) {
    return this.donorCenterBlueprintService.getProcedureTypeSlots(getShiftIds);
  }

  @Post('/bluePrints/shifts/procedure-type/projection-staff')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async getShiftProjectionStaff(
    @Request() req: UserRequest,
    @Body() getShiftIds: GetShiftIds
  ) {
    return this.donorCenterBlueprintService.getShiftProjectionStaff(
      getShiftIds
    );
  }
  @Post('/bluePrints/edit/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @ApiParam({ name: 'id', required: true })
  @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_WRITE)
  async edit(
    @Body() body: CreateBluePrintDTO,
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    body.created_by = req.user.id;
    body.created_by = req.user;
    body.tenant_id = req.user.tenant.id;
    return this.donorCenterBlueprintService.editData(id, body);
  }

  @Post('/makeDefault/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_READ)
  async addDonorCenterdefault(
    // @Body() createDonorCenterFilterDto: SaveFilterDTO,
    @Param('id') id: bigint,
    @Request() req: UserRequest
  ) {
    // createDonorCenterFilterDto.created_by = req.user.id;
    return this.donorCenterBlueprintService.makeDefault(id);
  }

  @Post('/duplicate/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.CRM_DONOR_CENTERS_READ)
  async addDonorCenterduplicate(
    // @Body() createDonorCenterFilterDto: SaveFilterDTO,
    @Param('id') id: bigint,
    @Request() req: UserRequest
  ) {
    // createDonorCenterFilterDto.created_by = req.user.id;
    const created_by = req.user.id;
    const tenant_id = req.user.tenant.id;
    return this.donorCenterBlueprintService.Duplicate(
      id,
      created_by,
      tenant_id
    );
  }
}
