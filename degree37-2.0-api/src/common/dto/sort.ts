import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { SortOrder } from '../enums/sort';

export class SortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Sort Name must be a string' })
  @IsOptional()
  sortName: string;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder: SortOrder;
}
