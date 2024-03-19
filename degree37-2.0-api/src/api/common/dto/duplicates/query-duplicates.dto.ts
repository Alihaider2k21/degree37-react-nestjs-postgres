import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationAndSortDto } from 'src/common/dto/pagination';

export class QueryDuplicatesDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @Type(() => Boolean)
  @IsBoolean({ message: 'Resolved should be a boolean' })
  @IsOptional()
  is_resolved?: boolean;
}
