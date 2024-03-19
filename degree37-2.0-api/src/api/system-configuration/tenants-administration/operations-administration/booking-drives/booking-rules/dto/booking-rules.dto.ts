import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsDate,
  isArray,
  IsArray,
  MinDate,
  IsDateString,
  IsDecimal,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class BookingRulesDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  id: bigint;

  @ApiProperty({ type: () => [ThirdRailFieldsDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ThirdRailFieldsDto)
  third_rail_fields: ThirdRailFieldsDto[];

  @ApiProperty({ type: () => [CurrentLockLeadTimeDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CurrentLockLeadTimeDto)
  CurrentLockLeadTimeDto: CurrentLockLeadTimeDto[];

  @ApiProperty({ type: () => [ScheduleLockLeadTimeDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ScheduleLockLeadTimeDto)
  ScheduleLockLeadTimeDto: ScheduleLockLeadTimeDto[];

  @ApiProperty({ type: () => [MaximumDrawHoursDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MaximumDrawHoursDto)
  MaximumDrawHoursDto: MaximumDrawHoursDto[];

  @ApiProperty({ type: () => [OefBlockOnDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OefBlockOnDto)
  OefBlockOnDto: OefBlockOnDto[];

  @ApiProperty({ type: () => [LocationQualificationDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LocationQualificationDto)
  LocationQualificationDto: LocationQualificationDto[];

  @ApiProperty()
  @IsNotEmpty({ message: 'sharing_max_miles is required' })
  @IsInt({ message: 'sharing_max_miles must be a number' })
  sharing_max_miles: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class ThirdRailFieldsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'date must be a boolean value' })
  date: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'hours must be a boolean value' })
  hours: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'staffing_setup must be a boolean value' })
  staffing_setup: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'projection must be a boolean value' })
  projection: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'location must be a boolean value' })
  location: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'status must be a boolean value' })
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  add_field_id_list: bigint[];
}

export class CurrentLockLeadTimeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'lead_time is required' })
  @IsInt({ message: 'lead_time must be a number' })
  lead_time: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'effective_date  is required' })
  @IsDateString()
  effective_date: Date;
}

export class ScheduleLockLeadTimeDto {
  @ApiProperty()
  lead_time: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'effective_date  is required' })
  @IsDateString()
  effective_date: Date;
}

export class MaximumDrawHoursDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'hours is required' })
  @IsDecimal()
  hours: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'allow_appointment  is required' })
  @IsBoolean({ message: 'allow_appointment must be a boolean value' })
  allow_appointment: boolean;
}

export class OefBlockOnDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'product  is required' })
  @IsBoolean({ message: 'product must be a boolean value' })
  product: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'procedures  is required' })
  @IsBoolean({ message: 'procedures must be a boolean value' })
  procedures: boolean;
}

export class LocationQualificationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'drive_scheduling  is required' })
  @IsBoolean({ message: 'drive_scheduling must be a boolean value' })
  drive_scheduling: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'expires  is required' })
  @IsBoolean({ message: 'expires must be a boolean value' })
  expires: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'expiration_period is required' })
  @IsInt({ message: 'expiration_period must be a number' })
  expiration_period: number;
}

export class AduitRailAddfieldDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Audit Rail name is required' })
  @IsString({ message: 'Audit Rail name must be a string' })
  name: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;
}
