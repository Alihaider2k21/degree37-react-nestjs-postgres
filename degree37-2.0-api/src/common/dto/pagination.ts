import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { SortDto } from './sort';

export class PaginationDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be a number' })
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be a number' })
  @IsOptional()
  limit: number;
}

export class PaginationAndSortDto extends SortDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be a number' })
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be a number' })
  @IsOptional()
  limit: number;
}
