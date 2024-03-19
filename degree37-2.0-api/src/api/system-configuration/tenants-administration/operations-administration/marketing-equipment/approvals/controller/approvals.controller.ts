import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApprovalsService } from '../services/approvals.services';
import { CreateAprovalsDto } from '../dto/create-promotion.dto';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Marketing Equipment Approvals')
@Controller('/marketing-equipment/approvals')
// @Controller("/marketing-equipment/approvals")
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_APPROVALS_WRITE
  )
  // @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAprovalsDtoDto: CreateAprovalsDto) {
    return this.approvalsService.create(createAprovalsDtoDto);
  }

  @Put('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_APPROVALS_WRITE
  )
  update(@Body() createAprovalsDto: CreateAprovalsDto) {
    return this.approvalsService.update(createAprovalsDto);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_APPROVALS_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_MARKETING_EQUIPMENTS_APPROVALS_WRITE
  // )
  @UsePipes(new ValidationPipe())
  findOne() {
    return this.approvalsService.findOne();
  }
}
