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
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interface/request';
import { DonorsService } from '../services/donors.service';
import { CreateDonorsDto, UpdateDonorsDto } from '../dto/create-donors.dto';
import {
  GetAllDonorsAppointments,
  GetAllDonorsInterface,
  GetAppointmentCreateDetailsInterface,
  GetAppointmentsCreateListingInterface,
  GetStartTimeCreateDetailsInterface,
} from '../interface/donors.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { CreateDonorAppointmentDto } from '../dto/create-donors-appointment.dto';
import {
  cancelDonorAppointmentDto,
  updateDonorAppointmentDto,
} from '../dto/update-donors-appointment.dto';
@ApiTags('Donors')
@Controller('contact-donors')
export class DonorsController {
  constructor(private readonly service: DonorsService) {}

  /**
   * create entity
   * @param createDto
   * @returns
   */
  @Post('')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_CONTACTS_DONOR_WRITE)
  create(@Body() createDto: CreateDonorsDto, @Request() req: UserRequest) {
    createDto.created_by = req.user.id;
    createDto.tenant_id = req.user.tenant.id;
    return this.service.create(createDto, req.user);
  }

  /**
   * update entity
   * @param id
   * @param updateDto
   * @returns {object}
   */
  @Put('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_CONTACTS_DONOR_WRITE)
  async update(
    @Param('id') id: any,
    @Body() updateDto: UpdateDonorsDto,
    @Request() req: UserRequest
  ) {
    updateDto.created_by = req.user.id;
    updateDto.tenant_id = req.user.tenant.id;
    return this.service.update(id, updateDto, req.user);
  }

  /**
   * archive entity
   * @param id
   * @param req
   * @returns {object}
   */
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_CONTACTS_DONOR_ARCHIVE)
  async archive(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req?.user?.id;
    return this.service.archive(id, updatedBy);
  }

  /**
   * list of entity
   * @param getAllInterface
   * @returns {objects}
   */
  @Get('')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_CONTACTS_DONOR_WRITE,
    PermissionsEnum.CRM_CONTACTS_DONOR_READ
  )
  findAll(
    @Query() getAllInterface: GetAllDonorsInterface,
    @Request() req: UserRequest
  ) {
    getAllInterface['tenant_id'] = req.user.tenant.id;
    return this.service.findAllFiltered(getAllInterface);
  }

  /**
   * list of entity
   * @param getAllAppointmentsInterface
   * @returns {objects}
   */
  @Get('/donor-appointments')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_CONTACTS_DONOR_WRITE,
    PermissionsEnum.CRM_CONTACTS_DONOR_READ
  )
  fetchDonorAppointments(
    @Query() getAllAppointmentsInterface: GetAllDonorsAppointments,
    @Request() req: UserRequest
  ) {
    getAllAppointmentsInterface['tenant_id'] = req.user.tenant.id;
    return this.service.fetchDonorAppointments(getAllAppointmentsInterface);
  }

  @Get('/donor-appointments/create-listing/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  createDonorListing(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Query()
    getAppointmentsCreateListingInterface: GetAppointmentsCreateListingInterface
  ) {
    return this.service.createDonorListing(
      id,
      getAppointmentsCreateListingInterface,
      req?.user?.tenant?.id
    );
  }

  @Get('/donor-appointments/filters/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  getDonorAppointmentFilters(
    @Param('id') id: any,
    @Request() req: UserRequest
  ) {
    return this.service.getDonorAppointmentFilters(req?.user?.tenant?.id);
  }

  @Get('/donor-appointments/create-details/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  getDonationTypeAppointmentCreateDetails(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Query()
    getAppointmentCreateDetailsInterface: GetAppointmentCreateDetailsInterface
  ) {
    return this.service.getDonationTypeAppointmentCreateDetails(
      getAppointmentCreateDetailsInterface,
      req?.user?.tenant?.id
    );
  }

  @Get('/donor-appointments/create-details/start-time/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  getStartTimeAppointmentCreateDetails(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Query()
    getStartTimeCreateDetailsInterface: GetStartTimeCreateDetailsInterface
  ) {
    return this.service.getStartTimeAppointmentCreateDetails(
      getStartTimeCreateDetailsInterface
    );
  }

  @Get('/donor-appointments/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  GetDonorAppointment(@Param('id') id: any, @Request() req: UserRequest) {
    return this.service.getDonorAppointment(id);
  }

  @Get('/appointment/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  GetSingleDonorAppointment(@Param('id') id: any, @Request() req: UserRequest) {
    return this.service.getSingleAppointment(id);
  }

  @Post('/appointments')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  async addDonorAppointment(
    @Body() createDonorAppointmentDto: CreateDonorAppointmentDto,
    @Request() req: UserRequest
  ) {
    createDonorAppointmentDto.created_by = req?.user?.id;
    return this.service.addDonorAppointment(createDonorAppointmentDto);
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
    return this.service.updateDonorAppointment(
      req.user.id,
      donorId,
      appointmentId,
      updateDonorAppointmentDto
    );
  }

  @Put('/donors/:donorId/appointments/cancel/:appointmentId')
  @ApiParam({ name: 'donorId', required: true })
  @ApiParam({
    name: 'appointmentId',
    required: true,
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  async cancelDonorAppointment(
    @Param('donorId') donorId: any,
    @Param('appointmentId') appointmentId: any,
    @Body() cancelDonorAppointmentDto: cancelDonorAppointmentDto,
    @Request() req: UserRequest
  ) {
    return this.service.cancelDonorAppointment(
      req.user.id,
      donorId,
      appointmentId,
      cancelDonorAppointmentDto
    );
  }

  @Get('/donor-appointments/archive/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.CRM_CONTACTS_DONOR_WRITE,
  //   PermissionsEnum.CRM_CONTACTS_DONOR_READ
  // )
  archiveDonorAppointment(@Param('id') id: any, @Request() req: UserRequest) {
    return this.service.archiveDonorAppointment(id, req.user);
  }
  /**
   * view of entity
   * @param id
   * @returns {object}
   */
  @Get('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_CONTACTS_DONOR_WRITE,
    PermissionsEnum.CRM_CONTACTS_DONOR_READ
  )
  async findOne(@Param('id') id: any, @Request() req: UserRequest) {
    return this.service.findOne(id);
  }
}
