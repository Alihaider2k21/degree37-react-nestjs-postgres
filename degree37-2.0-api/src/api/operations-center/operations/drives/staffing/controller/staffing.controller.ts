import {
  Controller,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { GetAllStaffingFilterInterface } from '../interface/get-staffing-filter.interface';
import { StaffingService } from '../service/staffing.service';

@ApiTags('Staffing')
@Controller('/operations/')
export class StaffingController {
  constructor(private readonly drivesService: StaffingService) {}

  @Get('drives/:id/staffing')
  @ApiParam({ name: 'id', required: true, type: BigInt })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_STAFFING)
  getAllByDrives(
    @Query() getStaffingFilterInterface: GetAllStaffingFilterInterface,
    @Param('id') id: bigint
  ) {
    return this.drivesService.getStaffScheduleDetails(
      id,
      getStaffingFilterInterface
    );
  }

  @Get('sessions/:id/staffing')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: BigInt })
  @UsePipes(new ValidationPipe())
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_SESSIONS_STAFFING)
  getAllBySessions(
    @Query() getStaffingFilterInterface: GetAllStaffingFilterInterface,
    @Param('id') id: bigint
  ) {
    return this.drivesService.getStaffScheduleDetails(
      id,
      getStaffingFilterInterface
    );
  }

  @Get('non_collection_events/:id/staffing')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: BigInt })
  @UsePipes(new ValidationPipe())
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_DRIVES_STAFFING)
  getAllByNce(
    @Query() getStaffingFilterInterface: GetAllStaffingFilterInterface,
    @Param('id') id: bigint
  ) {
    return this.drivesService.getStaffScheduleNceDetails(
      id,
      getStaffingFilterInterface
    );
  }
}
