import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { typeEnum } from '../../common/type.enum';

export class CreateEquipmentDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Short Name is required' })
  @IsString({ message: 'Short Name must be a string' })
  @ApiProperty()
  short_name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @ApiProperty()
  description: string;

  @IsNotEmpty({ message: 'Collection Operations should not be empty' })
  @IsArray({ message: 'Collection Operations must be an integer array' })
  @ApiProperty()
  collection_operations: Array<bigint>;

  @IsEnum(typeEnum)
  @IsOptional()
  @ApiProperty()
  type: typeEnum;

  @IsString()
  @IsOptional()
  @ApiProperty()
  retire_on: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an integer number' })
  @ApiProperty({ default: true })
  status: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an integer number' })
  @ApiProperty({ default: false })
  is_archived: boolean;
}

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Short Name is required' })
  @IsString({ message: 'Short Name must be a string' })
  @ApiProperty()
  short_name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @ApiProperty()
  description: string;

  @IsNotEmpty({ message: 'Collection Operations should not be empty' })
  @IsArray({ message: 'Collection Operations must be an integer array' })
  @ApiProperty()
  collection_operations: Array<bigint>;

  @IsEnum(typeEnum)
  @IsOptional()
  @ApiProperty()
  type: typeEnum;

  @IsString()
  @IsOptional()
  @ApiProperty()
  retire_on: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an integer number' })
  @ApiProperty({ default: true })
  status: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an integer number' })
  @ApiProperty({ default: false })
  is_archived: boolean;
  created_by?: bigint;
}
