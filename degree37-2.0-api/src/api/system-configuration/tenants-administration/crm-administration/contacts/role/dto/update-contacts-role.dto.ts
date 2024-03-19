import { PartialType } from '@nestjs/mapped-types';
import { CreateContactsRoleDto } from './create-contacts-role.dto';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsDecimal,
  MaxLength,
  IsInt,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UpdateContactsRoleDto extends PartialType(CreateContactsRoleDto) {
  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'Email is required' })
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Short Name is required' })
  @IsString({ message: 'Short Name is required' })
  @MaxLength(50)
  short_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'function id is required' })
  @IsInt()
  function_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'average hourly rate is required' })
  //   @IsDecimal({ precision: 10, scale: 2 })
  average_hourly_rate: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'OEF contribution is required' })
  //   @IsDecimal({ precision: 5, scale: 2 })
  oef_contribution: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'impacts OEF is required' })
  @IsBoolean()
  impacts_oef: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'staffable is required' })
  @IsBoolean()
  staffable: boolean;
  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  updated_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
