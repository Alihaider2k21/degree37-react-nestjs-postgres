import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AccountPreferencesDto {
  @ApiProperty()
  allStaff: [
    {
      staff_id: bigint;
      preference: number;
    }
  ];

  deleteStaff: [string];

  @ApiHideProperty()
  forbidUnknownValues: true;
}
