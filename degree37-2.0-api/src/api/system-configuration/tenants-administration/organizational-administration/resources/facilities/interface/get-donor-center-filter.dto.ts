import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
export class GetAllDonorCenterFilterDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  keyword: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  org_level_id: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  state: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizational_levels?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  collection_operation: string;

  @IsOptional()
  @IsBoolean({ message: 'Staging site must be a boolean value' })
  staging_site: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  is_active: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Donor center must be a boolean value' })
  is_donor_center?: boolean;

  @IsOptional()
  fetch_all: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;
}
