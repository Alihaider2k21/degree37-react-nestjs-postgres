import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class VehicleRetirementDto {
  @IsString()
  @IsNotEmpty({ message: 'Retire on date should not be empty' })
  @ApiProperty()
  retire_on: string;

  @IsNotEmpty({ message: 'Replace vehicle should not be empty' })
  @IsInt({ message: 'Replace vehicle must be an integer number' })
  @ApiProperty()
  replace_vehicle_id: bigint;

  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
