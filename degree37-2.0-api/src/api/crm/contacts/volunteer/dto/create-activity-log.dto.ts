import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import {
//   ActivityTitleEnum,
//   ActivityNameEnum,
//   ActivityDateEnum,
// } from '../enums';

export class CreateCRMVolunteerActivityLog {
  @IsNotEmpty({ message: 'Activity Title is required' })
  @IsString({ message: 'Activity Title must be a string' })
  @ApiProperty()
  // @IsEnum(ActivityTitleEnum)
  // @ApiProperty({ enum: ActivityTitleEnum })
  // activity_title: ActivityTitleEnum;
  activity_title: string;

  @IsNotEmpty({ message: 'Activity Name is required' })
  @IsString({ message: 'Activity Name must be a string' })
  @ApiProperty()
  // @IsEnum(ActivityNameEnum)
  // @ApiProperty({ enum: ActivityNameEnum })
  // name: ActivityNameEnum;
  name: string;

  @IsNotEmpty({ message: 'Activity Date is required' })
  @IsString({ message: 'Activity Date must be a string' })
  @ApiProperty()
  // @IsEnum(ActivityDateEnum)
  // @ApiProperty({ enum: ActivityDateEnum })
  // date: ActivityDateEnum;
  date: string;
}
