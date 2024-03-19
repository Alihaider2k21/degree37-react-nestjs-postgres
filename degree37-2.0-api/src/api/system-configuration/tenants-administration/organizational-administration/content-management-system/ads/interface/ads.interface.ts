import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum FlagEnum {
  Activate = 'activate',
  Deactivate = 'deactivate',
}
export class AdsSearchInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  image_name?: string;

  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true, false'] })
  is_active: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  ad_type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['image_name', 'ad_type', 'is_active'],
  })
  sortBy?: string = '';
}

export class AdsHistoryInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  id?: number;
}
export class AdsStatusInterface {
  @IsNotEmpty()
  id: bigint;

  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'Is active must be a boolean value' })
  is_active: boolean;
}
