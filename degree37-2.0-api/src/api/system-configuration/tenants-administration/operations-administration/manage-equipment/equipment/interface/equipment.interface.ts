import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class GetAllEquipmentInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operations: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sort_order?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['name', 'description', 'is_active'] })
  sort_name?: string = '';

  @IsOptional()
  fetch_all: boolean;
}

export class GetEquipmentForDriveInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operations: bigint;
}
