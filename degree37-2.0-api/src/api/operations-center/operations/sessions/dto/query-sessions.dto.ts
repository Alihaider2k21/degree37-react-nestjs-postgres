import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationAndSortDto } from 'src/common/dto/pagination';

export class QuerySessionsDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  min_projection?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  max_projection?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Promotion must be a string' })
  @IsOptional()
  promotion_id?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Promotion must be a string' })
  @IsOptional()
  status_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizational_levels?: string;
}
