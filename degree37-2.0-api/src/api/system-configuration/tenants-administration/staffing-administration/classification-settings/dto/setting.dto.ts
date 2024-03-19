import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClassificationSettingDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Classification id is required' })
  @IsInt({ message: 'Classification id must be an integer' })
  classification_id: bigint;

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

  @ApiProperty()
  @IsNotEmpty({ message: 'Min hours per week is required' })
  @IsInt({ message: 'Min hours per week must be an integer' })
  min_hours_per_week: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Target hours per week is required' })
  @IsInt({ message: 'Target hours per week must be an integer' })
  target_hours_per_week: number;

  @IsOptional()
  @ApiHideProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class GetAllClassificationSettingDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  status?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['classification_id'] })
  sortBy?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;
}

export class SearchClassificationSettingDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  keyword?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;
}

export class UpdateClassificationSettingsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Classification id is required' })
  @IsInt({ message: 'Classification id must be an integer' })
  classification_id: bigint;

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

  @ApiProperty()
  @IsNotEmpty({ message: 'Min hours per week is required' })
  @IsInt({ message: 'Min hours per week must be an integer' })
  min_hours_per_week: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Target hours per week is required' })
  @IsInt({ message: 'Target hours per week must be an integer' })
  target_hours_per_week: number;

  @IsOptional()
  @ApiHideProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
