import {
  IsNotEmpty,
  IsInt,
  ValidateNested,
  IsArray,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
class DailyHourDays {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  mon_earliest_depart_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  mon_latest_return_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  tue_earliest_depart_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  tue_latest_return_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  wed_earliest_depart_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  wed_latest_return_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  thu_earliest_depart_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  thu_latest_return_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fri_earliest_depart_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fri_latest_return_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sat_earliest_depart_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sat_latest_return_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sun_earliest_depart_time: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sun_latest_return_time: string;
}
export class DailyHourDto {
  @IsArray()
  @ApiProperty()
  collection_operation: string[];
  @ApiProperty()
  isScheduled: boolean;
  @ApiProperty()
  copy_collection_operations: string[];
  @ApiProperty({ type: DailyHourDays })
  @Type(() => DailyHourDays)
  @ValidateNested({ each: true })
  data: DailyHourDays;
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  effective_date: Date;
  @ApiProperty()
  end_date: Date;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;
  is_current: boolean;
}

export class UpdateDailyHourDto extends PartialType(DailyHourDto) {
  @ApiProperty()
  updated_by: bigint;
}
