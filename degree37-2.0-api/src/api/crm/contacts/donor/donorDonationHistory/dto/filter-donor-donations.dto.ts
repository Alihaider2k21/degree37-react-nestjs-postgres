import {
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  IsArray,
} from 'class-validator';
import { PaginationAndSortDto } from 'src/common/dto/pagination';

export class FilterDonorDonationsDto extends PaginationAndSortDto {
  @IsInt()
  donor_id: number;

  @IsOptional()
  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hospital: string[];

  @IsOptional()
  @IsInt()
  status: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  procedure_type: string[];
}
