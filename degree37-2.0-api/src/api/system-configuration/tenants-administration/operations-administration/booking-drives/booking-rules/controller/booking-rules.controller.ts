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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { BookingRulesDto } from '../dto/booking-rules.dto';
import { BookingRulesService } from '../services/booking-rules.service';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Booking Rules')
@Controller('booking-drive/booking-rule')
export class BookingRulesController {
  constructor(private readonly bookingRulesService: BookingRulesService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_BOOKING_RULE_WRITE
  )
  create(@Body() createBookingRulesDto: BookingRulesDto) {
    return this.bookingRulesService.create(createBookingRulesDto);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: false })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_BOOKING_RULE_WRITE,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_BOOKING_DRIVES_BOOKING_RULE_READ
  // )
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: any) {
    return this.bookingRulesService.findOne(id);
  }
}
