import {
  Controller,
  Post,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Body,
  Get,
  Param,
  Put,
  Request,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateGoalVarianceDto,
  UpdateGoalVarianceDto,
} from '../dto/goal-variance.dto';
import { UserRequest } from 'src/common/interface/request';
import { GoalVarianceService } from '../services/goal-variance.service';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Goal Variance')
@Controller('goal_variance')
export class GoalVarianceController {
  constructor(private readonly goalVarianceService: GoalVarianceService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_GOAL_VARIANCE_WRITE
  )
  create(
    @Body() createGoalVarianceDto: CreateGoalVarianceDto,
    @Request() req: UserRequest
  ) {
    createGoalVarianceDto.created_by = req.user.id;
    return this.goalVarianceService.create(createGoalVarianceDto);
  }

  @Get('')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_GOAL_VARIANCE_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_GOAL_VARIANCE_WRITE
  )
  async find(@Param('id') id: any, @Request() req: UserRequest) {
    const tenantId = req?.user?.tenant?.id;
    const userId = req.user.id;
    return this.goalVarianceService.findOne(tenantId, userId);
  }

  @Put('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_CALENDAR_GOAL_VARIANCE_WRITE
  )
  update(
    @Param('id') id: any,
    @Body() updateGoalVarianceDto: UpdateGoalVarianceDto,
    @Request() req: UserRequest
  ) {
    updateGoalVarianceDto.created_by = req.user.id;
    const tenantId = req?.user?.tenant?.id;
    const userId = req.user.id;
    return this.goalVarianceService.update(
      id,
      userId,
      tenantId,
      updateGoalVarianceDto
    );
  }
}
