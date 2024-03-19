import {
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { enumStatus, enumType } from '../enum/ads.enum';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateAdsDto {
  @IsNotEmpty()
  @ApiProperty()
  image_name: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  image_url: string;

  @IsNotEmpty({ message: 'Redirect URL is required' })
  @IsUrl()
  @ApiProperty()
  redirect_url: string;

  @IsNotEmpty({ message: 'Display Order is required' })
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

  @ApiHideProperty()
  forbidUnknownValues: true;
}
