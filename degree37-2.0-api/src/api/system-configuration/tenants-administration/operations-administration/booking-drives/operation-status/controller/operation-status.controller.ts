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
  Patch,
  Param,
  BadRequestException,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  OperationStatusDto,
  UpdateOperationStatusDto,
} from '../dto/oepration-status.dto';
import { OperationStatusService } from '../services/operation-status.service';
import { OperationStatusInterface } from '../interface/operation-status.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Operation Status')
@Controller('booking-drive/operation-status')
export class OperationStatusController {
  constructor(
    private readonly operationStatusService: OperationStatusService
  ) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_WRITE
  )
  create(@Body() createOperationStatusDto: OperationStatusDto) {
    return this.operationStatusService.create(createOperationStatusDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_WRITE,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_READ
  // )
  findAll(@Query() operationStatusInterface: OperationStatusInterface) {
    return this.operationStatusService.getAllOperationStatus(
      operationStatusInterface
    );
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_ARCHIVE
  )
  async archive(@Param('id') id: any, @Req() req) {
    if (!id) {
      throw new BadRequestException('Operation Id is required');
    }
    const updatedBy = req.user.id;
    return this.operationStatusService.archive(id, updatedBy);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_READ
  )
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: any) {
    return this.operationStatusService.findOne(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateOperationStatusDto: UpdateOperationStatusDto,
    @Req() req
  ) {
    updateOperationStatusDto.updated_by = req.user.id;
    return this.operationStatusService.update(id, updateOperationStatusDto);
  }

  @Get('/association/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_OPERATION_STATUS_READ
  )
  @UsePipes(new ValidationPipe())
  findAssosication(@Param('id') id: any) {
    return this.operationStatusService.findAssociations(id);
  }
}
