import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  IsInt,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First Name is required' })
  @ApiProperty()
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'Invalid First Name. Only alphabets are allowed.',
  })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last Name is required' })
  @ApiProperty()
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'Invalid Last Name. Only alphabets are allowed.',
  })
  last_name: string;

  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string;

  // @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  unique_identifier?: string;

  @IsOptional()
  @ApiProperty({ type: Date })
  date_of_birth?: Date;

  @IsOptional()
  @ApiProperty()
  gender?: string;

  @IsOptional()
  @ApiProperty()
  home_phone_number?: string;

  @IsOptional()
  @ApiProperty()
  work_phone_number?: string;

  @IsOptional()
  @ApiProperty()
  work_phone_extension?: string;

  @IsOptional()
  @ApiProperty()
  address_line_1?: string;

  @IsOptional()
  @ApiProperty()
  address_line_2?: string;

  @IsOptional()
  @ApiProperty()
  zip_code?: string;

  @IsOptional()
  @ApiProperty()
  city?: string;

  @IsOptional()
  @ApiProperty()
  is_active?: boolean;

  @IsOptional()
  @ApiProperty()
  all_hierarchy_access?: boolean;

  @IsOptional()
  @ApiProperty()
  state?: string;

  @IsOptional()
  @ApiProperty({ type: () => 'bigint' })
  role?: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant: bigint;

  @ApiProperty({ type: () => 'bigint' })
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class CreateTenantUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First Name is required' })
  @ApiProperty()
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'Invalid First Name. Only alphabets are allowed.',
  })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last Name is required' })
  @ApiProperty()
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'Invalid Last Name. Only alphabets are allowed.',
  })
  last_name: string;

  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  work_phone_number?: string;

  @IsOptional()
  @ApiProperty()
  is_active?: boolean;

  @IsOptional()
  @ApiProperty()
  role?: bigint;

  @IsOptional()
  @ApiProperty()
  mobile_number: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  is_manager: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  hierarchy_level: bigint;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  business_units: Array<bigint>;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  assigned_manager: bigint;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  override: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  adjust_appointment_slots: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  resource_sharing: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  edit_locked_fields: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  account_state: boolean;

  @ApiProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class SearchUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  search: string;
}
