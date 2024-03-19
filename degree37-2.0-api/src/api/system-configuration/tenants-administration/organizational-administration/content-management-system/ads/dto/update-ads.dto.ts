import { PartialType } from '@nestjs/mapped-types';
import { CreateAdsDto } from './create-ads.dto';
import {
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUrl,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { enumStatus, enumType } from '../enum/ads.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdsDto extends PartialType(CreateAdsDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  id: bigint;

  @IsNotEmpty()
  @ApiProperty()
  image_name: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  image_url: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  redirect_url: string;

  @IsOptional()
  @ApiProperty()
  display_order: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'Is active must be a boolean value' })
  is_active: boolean;

  @IsEnum(enumType)
  @IsNotEmpty()
  @ApiProperty()
  ad_type: enumType;

  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  details: string;

  @IsNotEmpty()
  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  updated_by: bigint;
}
