import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AccountContactsDto {
  @ApiProperty()
  contacts: [
    {
      contactable_type: string;
      contactable_id: bigint;
      record_id: bigint;
      role_id: bigint;
    }
  ];

  deleteContacts: [string];

  @IsOptional()
  closeout_date: Date;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class CreateDriveAccountsDto {
  @IsNotEmpty({ message: 'Drive id is required' })
  @ApiProperty({ required: true })
  drive_id?: bigint;

  @IsNotEmpty({ message: 'Account id is required' })
  @ApiProperty({ required: true })
  account_id?: bigint;
}
