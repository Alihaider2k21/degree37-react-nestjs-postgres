import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationAndSortDto } from '../../../../../../common/dto/pagination';
import { Type } from 'class-transformer';

export class QueryStaffCertificationDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Status must be a boolean' })
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  certification_id: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  team_id?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  co_id?: string;

  @ApiPropertyOptional({ type: 'bigint' })
  @IsOptional()
  staff_id?: bigint;
}
