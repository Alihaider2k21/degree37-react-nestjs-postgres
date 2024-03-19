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
import { DailyHourDto, UpdateDailyHourDto } from '../dto/daily-hour.dto';
import { DailyHourService } from '../services/daily-hour.service';
import {
  DailyHourInterface,
  GetByCollectionOperationInterface,
} from '../interface/dailyhour.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Daily Hour')
@Controller('booking-drive/daily-hour')
export class DailyHourController {
  constructor(private readonly dailyHourService: DailyHourService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_WRITE
  )
  create(@Body() createDailyHourDto: DailyHourDto) {
    return this.dailyHourService.create(createDailyHourDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_READ
  )
  findAll(@Query() dailyHourInterface: DailyHourInterface) {
    return this.dailyHourService.getAll(dailyHourInterface);
  }

  @Get('/drive')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_READ
  )
  getByCollectionOperationId(
    @Query()
    getByCollectionOperationIdInterface: GetByCollectionOperationInterface
  ) {
    return this.dailyHourService.getByCollectionOperationId(
      getByCollectionOperationIdInterface
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_READ
  )
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: any) {
    return this.dailyHourService.findOne(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateDailyHourDto: UpdateDailyHourDto,
    @Request() req: UserRequest
  ) {
    updateDailyHourDto.updated_by = req.user.id;
    return this.dailyHourService.update(id, updateDailyHourDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_DAILY_HOURS_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return this.dailyHourService.deleteDailyHour(id);
  }
}
