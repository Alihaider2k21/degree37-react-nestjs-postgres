import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class VehicleDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Short Name is required' })
  @IsString({ message: 'Short name must be a string' })
  @ApiProperty()
  short_name: string;

  @IsNotEmpty({ message: 'Vehicle Type should not be empty' })
  @IsInt({ message: 'Vehicle Type must be an integer number' })
  @ApiProperty()
  vehicle_type_id: bigint;

  @IsNotEmpty({ message: 'Collection Operation should not be empty' })
  @IsInt({ message: 'Collection Operation must be an integer number' })
  @ApiProperty()
  collection_operation_id: bigint;

  @IsNotEmpty({ message: 'Certifications should not be empty' })
  @IsArray({ message: 'Certifications must be an integer array' })
  @ApiProperty()
  certifications: Array<bigint>;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
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
