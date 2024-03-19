import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * @deprecated
 */
export class GetAllCRMVolunteerInterface {
  @ApiProperty({ default: true })
  fetchAll?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  state?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_Operation?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  account?: number;

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
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenant_id?: number;
}

export class GetAllCRMVolunteerFilteredInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

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
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenant_id?: number;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  findAll?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  fetchAll?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  downloadType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  selectedOptions?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tableHeaders?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  exportType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  collection_operation?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  county?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  account?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  blood_type?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  last_donation_start?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  last_donation_end?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  group_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  center_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  assertion?: string;
}
