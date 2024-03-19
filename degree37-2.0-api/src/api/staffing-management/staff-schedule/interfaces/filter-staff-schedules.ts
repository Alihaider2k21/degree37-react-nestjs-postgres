import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination';

export class FilterStaffSchedulesInterface extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  staff_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  team_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation_id?: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  schedule_start_date?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  donor_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  schedule_status_id?: number;
}
