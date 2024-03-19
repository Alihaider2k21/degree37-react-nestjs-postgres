import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
} from 'class-validator';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

enum ScheduleStatusEnum {
  Draft = 'Draft',
  Published = 'Published',
}

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  start_date: Date;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  end_date: Date;

  @IsArray()
  @ApiProperty()
  operation_status: bigint[];

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  collection_operation_id: bigint;

  @IsEnum(ScheduleStatusEnum)
  @ApiProperty()
  schedule_status: ScheduleStatusEnum;

  @IsBoolean()
  @ApiProperty()
  is_archived: boolean;

  @IsBoolean()
  @ApiProperty()
  is_locked: boolean;

  @IsBoolean()
  @ApiProperty()
  is_paused: boolean;

  @IsBoolean()
  @ApiProperty()
  is_flagged: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  created_by: User;
}
