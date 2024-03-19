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
import { UserRequest } from 'src/common/interface/request';
import {
  CreatePerformanceRulesDto,
  UpdatePerformanceRulesDto,
} from '../dto/create-performance-rules.dto';
import { GetAllPerformanceRulesInterface } from '../interface/performance-rules.interface';
import { PerformanceRulesService } from '../services/performance-rules.service';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Performance Rules')
@Controller('goals_performance_rules')
export class PerformanceRulesController {
  constructor(private readonly service: PerformanceRulesService) {}

  /**
   *
   * @param createDto
   * @returns
   */
  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_PERFORMANCE_RULES_WRITE
  )
  create(
    @Body() createDto: CreatePerformanceRulesDto,
    @Request() req: UserRequest
  ) {
    createDto.created_by = req.user.id;
    createDto.tenant_id = req.user.tenant.id;
    return this.service.create(createDto);
  }

  /**
   *
   * @param getAllInterface
   * @returns
   */
  @Get('')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_PERFORMANCE_RULES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_PERFORMANCE_RULES_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() getAllInterface: GetAllPerformanceRulesInterface,
    @Request() req: UserRequest
  ) {
    getAllInterface.tenant_id = req.user.tenant.id;
    return this.service.findAll(getAllInterface);
  }

  /**
   *
   * @param id
   * @param updateDto
   * @returns
   */
  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_PERFORMANCE_RULES_WRITE
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: any,
    @Body() updateDto: UpdatePerformanceRulesDto,
    @Request() req: UserRequest
  ) {
    updateDto.created_by = req.user.id;
    return this.service.update(id, updateDto);
  }

  /**
   *
   * @param id
   * @returns
   */
  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_PERFORMANCE_RULES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_GOALS_PERFORMANCE_RULES_WRITE
  )
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: any, @Request() req: UserRequest) {
    const tenant_id = req.user.tenant.id;
    return this.service.findOne(tenant_id);
  }
}
