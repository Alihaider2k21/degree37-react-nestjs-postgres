import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StaffShiftScheduleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Monday start time is required' })
  monday_start_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Monday end time is required' })
  monday_end_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tuesday start time is required' })
  tuesday_start_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Tuesday end time is required' })
  tuesday_end_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Wednesday start time is required' })
  wednesday_start_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Wednesday end time is required' })
  wednesday_end_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Thursday start time is required' })
  thursday_start_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Thursday end time is required' })
  thursday_end_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Friday start time is required' })
  friday_start_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Friday end time is required' })
  friday_end_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Saturday start time is required' })
  saturday_start_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Saturday end time is required' })
  saturday_end_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Sunday start time is required' })
  sunday_start_time: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Sunday end time is required' })
  sunday_end_time: string;
}
