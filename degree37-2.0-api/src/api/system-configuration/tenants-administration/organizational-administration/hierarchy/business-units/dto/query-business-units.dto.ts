import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';

export class QueryBusinessUnitDto {
  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  parent_level_id?: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  organizational_level_id?: string;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  donor_centers?: string;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  recruiters?: string;
}
