import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationAndSortDto } from '../../../../../../common/dto/pagination';
import { Type } from 'class-transformer';

export class QueryNotCertifiedStaffDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Status must be a boolean' })
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  certification_id?: bigint;
}
