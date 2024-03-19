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
import { ApprovalStatusEnum } from '../enums';
import { customFiledsDto } from '../../drives/dto/create-drive.dto';

export class CreateNCEDto {
  @IsNotEmpty({ message: 'Date is required' })
  @IsString({ message: 'Date must be a Date' })
  @ApiProperty()
  date: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Owner should not be empty' })
  @IsInt({ message: 'Owner must be an integer number' })
  owner_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Event name is required' })
  @IsString({ message: 'Event name must be a string' })
  event_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Location id should not be empty' })
  @IsInt({ message: 'Event Location id must be an integer number' })
  location_id: bigint;

  @IsBoolean({ message: 'Is archived must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: [true, false], default: true })
  is_archived: boolean;

  @ApiProperty()
  shifts: CreateShiftsDto[];

  @ApiProperty()
  approval_status: ApprovalStatusEnum;

  @ApiProperty()
  @IsNotEmpty({ message: 'non_collection_profile_id should not be empty' })
  @IsInt({ message: 'non_collection_profile_id must be an integer number' })
  non_collection_profile_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'event_category_id should not be empty' })
  @IsInt({ message: 'event_category_id must be an integer number' })
  event_category_id: bigint;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'event_subcategory_id must be an integer number' })
  event_subcategory_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'collection_operation_id should not be empty' })
  @IsInt({ message: 'collection_operation_id must be an integer number' })
  collection_operation_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'status_id should not be empty' })
  @IsInt({ message: 'status_id must be an integer number' })
  status_id: bigint;

  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  custom_fields: customFiledsDto;
}

class RoleDto {
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

export class CreateShiftsDto {
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
    type: Array<any>,
    example: [1, 2],
  })
  @IsArray()
  vehicles_ids: Array<any>;

  @ApiProperty({
    type: Array<any>,
    example: [1, 2],
  })
  @IsArray()
  devices_ids: Array<any>;

  @ApiProperty({
    type: [RoleDto],
    example: [
      { role_id: 1, qty: 4 },
      { role_id: 2, qty: 6 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  shift_roles: RoleDto[];

  @IsOptional()
  @IsInt()
  created_by: any;

  @IsOptional()
  @IsInt()
  tenant_id: any;
}
