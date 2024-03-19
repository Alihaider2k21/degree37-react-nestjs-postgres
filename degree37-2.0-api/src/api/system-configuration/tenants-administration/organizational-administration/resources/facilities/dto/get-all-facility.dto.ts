import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class GetAllFacilityDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  is_archived?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;
}
