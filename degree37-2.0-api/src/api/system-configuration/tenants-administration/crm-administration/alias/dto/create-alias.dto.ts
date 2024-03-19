import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export enum TypeEnum {
  account = 'ACCOUNTS',
  contacts = 'CONTACTS',
  loactions = 'LOCATION',
}

export class CreateAliasDto {
  @IsString()
  @IsNotEmpty({ message: 'Alias is required' })
  @ApiProperty()
  text: string;

  @IsString()
  @IsNotEmpty({ message: 'Type is required' })
  @ApiProperty()
  type: TypeEnum;

  @ApiProperty({ type: () => 'bigint' })
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
