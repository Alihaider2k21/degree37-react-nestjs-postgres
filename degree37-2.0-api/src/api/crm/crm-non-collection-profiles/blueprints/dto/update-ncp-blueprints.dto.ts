import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsArray,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class UpdateNCPBluePrintsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Blue print name is required' })
  @IsString({ message: 'Blue print name must be a string' })
  blueprint_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Location id should not be empty' })
  @IsInt({ message: 'Event Location id must be an integer number' })
  location_id: bigint;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Alternate name must be a string' })
  additional_info: string;

  @IsBoolean({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: [true, false], default: true })
  is_active: boolean;

  @ApiProperty()
  shift_schedule: UpdateShiftsDto[];
}

class updateRoleDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsInt()
  role_id: any;

  @ApiProperty({
    type: Number,
    example: 4,
  })
  @IsInt()
  @IsPositive()
  qty: any;
}

export class UpdateShiftsDto {
  @IsNotEmpty({ message: 'Shift Start time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Shift Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  start_time: Date;

  @IsNotEmpty({ message: 'Shift End time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Shift End time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  end_time: Date;

  @IsNotEmpty({ message: 'Break Start time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Break Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  break_start_time: Date;

  @IsNotEmpty({ message: 'Break End time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Break End time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  break_end_time: Date;

  @ApiProperty({
    type: Array<bigint>,
    example: [1, 2],
  })
  @IsArray()
  vehicles_ids: Array<bigint>;

  @ApiProperty({
    type: Array<bigint>,
    example: [1, 2],
  })
  @IsArray()
  devices_ids: Array<bigint>;

  @ApiProperty({
    type: [updateRoleDto],
    example: [
      { role_id: 1, qty: 4 },
      { role_id: 2, qty: 6 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => updateRoleDto)
  shift_roles: updateRoleDto[];

  @IsOptional()
  @IsInt()
  created_by: any;

  @IsOptional()
  @IsInt()
  tenant_id: bigint;
}
