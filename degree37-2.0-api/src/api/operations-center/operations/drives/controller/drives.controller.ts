import {
  Controller,
  Post,
  Put,
  Body,
  Request,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';
import { DrivesService } from '../service/drives.service';
import {
  CreateDonorAppointment,
  CreateDriveDto,
  UpdateDriveDto,
} from '../dto/create-drive.dto';
import {
  GetAllDrivesFilterInterface,
  GetAllPickupsInterface,
} from '../interface/get-drives-filter.interface';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
// import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
// import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import {
  AddShiftSlotDTO,
  GetDonorAppointmentOfDrive,
  GetShiftIds,
  UpdateShiftsProjectionStaff,
} from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/donor-center-blueprints/dto/create-blueprint.dto';
import { ListChangeAuditDto } from '../dto/change-audit.dto';
import { DonorCenterBlueprintService } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/donor-center-blueprints/services/donor-center-blueprints.services';
import { GetAllDonorsInterface } from 'src/api/crm/contacts/donor/interface/donors.interface';
import { DonorsService } from 'src/api/crm/contacts/donor/services/donors.service';
import { DriveContactsService } from '../service/drive-contacts.service';
import {
  DriveCertificationsDto,
  DriveContactsDto,
  DriveEquipmentsDto,
  LinkDriveDto,
} from '../dto/drives-contact.dto';
import { DriveCertificationsService } from '../service/drive-certifications.service';
import { PickupService } from '../service/pickups.service';
import { PickupDto } from '../dto/pickup.dto';
import { DriveEquipmentsService } from '../service/drive-equipments.service';
import { LinkedDriveService } from '../service/linked-drive.service';
import { updateDonorAppointmentDto } from 'src/api/crm/contacts/donor/dto/update-donors-appointment.dto';
import { CreateDonorAppointmentDto } from 'src/api/crm/contacts/donor/dto/create-donors-appointment.dto';

@ApiTags('Drives')
@Controller('drives')
export class DrivesController {
  constructor(
    private readonly drivesService: DrivesService,
    private readonly donorCenterBlueprintService: DonorCenterBlueprintService,
    private readonly donorService: DonorsService,
    private readonly driveContactService: DriveContactsService,
    private readonly driveCertificationsService: DriveCertificationsService,
    private readonly pickupService: PickupService,
    private readonly equipmentService: DriveEquipmentsService,
    private readonly linkDriveService: LinkedDriveService
  ) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_WRITE)
  async create(
    @Body() createDriveDto: CreateDriveDto,
    @Request() req: UserRequest
  ) {
    createDriveDto.created_by = req.user;
    createDriveDto.tenant_id = req.user.tenant;

    return await this.drivesService.create(createDriveDto);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_WRITE)
  @ApiParam({ name: 'id', required: true, type: Number })
  async edit(
    @Body() UpdateDriveDto: UpdateDriveDto,
    @Request() req: UserRequest,
    @Param('id') id: bigint
  ) {
    UpdateDriveDto.created_by = req.user.id;
    UpdateDriveDto.tenant_id = req.user.tenant.id;

    return await this.drivesService.update(UpdateDriveDto, id);
  }

  @Get('/')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ,
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_WRITE,
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_ARCHIVE
  // )
  @UsePipes(new ValidationPipe())
  getAll(
    @Query() getDrivesFilterInterface: GetAllDrivesFilterInterface,
    @Request() req: UserRequest
  ) {
    return this.drivesService.getAll(getDrivesFilterInterface);
  }

  @Get('/linkvehicles')
  @ApiBearerAuth()
  // @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findVehicles(@Request() req: UserRequest) {
    const tenant_id = req.user.tenant.id;
    return this.drivesService.GetAllDrivesWithVehicles(tenant_id);
  }

  @Get('/linkvehicles/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @HttpCode(HttpStatus.OK)
  async findShiftRelevents(
    @Request() req: UserRequest,
    @Param('id') id: bigint
  ) {
    return this.drivesService.getShiftDetails(id);
  }
  @Get('/last/:id')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ,
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_WRITE
  // )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  getLastDrive(@Request() req: UserRequest, @Param('id') id: bigint) {
    const tenant_id = req.user.tenant.id;
    return this.drivesService.getLastDrive(tenant_id, id);
  }

  @Get('/donors')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  findAll(
    @Query() getAllInterface: GetAllDonorsInterface,
    @Request() req: UserRequest
  ) {
    getAllInterface['tenant_id'] = req.user.tenant.id;
    return this.donorService.findAllFiltered(getAllInterface);
  }

  @Get('/:id')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ,
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_WRITE
  // )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: bigint) {
    return this.drivesService.findOne(id);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: bigint) {
    return this.drivesService.archive(id);
  }

  @Post('/shifts/:shiftId/projection/:procedureTypeId/slots')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  @UsePipes(new ValidationPipe())
  // @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async addShiftSlot(
    @Request() req: UserRequest,
    @Body() addShiftSlotDto: AddShiftSlotDTO
  ) {
    return this.drivesService.addShiftSlot(addShiftSlotDto, req.user);
  }

  @Post('/donors/appointments')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  async addDonorAppointments(
    @Body() createDonorAppointmentDto: CreateDonorAppointment
  ) {
    return this.drivesService.addDonorAppointments(createDonorAppointmentDto);
  }

  @Patch('/shifts/projection/staff')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async updateShiftProjectionStaff(
    @Request() req: UserRequest,
    @Body() updateShiftsProjectionStaff: UpdateShiftsProjectionStaff
  ) {
    return this.drivesService.updateShiftProjectionStaff(
      updateShiftsProjectionStaff
    );
  }

  @Post('/shifts/procedure-type/projection-staff')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async getShiftProjectionStaff(
    @Request() req: UserRequest,
    @Body() getShiftIds: GetShiftIds
  ) {
    return this.donorCenterBlueprintService.getShiftProjectionStaff(
      getShiftIds
    );
  }

  @Post('/shifts/procedure-type/slots')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async getProcedureTypeSlots(
    @Request() req: UserRequest,
    @Body() getShiftIds: GetShiftIds
  ) {
    return this.drivesService.getProcedureTypeSlots(getShiftIds);
  }

  @Get('/shifts/donors-schedules/:id')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async getBluePrintDonorSchdules(
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.drivesService.getDriveShiftDonorSchdules(req.user, id);
  }

  @Post(':drive_id/contacts')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'drive_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createContacts(
    @Param('drive_id') id: any,
    @Request() req: UserRequest,
    @Body() createContactsDto: DriveContactsDto
  ) {
    return this.driveContactService.createContacts(
      id,
      req.user,
      createContactsDto
    );
  }

  @Put(':drive_id/contacts/:contact_id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'contact_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async updateContacts(
    @Param('contact_id') contact_id: any,
    @Request() req: UserRequest
  ) {
    return this.driveContactService.updateContacts(contact_id, req.user);
  }

  @Post(':drive_id/certifications')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'drive_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createcertifications(
    @Param('drive_id') id: any,
    @Request() req: UserRequest,
    @Body() createcertificationsDto: DriveCertificationsDto
  ) {
    return this.driveCertificationsService.createCertifications(
      id,
      req.user,
      createcertificationsDto
    );
  }

  @Post(':drive_id/pickups')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'drive_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createPickups(
    @Param('drive_id') id: any,
    @Request() req: UserRequest,
    @Body() createPickupsDto: PickupDto
  ) {
    return this.pickupService.createPickups(id, req.user, createPickupsDto);
  }

  @Get(':drive_id/pickups')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'drive_id', required: true })
  @HttpCode(HttpStatus.OK)
  async getStages(
    @Param('drive_id') id: any,
    @Query() getAllPickupsInterface: GetAllPickupsInterface
  ) {
    return this.pickupService.findAll(id, getAllPickupsInterface);
  }
  @Get('/shift/:id')
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ,
  //   PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_WRITE
  // )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getShiftDetails(@Param('id') id: bigint) {
    return this.drivesService.getShiftInfo(id);
  }

  @Post(':drive_id/equipment')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'drive_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createEquipments(
    @Param('drive_id') id: any,
    @Request() req: UserRequest,
    @Body() createEquipmentsDto: DriveEquipmentsDto
  ) {
    return this.equipmentService.createEquipments(
      id,
      req.user,
      createEquipmentsDto
    );
  }

  @Put(':drive_id/equipment/:equipment_id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'equipment_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async updateEquipments(
    @Param('equipment_id') equipment_id: any,
    @Request() req: UserRequest
  ) {
    return this.equipmentService.updateEquipments(equipment_id, req.user);
  }

  @Post(':drive_id/link_drive')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'drive_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createLinkedDrives(
    @Param('drive_id') id: any,
    @Request() req: UserRequest,
    @Body() createlinkDriveDto: LinkDriveDto
  ) {
    return this.linkDriveService.createLinkedDrives(
      id,
      req.user,
      createlinkDriveDto
    );
  }
  // @Get(':collection_operation/:location_type')
  // @ApiBearerAuth()
  // @ApiParam({
  //   name: 'collection_operation',
  //   required: true,
  //   type: Number,
  // })
  // @ApiParam({
  //   name: 'location_type',
  //   required: true,
  //   type: Number,
  // })
  // @UsePipes(new ValidationPipe())
  // @HttpCode(HttpStatus.OK)
  // async vehicles(
  //   @Param('collection_operation') collection_operation: bigint,
  //   @Param('location_type') location_type: string,
  //   @Request() req: UserRequest
  // ) {
  //   const tenant_id = req.user.tenant;
  //   console.log({ collection_operation }, { location_type }, { tenant_id });
  @Get('/:id/change-audit')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  // @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_READ)
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getChangeAudit(
    @Param() id: any,
    @Query() listChangeAuditDto: ListChangeAuditDto,
    @Request() req: UserRequest
  ) {
    return this.drivesService.getChangeAudit(
      id,
      listChangeAuditDto,
      req?.user?.tenant?.id
    );
  }

  @Get('/blueprints/account/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAccountBlueprints(@Param('id') id: bigint) {
    return this.drivesService.getAccountBlueprints(id);
  }

  @Get('/single/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getDrive(@Param('id') id: bigint) {
    return this.drivesService.getSingleDrive(id);
  }

  @Put('/donors/:donorId/appointments/:appointmentId')
  @ApiParam({ name: 'donorId', required: true })
  @ApiParam({
    name: 'appointmentId',
    required: true,
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  async updateDonorAppointment(
    @Param('donorId') donorId: any,
    @Param('appointmentId') appointmentId: any,
    @Body() updateDonorAppointmentDto: updateDonorAppointmentDto,
    @Request() req: UserRequest
  ) {
    return this.donorService.updateDonorAppointment(
      req.user.id,
      donorId,
      appointmentId,
      updateDonorAppointmentDto
    );
  }

  @Get('/list/account/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAccountDrives(@Param('id') id: bigint) {
    return this.drivesService.getAccountDrives(id);
  }
}
