import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsDecimal,
  MaxLength,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateContactsRoleDto {
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

  @IsNotEmpty({ message: 'staffable is required' })
  @IsBoolean()
  @ApiProperty()
  staffable: boolean;

  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class ArchiveDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  updated_by: bigint;

  @ApiProperty()
  @IsBoolean()
  is_archived: boolean;
}
