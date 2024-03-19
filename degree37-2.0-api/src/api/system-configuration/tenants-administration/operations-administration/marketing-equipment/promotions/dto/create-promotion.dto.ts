import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

export class CreatePromotionDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Short Name is required' })
  @IsString({ message: 'Short Name must be a string' })
  @ApiProperty()
  short_name: string;

  @IsString({ message: 'Description must be a string' })
  @ApiProperty()
  description: string;

  @IsString({ message: 'Donor Message must be a string' })
  @ApiProperty()
  donor_message: string;

  @IsNotEmpty({ message: 'Collection Operations should not be empty' })
  @IsArray({ message: 'Collection Operations must be an integer array' })
  @ApiProperty()
  collection_operations: Array<bigint>;

  @IsString()
  @IsNotEmpty({ message: 'Start date should not be empty' })
  @ApiProperty()
  start_date: string;

  @IsString()
  @IsNotEmpty({ message: 'End date should not be empty' })
  @ApiProperty()
  end_date: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an boolean' })
  @ApiProperty({ default: true })
  status: boolean;

  @IsInt({ message: 'Created by must be an integer number' })
  @IsOptional()
  created_by: bigint;

  @IsOptional()
  @IsBoolean({ message: 'Is Archived must be an boolean' })
  @ApiProperty({ default: false })
  is_archived: boolean;
}

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Short Name is required' })
  @IsString({ message: 'Short Name must be a string' })
  @ApiProperty()
  short_name: string;

  @IsString({ message: 'Description must be a string' })
  @ApiProperty()
  description: string;

  @IsString({ message: 'Donor Message must be a string' })
  @ApiProperty()
  donor_message: string;

  @IsString()
  @IsNotEmpty({ message: 'Start date should not be empty' })
  @ApiProperty()
  start_date: string;

  @IsString()
  @IsNotEmpty({ message: 'End date should not be empty' })
  @ApiProperty()
  end_date: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an integer number' })
  @ApiProperty({ default: true })
  status: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Is Archived must be an  boolean' })
  @ApiProperty({ default: false })
  is_archived: boolean;
}
