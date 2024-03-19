import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';
import { ShiftSlotsDto, ShiftsDto } from 'src/api/shifts/dto/shifts.dto';
import { Facility } from '../../entity/facility.entity';
import { Transform } from 'class-transformer';

export class WeekdaysDto {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export class CreateBluePrintDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'donorcenter_id is required' })
  @ApiProperty()
  donorcenter_id: bigint;

  @ApiProperty({
    type: WeekdaysDto,
    example: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  })
  weekdays: WeekdaysDto;

  @ApiProperty({
    type: [ShiftsDto],
  })
  @IsArray()
  shifts: ShiftsDto[];

  @IsNotEmpty({ message: 'OEF Products value is required' })
  // @IsInt({ message: 'OEF Products must be an integer number' })
  @ApiProperty()
  oef_products: number;

  @IsNotEmpty({ message: 'OEF Procedures value is required' })
  // @IsInt({ message: 'OEF Products must be an integer number' })
  @ApiProperty()
  oef_procedures: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: () => Boolean, default: false })
  is_default: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: () => Boolean, default: true })
  is_active: boolean;

  @IsOptional()
  @ApiHideProperty()
  created_by: any;

  @IsOptional()
  @ApiHideProperty()
  tenant_id: any;

  @ApiProperty({
    type: [ShiftSlotsDto],
  })
  @IsArray()
  slots: ShiftSlotsDto[];
}

export class ShiftSlotsDataDto {
  @IsNotEmpty({ message: 'Start time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  start_time: Date;

  @IsNotEmpty({ message: 'Start time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  end_time: Date;

  @IsNotEmpty({ message: 'Procedure Type is required' })
  @ApiProperty()
  procedure_type_id: bigint;

  @IsNotEmpty({ message: 'Shift id is required' })
  @ApiProperty()
  shift_id: bigint;
}

export class AddShiftSlotDTO {
  @ApiProperty({
    type: [ShiftSlotsDataDto],
  })
  @IsArray()
  slots: ShiftSlotsDataDto[];
}

export class UpdateShiftsProjectionStaff {
  @ApiProperty()
  @IsBoolean({ message: 'is_donor_portal_enabled must be a boolean value' })
  is_donor_portal_enabled: boolean;

  @IsNotEmpty({ message: 'Procedure Type is required' })
  @ApiProperty()
  procedure_type_id: bigint;

  @ApiProperty({ type: [Number], required: false })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  shift_ids: number[];
}

export class GetShiftIds {
  @IsNotEmpty({ message: 'Procedure Type is required' })
  @ApiProperty()
  procedure_type_id: bigint;

  @ApiProperty({ type: [Number], required: false })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  shift_ids: number[];
}

export class GetDonorAppointmentOfDrive {
  @IsNotEmpty({ message: 'Procedure Type id is required' })
  @ApiProperty()
  procedure_type_id: bigint;

  @IsNotEmpty({ message: 'Slot Id is required' })
  @ApiProperty()
  slot_id: bigint;
}
