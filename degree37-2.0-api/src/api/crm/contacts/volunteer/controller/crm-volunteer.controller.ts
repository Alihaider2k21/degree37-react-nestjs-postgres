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
import { CRMVolunteerService } from '../services/crm-volunteer.service';
import {
  CreateCRMVolunteerDto,
  UpdateCRMVolunteerDto,
} from '../dto/create-crm-volunteer.dto';
import { GetAllCRMVolunteerFilteredInterface } from '../interface/crm-volunteer.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { CreateCRMVolunteerActivityLog } from '../dto/create-activity-log.dto';
import { GetAllCRMVolunteerActivityLogInterface } from '../interface/crm-volunteer-activity-log.interface';
@ApiTags('CRM Volunteer')
@Controller('contact-volunteer')
export class VolunteerController {
  constructor(private readonly service: CRMVolunteerService) {}

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
  @Permissions(PermissionsEnum.CRM_CONTACTS_VOLUNTEERS_WRITE)
  create(
    @Body() createDto: CreateCRMVolunteerDto,
    @Request() req: UserRequest
  ) {
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
  @Permissions(PermissionsEnum.CRM_CONTACTS_VOLUNTEERS_WRITE)
  async update(
    @Param('id') id: any,
    @Body() updateDto: UpdateCRMVolunteerDto,
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
  @Permissions(PermissionsEnum.CRM_CONTACTS_VOLUNTEERS_ARCHIVE)
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
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.CRM_CONTACTS_VOLUNTEERS_WRITE,
  //   PermissionsEnum.CRM_CONTACTS_VOLUNTEERS_READ
  // )
  findAll(
    @Query() getAllInterface: GetAllCRMVolunteerFilteredInterface,
    @Request() req: UserRequest
  ) {
    getAllInterface['tenant_id'] = req.user.tenant.id;
    return this.service.findAllFiltered(getAllInterface);
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
    PermissionsEnum.CRM_CONTACTS_VOLUNTEERS_WRITE,
    PermissionsEnum.CRM_CONTACTS_VOLUNTEERS_READ
  )
  async findOne(@Param('id') id: any) {
    return this.service.findOne(id);
  }

  @Post('/activity-logs/:id/create')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UseGuards()
  createActvityLog(
    @Param('id') id: any,
    @Body() createActivtyLogDto: CreateCRMVolunteerActivityLog,
    @Request() req: UserRequest
  ) {
    return this.service.createActivityLog(id, createActivtyLogDto, req.user);
  }

  @Get('/activity-logs/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards()
  findAllActivity(
    @Param('id') id: any,
    @Query() getAllActivityInterface: GetAllCRMVolunteerActivityLogInterface
  ) {
    return this.service.findAllActivity(id, getAllActivityInterface);
  }
  @Get(':id/service-history')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards()
  async findServiceHistory(@Param('id') id: any) {
    return this.service.findServiceHistory(id);
  }
}
