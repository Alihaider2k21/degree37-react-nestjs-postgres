import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export default class UserEventDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Page name is required' })
  @IsString({ message: 'Page name must be a string' })
  page_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Activity is required' })
  @IsString({ message: 'Activity must be a string' })
  activity: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Browser must be a string' })
  browser?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'IP must be a string' })
  ip: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Status is required' })
  @IsString({ message: 'Status must be a string' })
  status: EventStatus;

  @ApiProperty()
  @IsNotEmpty({ message: 'Event type is required' })
  @IsString({ message: 'Event type must be a string' })
  eventType: EventType;

  @ApiProperty()
  @IsOptional()
  @IsDate({ message: 'Date time must be a date' })
  dateTime?: Date; // If event has occurred earlier, but we are capturing later
}

export enum EventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  USER_ACTIVITY = 'USER_ACTIVITY',
}

export enum EventStatus {
  Success = 'Success',
  Failure = 'Failure',
}
