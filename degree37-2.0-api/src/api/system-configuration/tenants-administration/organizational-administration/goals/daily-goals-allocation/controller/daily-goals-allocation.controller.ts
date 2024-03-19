import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { DailyGoalsAllocationService } from '../service/daily-goals-allocation.service';
import { CreateDailyGoalsAllocationDto } from '../dto/create-daily-goals-allocation.dto';
import { UpdateDailyGoalsAllocationDto } from '../dto/update-daily-goals-allocation.dto';
import { DailyGoalAllocationsFiltersInterface } from '../interface/daily-goals.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Daily Goals Allocation')
@Controller('daily-goals-allocation')
export class DailyGoalsAllocationController {
  constructor(
    private readonly dailyGoalsAllocationService: DailyGoalsAllocationService
  ) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_WRITE
  )
  create(
    @Body() createDailyGoalsAllocationDto: CreateDailyGoalsAllocationDto,
    @Request() req: UserRequest
  ) {
    createDailyGoalsAllocationDto.created_by = req.user.id;
    createDailyGoalsAllocationDto.tenant_id = req.user.tenant.id;
    return this.dailyGoalsAllocationService.create(
      createDailyGoalsAllocationDto
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_WRITE
  )
  findAll(
    @Query()
    dailyGoalAllocationsFiltersInterface: DailyGoalAllocationsFiltersInterface,
    @Request() req: UserRequest
  ) {
    dailyGoalAllocationsFiltersInterface.tenant_id = req.user.tenant.id;
    return this.dailyGoalsAllocationService.findAll(
      dailyGoalAllocationsFiltersInterface
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any, @Request() req: UserRequest) {
    return this.dailyGoalsAllocationService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateDailyGoalsAllocationDto: UpdateDailyGoalsAllocationDto,
    @Request() req: UserRequest
  ) {
    updateDailyGoalsAllocationDto.created_by = req.user.id;
    updateDailyGoalsAllocationDto.tenant_id = req.user.tenant.id;
    return this.dailyGoalsAllocationService.update(
      id,
      updateDailyGoalsAllocationDto
    );
  }

  @Put('/archive/:id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  archiveRole(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req.user.id;
    return this.dailyGoalsAllocationService.archiveDailyGoal(id, +updatedBy);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_DAILY_GOALS_ALLOCATION_ARCHIVE
  )
  remove(@Param('id') id: string, @Request() req: UserRequest) {
    return this.dailyGoalsAllocationService.remove(+id);
  }
}
