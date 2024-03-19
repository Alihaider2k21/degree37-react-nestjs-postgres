import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class VehicleMaintenanceDto {
  @IsString()
  @IsNotEmpty({ message: 'Start date/time should not be empty' })
  @ApiProperty()
  start_date_time: Date;

  @IsString()
  @IsNotEmpty({ message: 'End date/time should not be empty' })
  @ApiProperty()
  end_date_time: Date;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'Prevent booking must be a boolean value' })
  prevent_booking: boolean;

  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
