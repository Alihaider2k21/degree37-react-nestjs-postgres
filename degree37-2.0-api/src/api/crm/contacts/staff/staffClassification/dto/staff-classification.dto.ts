import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StaffClassificationDto {
  @ApiProperty()
  @IsInt({ message: 'Staffing classification id  must be an integer' })
  @IsNotEmpty({ message: 'Staffing classification id is required' })
  staffing_classification_id: number;

  @ApiProperty()
  @IsInt({ message: 'Target hours per week  must be an integer' })
  @IsNotEmpty({ message: 'Target hours per week is required' })
  @Min(0, { message: 'Minimum value for target hours per week is 0' })
  @Max(168, { message: 'Maximum value for target hours per week is 168' })
  target_hours_per_week: number;

  @ApiProperty()
  @IsInt({ message: 'Minimum hours per week  must be an integer' })
  @IsNotEmpty({ message: 'Minimum hours per week is required' })
  @Min(0, { message: 'Minimum value for minimum hours per week is 0' })
  @Max(168, { message: 'Maximum value for minimum hours per week is 186' })
  minimum_hours_per_week: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum hours per week  must be an integer' })
  @IsNotEmpty({ message: 'Maximum hours per week is required' })
  @Min(0, { message: 'Minimum value for maximum hours per week is 0' })
  @Max(168, { message: 'Maximum value for maximum hours per week is 168' })
  maximum_hours_per_week: number;

  @ApiProperty()
  @IsInt({ message: 'Minimum days per week  must be an integer' })
  @IsNotEmpty({ message: 'Minimum days per_week is required' })
  @Min(0, { message: 'Minimum value for minimum days per week is 0' })
  @Max(7, { message: 'Maximum value for minimum days per week is 7' })
  minimum_days_per_week: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum days per week  must be an integer' })
  @IsNotEmpty({ message: 'Maximum days per week is required' })
  @Min(0, { message: 'Minimum value for maximum days per week is 0' })
  @Max(7, { message: 'Maximum value for maximum days per week is 7' })
  maximum_days_per_week: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum consecutive days per week  must be an integer' })
  @IsNotEmpty({ message: 'Maximum consecutive days per week is required' })
  @Min(0, {
    message: 'Minimum value for maximum consecutive days per week is 0',
  })
  @Max(7, {
    message: 'Maximum value for maximum consecutive days per_week is 7',
  })
  maximum_consecutive_days_per_week: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum ot per week  must be an integer' })
  @IsNotEmpty({ message: 'Maximum ot per week is required' })
  @Min(0, { message: 'Minimum value for maximum ot per_week is 0' })
  @Max(168, { message: 'Maximum value for maximum ot per week is 168' })
  maximum_ot_per_week: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum weekend hours  must be an integer' })
  @IsNotEmpty({ message: 'Maximum weekend hours is required' })
  @Min(0, { message: 'Minimum value for maximum weekend hours is 0' })
  @Max(48, { message: 'Maximum value for maximum weekend hours is 48' })
  maximum_weekend_hours: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum consecutive weekends  must be an integer' })
  @IsNotEmpty({ message: 'Maximum consecutive weekends is required' })
  @Min(0, { message: 'Minimum value for maximum consecutive weekends is 0' })
  @Max(54, { message: 'Maximum value for maximum consecutive weekends is 54' })
  maximum_consecutive_weekends: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum weekends per month  must be an integer' })
  @IsNotEmpty({ message: 'Maximum weekends per month is required' })
  @Min(0, { message: 'Minimum value for maximum weekends per month is 0' })
  @Max(6, { message: 'Maximum value for maximum weekends per month is 6' })
  maximum_weekends_per_month: number;

  @ApiProperty()
  @IsInt({ message: 'Overtime_threshold  must be an integer' })
  @IsNotEmpty({ message: 'Overtime_threshold is required' })
  @Min(0, { message: 'Minimum value for overtime threshold is 0' })
  @Max(168, { message: 'Maximum value for overtime threshold is 168' })
  overtime_threshold: number;

  @ApiProperty()
  @IsInt({ message: 'Minimum recovery time  must be an integer' })
  @IsNotEmpty({ message: 'Minimum recovery time is required' })
  @Min(0, { message: 'Minimum value for minimum recovery time is 0' })
  @Max(500, { message: 'Maximum value for minimum recovery time is 500' })
  minimum_recovery_time: number;
}
