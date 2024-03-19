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
  Req,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  DailyCapacityDto,
  UpdateDailyCapacityDto,
} from '../dto/daily-capacity.dto';
import { DailyCapacityService } from '../services/daily-capacity.service';
import { DailyCapacityInterface } from '../interface/dailycapacity.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Daily Capacity')
@Controller('booking-drive/daily-capacity')
export class DailyCapacityController {
  constructor(private readonly dailyCapacityService: DailyCapacityService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_CAPACITY_WRITE
  )
  create(@Body() createDailyCapacityDto: DailyCapacityDto) {
    return this.dailyCapacityService.create(createDailyCapacityDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_CAPACITY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_CAPACITY_READ
  )
  findAll(@Query() dailyCapacityInterface: DailyCapacityInterface) {
    return this.dailyCapacityService.getAllDailyCapacities(
      dailyCapacityInterface
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_CAPACITY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_CAPACITY_READ
  )
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: any) {
    return this.dailyCapacityService.findOne(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_CAPACITY_WRITE
  )
  update(
    @Param('id') id: any,
    @Body() updateDailyCapacityDto: UpdateDailyCapacityDto,
    @Request() req: UserRequest
  ) {
    updateDailyCapacityDto.updated_by = req.user.id;
    return this.dailyCapacityService.update(id, updateDailyCapacityDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_CAPACITY_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return this.dailyCapacityService.deleteDailyCapacity(id);
  }
}
