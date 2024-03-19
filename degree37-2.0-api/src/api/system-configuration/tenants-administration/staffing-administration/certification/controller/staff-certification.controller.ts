import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignStaffCertificationDto } from '../dto/assign-staff-certification.dto';
import { StaffCertificationService } from '../service/staff-certification.service';
import { QueryStaffCertificationDto } from '../dto/query-staff-certification.dto';
import { QueryNotCertifiedStaffDto } from '../dto/query-not-certified-staff.dto';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Staff Certification')
@Controller('/staffing-admin/certification/staff-certification')
export class StaffCertificationController {
  constructor(
    private readonly staffCertificationService: StaffCertificationService
  ) {}

  @Post('/assign')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_ASSIGNED_CERTIFICATION_WRITE
  )
  async assign(
    @Res() res,
    @Body() assignStaffCertificationDto: AssignStaffCertificationDto
  ) {
    const data = await this.staffCertificationService.assign(
      assignStaffCertificationDto
    );
    return res.status(data.status_code).json(data);
  }

  @Get('/not-certified')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_ASSIGNED_CERTIFICATION_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_ASSIGNED_CERTIFICATION_WRITE
  )
  async getNotCertifiedStaff(
    @Res() res,
    @Query() query: QueryNotCertifiedStaffDto
  ) {
    const {
      page,
      limit,
      keyword = '',
      sortName,
      sortOrder,
      ...filters
    } = query;
    const data = await this.staffCertificationService.getNotCertifiedStaff(
      page,
      limit,
      keyword,
      { sortName, sortOrder },
      { ...filters }
    );
    return res.status(data.status_code).json(data);
  }

  @Get('/list')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_ASSIGNED_CERTIFICATION_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_ASSIGNED_CERTIFICATION_WRITE
  )
  @UsePipes(new ValidationPipe())
  async get(@Res() res, @Query() query: QueryStaffCertificationDto) {
    const {
      page,
      limit,
      keyword = '',
      sortName,
      sortOrder,
      ...filters
    } = query;
    const data = await this.staffCertificationService.get(
      page,
      limit,
      keyword,
      { sortName, sortOrder },
      { ...filters }
    );
    return res.status(data.status_code).json(data);
  }

  @Delete(':id/delete')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_ARCHIVE
  )
  async delete(@Res() res, @Param('id') id: bigint) {
    const data = await this.staffCertificationService.delete(id);
    return res.status(data.status_code).json(data);
  }
}
