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
import {
  CreateMonthlyGoalsDto,
  UpdateMonthlyGoalsDto,
} from '../dto/create-monthly-goals.dto';
import {
  GetAllMonthlyGoalsInterface,
  getRecruitersAndDonorCenetrs,
} from '../interface/monthly-goals.interface';
import { MonthlyGoalsService } from '../services/monthly-goals.service';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Monthly Goals')
@Controller('monthly_goals')
export class MonthlyGoalsController {
  constructor(private readonly monthlyGoalsService: MonthlyGoalsService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_WRITE
  )
  create(
    @Body() createMonthlyGoalsDto: CreateMonthlyGoalsDto,
    @Request() req: UserRequest
  ) {
    createMonthlyGoalsDto.created_by = req.user.id;
    createMonthlyGoalsDto.tenant_id = req.user.tenant.id;
    return this.monthlyGoalsService.create(createMonthlyGoalsDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_WRITE
  )
  findAll(
    @Query() getAllMonthlyGoalsInterface: GetAllMonthlyGoalsInterface,
    @Request() req: UserRequest
  ) {
    getAllMonthlyGoalsInterface.tenant_id = req.user.tenant.id;
    return this.monthlyGoalsService.findAll(getAllMonthlyGoalsInterface);
  }

  @Get('/donors_recruiters')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findRecruitersAndDonors(
    @Query() collectionOpertaion: getRecruitersAndDonorCenetrs,
    @Request() req: UserRequest
  ) {
    collectionOpertaion.tenant_id = req.user.tenant?.id;
    return this.monthlyGoalsService.getRecruitersAndDonorCenetrs(
      collectionOpertaion
    );
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_WRITE
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: any) {
    return this.monthlyGoalsService.findOne(id);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_WRITE
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id') id: any,
    @Body() updateMonthlyGoalsDto: UpdateMonthlyGoalsDto,
    @Request() req: UserRequest
  ) {
    updateMonthlyGoalsDto.created_by = req.user.id;
    updateMonthlyGoalsDto.tenant_id = req.user.tenant.id;
    return this.monthlyGoalsService.update(id, updateMonthlyGoalsDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_MONTHLY_GOALS_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req?.user?.id;
    return this.monthlyGoalsService.archive(id, +updatedBy);
  }
}
