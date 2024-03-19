import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';
import { GetReportInterface } from '../interface/report.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':type')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'type', required: true })
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.LOG_AND_EVENT_MANAGEMENT_READ)
  async generateReport(
    @Param('type') type: string,
    @Query() getReportInterface: GetReportInterface
  ) {
    return this.reportService.generateReport(type, getReportInterface);
  }
}
