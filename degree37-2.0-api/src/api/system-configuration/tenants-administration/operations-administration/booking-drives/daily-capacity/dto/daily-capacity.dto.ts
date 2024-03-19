import {
  IsNotEmpty,
  IsString,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
class DailyCapacityDays {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  mon_max_drives: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  mon_max_staff: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  tue_max_drives: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  tue_max_staff: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  wed_max_drives: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  wed_max_staff: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  thur_max_drives: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  thur_max_staff: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  fri_max_drives: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  fri_max_staff: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  sat_max_drives: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  sat_max_staff: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  sun_max_drives: number;
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  sun_max_staff: number;
}
export class DailyCapacityDto {
  @IsArray()
  @ApiProperty()
  collection_operation: string[];
  @ApiProperty()
  isScheduled: boolean;
  @ApiProperty()
  copy_collection_operations: string[];
  @ApiProperty({ type: DailyCapacityDays })
  @Type(() => DailyCapacityDays)
  @ValidateNested({ each: true })
  data: DailyCapacityDays;
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

export class UpdateDailyCapacityDto extends PartialType(DailyCapacityDto) {
  @ApiProperty()
  updated_by: bigint;
}
