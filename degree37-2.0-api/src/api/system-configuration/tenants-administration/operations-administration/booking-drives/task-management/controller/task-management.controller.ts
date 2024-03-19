import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Put,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TaskManagementService } from '../services/task-management.service';
import { CreateTaskManagementDto } from '../dto/create-task-management.dto';
import { UpdateTaskManagementDto } from '../dto/update-task-management.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArchiveTaskManagementDto } from '../dto/archive-task.dto';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Booking Drive - Task Management')
@Controller('booking-drive/task')
export class TaskManagementController {
  constructor(private readonly taskManagementService: TaskManagementService) {}

  @Post()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_TASK_MANAGEMENT_WRITE
  )
  create(
    @Body() createTaskManagementDto: CreateTaskManagementDto,
    @Request() req: UserRequest
  ) {
    createTaskManagementDto.created_by = req?.user?.id;
    return this.taskManagementService.create(createTaskManagementDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_TASK_MANAGEMENT_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_TASK_MANAGEMENT_READ
  )
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number for pagination',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
    required: false,
  })
  @ApiQuery({
    name: 'is_active',
    type: Boolean,
    description: 'Filter by active status',
    required: false,
  })
  @ApiQuery({
    name: 'owner',
    type: String,
    description: 'Filter by owner',
    required: false,
  })
  @ApiQuery({
    name: 'applies_to',
    type: String,
    description: 'Filter by applies_to',
    required: false,
  })
  @ApiQuery({
    name: 'collection_operation',
    type: String,
    description: 'Filter by collection_operation',
    required: false,
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('is_active') is_active: string,
    @Query('owner') owner: string,
    @Query('applies_to') applies_to: string,
    @Query('keyword') keyword: string,
    @Query('collection_operation') collection_operation: string,
    @Query('sort_name') sort_name: string,
    @Query('sort_order') sort_order: string
  ) {
    return this.taskManagementService.findAll(
      page,
      limit,
      is_active,
      owner,
      applies_to,
      keyword,
      collection_operation,
      sort_name,
      sort_order
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_TASK_MANAGEMENT_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_TASK_MANAGEMENT_READ
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  findOne(@Param('id') id: bigint) {
    return this.taskManagementService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_TASK_MANAGEMENT_WRITE
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  update(
    @Param('id') id: bigint,
    @Body() updateTaskManagementDto: UpdateTaskManagementDto,
    @Request() req: UserRequest
  ) {
    return this.taskManagementService.update(id, updateTaskManagementDto, req);
  }

  @Patch('archive/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_TASK_MANAGEMENT_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  archive(
    @Param('id') id: bigint,
    @Body() archiveTaskManagementDto: ArchiveTaskManagementDto,
    @Request() req: UserRequest
  ) {
    return this.taskManagementService.archive(
      id,
      archiveTaskManagementDto.is_archive,
      req
    );
  }
}
