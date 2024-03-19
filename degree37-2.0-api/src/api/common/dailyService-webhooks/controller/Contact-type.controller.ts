import {
  Controller,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Get,
  Query,
  Param,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interface/request';
import { CRMVolunteerService } from '../../../crm/contacts/volunteer/services/crm-volunteer.service';
import { StaffService } from '../../../crm/contacts/staff/services/staff.service';
import { DonorsService } from '../../../crm/contacts/donor/services/donors.service';
import { GetAllCRMVolunteerFilteredInterface } from '../interface/Contact-type.interface';
@ApiTags('Contacts')
@Controller('/contact')
export class VolunteerController {
  constructor(
    private readonly service: CRMVolunteerService,
    private readonly staffService: StaffService,
    private readonly donorService: DonorsService
  ) {}

  /**
   * list of entity
   * @param getAllInterface
   * @returns {objects}
   */
  @Get(':type/list')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('type') type: any,
    @Query() getAllInterface: GetAllCRMVolunteerFilteredInterface,
    @Request() req: UserRequest
  ) {
    getAllInterface['tenant_id'] = req.user.tenant.id;
    if (type === 'volunteer') {
      return this.service.findAllFiltered(getAllInterface);
    } else if (type === 'staff') {
      return this.staffService.findAll(getAllInterface);
    } else if (type === 'donor') {
      return this.donorService.findAllFiltered(getAllInterface);
    }
  }

  /**
   * view of entity
   * @param id
   * @returns {object}
   */
  @Get(':type/single/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: any, @Param('type') type: any) {
    if (type === 'volunteer') {
      return this.service.findOne(id);
    } else if (type === 'staff') {
      return this.staffService.findOne(id);
    } else if (type === 'donor') {
      return this.donorService.findOne(id);
    }
  }
}
