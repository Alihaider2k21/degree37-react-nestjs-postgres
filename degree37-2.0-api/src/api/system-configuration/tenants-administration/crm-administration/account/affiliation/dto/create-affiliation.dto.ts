import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDate,
  IsArray,
} from 'class-validator';

export class CreateAffiliationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsArray()
  @ApiProperty()
  collection_operation: Array<number>;

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
