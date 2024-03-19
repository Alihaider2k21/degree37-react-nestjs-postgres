import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationAndSortDto } from 'src/common/dto/pagination';

export class QueryDonorDonationsDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  keyword: string;
}
