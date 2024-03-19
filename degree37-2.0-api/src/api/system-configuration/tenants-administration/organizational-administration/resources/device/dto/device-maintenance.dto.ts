import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class DeviceMaintenanceDto {
  @IsString()
  @IsNotEmpty({ message: 'Start date/time should not be empty' })
  @ApiProperty()
  start_date_time: Date;

  @IsString()
  @IsNotEmpty({ message: 'End date/time should not be empty' })
  @ApiProperty()
  end_date_time: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'Prevent booking must be a boolean value' })
  reduce_slots: boolean;

  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
