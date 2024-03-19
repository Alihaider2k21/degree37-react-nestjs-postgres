import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationAndSortDto } from '../../../../../../common/dto/pagination';
import { Type } from 'class-transformer';

export class QueryCertificationDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Active must be a boolean' })
  @IsOptional()
  is_active: boolean;
}
