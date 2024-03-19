import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffLeaveType } from '../enum/staff-leave-type.enum';
import { PaginationAndSortDto } from '../../../../../../common/dto/pagination';

export class QueryStaffLeaveDto extends PaginationAndSortDto {
  @ApiPropertyOptional()
  @IsString({ message: 'Keyword must be a string' })
  @IsOptional()
  keyword?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Staff is required' })
  staff_id: bigint;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  begin_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @ApiPropertyOptional({ enum: StaffLeaveType })
  @IsOptional()
  @IsEnum(StaffLeaveType)
  type?: StaffLeaveType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  period?: string;
}
