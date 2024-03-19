import { ApiProperty } from '@nestjs/swagger';

export default class ReportDto {
  @ApiProperty()
  page_name: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  browser: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  date_time: Date;

  public constructor(init?: Partial<ReportDto>) {
    Object.assign(this, init);
  }
}

export enum ReportType {
  LOGIN = 'LOGIN',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  USER_ACTIVITY = 'USER_ACTIVITY',
}
