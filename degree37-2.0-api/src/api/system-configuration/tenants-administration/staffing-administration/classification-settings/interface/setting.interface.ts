import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ClassificationSettingInterface {
  @ApiProperty()
  @IsInt({ message: 'Id must be an integer value' })
  id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Max consecutive days per week is required' })
  @IsInt({ message: 'Max consecutive days per week must be an integer' })
  max_consec_days_per_week: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Min days per week is required' })
  @IsInt({ message: 'Min days per week must be an integer' })
  min_days_per_week: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Max days per week is required' })
  @IsInt({ message: 'Max days per week must be an integer' })
  max_days_per_week: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Max hours per week is required' })
  @IsInt({ message: 'Max hours per week must be an integer' })
  max_hours_per_week: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Max weekend hours is required' })
  @IsInt({ message: 'Max weekend hours must be an integer' })
  max_weekend_hours: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Min recovery time is required' })
  @IsInt({ message: ' Min recovery time must be an integer' })
  min_recovery_time: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Max consec weekends is required' })
  @IsInt({ message: ' Max consec weekends must be an integer' })
  max_consec_weekends: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Max ot per week is required' })
  @IsInt({ message: ' Max ot per week must be an integer' })
  max_ot_per_week: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Max weekends per months is required' })
  @IsInt({ message: 'Max weekends per months must be an integer' })
  max_weekends_per_months: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Overtime threshold is required' })
  @IsInt({ message: 'Overtime threshold must be an integer' })
  overtime_threshold: number;

  @IsOptional()
  @ApiProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class SearchInterface {
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  status?: boolean;
}
