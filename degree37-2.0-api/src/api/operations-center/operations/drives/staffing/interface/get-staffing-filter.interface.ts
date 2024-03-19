import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ShiftableTypeEnum } from '../../../staffing_enum/staffing_enum';

export class GetAllStaffingFilterInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  keyword: string;

  @IsOptional()
  fetch_all: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  childSortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';

  @IsEnum(ShiftableTypeEnum)
  @ApiProperty({ required: true })
  shiftable_type: ShiftableTypeEnum;
}
