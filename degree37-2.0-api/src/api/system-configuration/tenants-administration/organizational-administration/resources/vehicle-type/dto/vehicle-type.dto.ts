import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class VehicleTypeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Vehicle name is required' })
  @IsString({ message: 'Vehicle name must be a string' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty({ type: () => BigInt })
  location_type_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Linkable is required' })
  @IsBoolean({ message: 'linkable must be a boolean value' })
  linkable: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Collection vehicle is required' })
  @IsBoolean({ message: 'ollection_vehicle must be a boolean value' })
  collection_vehicle: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  updated_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
