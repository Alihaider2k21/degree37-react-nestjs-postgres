import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationAndSortDto } from 'src/common/dto/pagination';

export class QuerySessionHistoryKPIDto {
  @ApiProperty({ default: 'true' })
  kind: string;
}

export class QuerySessionHistoryDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  status?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  kind?: string;
}
