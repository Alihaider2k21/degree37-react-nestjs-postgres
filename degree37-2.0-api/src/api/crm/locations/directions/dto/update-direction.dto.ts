import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class UpdateDirectionsDto {
  @IsInt({ message: 'Collection Operation must be an integer number' })
  @ApiProperty()
  collection_operation_id: bigint;

  @IsInt({ message: 'Location Id must be an integer number' })
  @ApiProperty()
  location_id: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Direction is required' })
  @ApiProperty()
  direction: string;

  @IsNotEmpty({ message: 'Miles value is required' })
  @IsNumber({}, { message: 'Miles must be an integer number' })
  @ApiProperty()
  miles: number;

  @IsNotEmpty({ message: 'Minutes value is required' })
  @IsNumber({}, { message: 'Minutes must be an integer number' })
  @ApiProperty()
  minutes: number;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
