import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * @deprecated
 */
export class GetAllStaffInterface {
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
}

export class GetAllStaffFilteredInterface {
  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  fetchAll?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

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
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ type: 'number', isArray: true })
  @IsOptional()
  role_ids?: string[];

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  collection_operation_id?: string;

  @ApiPropertyOptional({ type: 'number', isArray: true })
  @IsOptional()
  collection_operation_ids?: number[];

  @ApiPropertyOptional({ type: 'number', isArray: true })
  @IsOptional()
  team_ids?: string[];

  @ApiPropertyOptional({ type: 'number', isArray: true })
  @IsOptional()
  certification_ids?: number[];

  @ApiPropertyOptional({ type: 'number', isArray: true })
  @IsOptional()
  donor_center_ids?: number[];

  @ApiPropertyOptional({ type: 'number', isArray: true })
  @IsOptional()
  classification_ids?: number[];

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  status?: string;
}
