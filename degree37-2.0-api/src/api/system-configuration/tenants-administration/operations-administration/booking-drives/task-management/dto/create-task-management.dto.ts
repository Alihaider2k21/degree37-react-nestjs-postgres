import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { OwnerEnum, AppliesToEnum } from '../enums/enums';

export class CreateTaskManagementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  offset: number;

  @ApiProperty({ enum: OwnerEnum, enumName: 'OwnerEnum' })
  @IsEnum(OwnerEnum)
  owner: OwnerEnum;

  @ApiProperty({ enum: AppliesToEnum, enumName: 'AppliesToEnum' })
  @IsEnum(AppliesToEnum)
  applies_to: AppliesToEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  created_by: bigint;

  @IsArray()
  @ApiProperty()
  collection_operation_id: bigint[];
}
