import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetAllCRMVolunteerActivityLogInterface {
  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  fetchAll?: string;

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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  sortOrder?: string;
}
