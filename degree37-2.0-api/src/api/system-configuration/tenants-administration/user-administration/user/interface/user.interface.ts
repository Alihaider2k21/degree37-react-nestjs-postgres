import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsArray,
} from 'class-validator';

export class UserInterface {
  @ApiProperty()
  @IsInt()
  id: bigint;

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

  @IsString()
  @ApiProperty()
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'Unique Identifier is required' })
  @ApiProperty()
  unique_identifier: string;

  @ApiProperty()
  date_of_birth?: Date;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  home_phone_number?: string;

  @ApiProperty()
  work_phone_number?: string;

  @ApiProperty()
  work_phone_extension?: string;

  @ApiProperty()
  address_line_1?: string;

  @ApiProperty()
  address_line_2?: string;

  @ApiProperty()
  zip_code?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  state?: string;

  @ApiProperty()
  is_active?: boolean;

  @IsNotEmpty({ message: 'Role is required' })
  @ApiProperty()
  role?: bigint;

  @ApiProperty()
  created_by?: bigint;
}

export class UpdateUserInterface {
  @ApiProperty()
  @IsInt()
  id: bigint;

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

  @IsOptional()
  @ApiProperty()
  gender?: string;

  @ApiProperty()
  date_of_birth?: Date;

  @ApiProperty()
  home_phone_number?: string;

  @ApiProperty()
  work_phone_number?: string;

  @ApiProperty()
  work_phone_extension?: string;

  @ApiProperty()
  address_line_1?: string;

  @ApiProperty()
  address_line_2?: string;

  @ApiProperty()
  zip_code?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  state?: string;

  @ApiProperty()
  is_active?: boolean;

  @ApiProperty()
  all_hierarchy_access?: boolean;

  @IsNotEmpty({ message: 'Role is required' })
  @ApiProperty()
  role?: bigint;
}
export class SearchInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search: string;
}

export class GetAllUsersInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';
}

export class GetAllTenantUsersInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  tenant_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';

  @IsString({ message: 'Keyword must be string' })
  @IsOptional()
  @ApiProperty({ required: false })
  keyword: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizational_levels?: string;

  @ApiProperty({ required: false })
  fetchAll: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collectionOperationId: bigint;

  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true, false'] })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  roleId: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  assignedManager: bigint;
}

export class ResetPasswordInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  password: string;
}

export class AccountStateInterface {
  @IsOptional()
  @ApiProperty()
  @IsBoolean()
  account_state: boolean;
}

export class UpdateTenantUserInterface {
  @ApiProperty()
  @IsInt()
  id: bigint;

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

  @ApiProperty()
  email: string;

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
  hierarchy_level: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  business_units: Array<bigint>;

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

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class updateManagerDto {
  @ApiProperty()
  @IsInt()
  id: bigint;

  @IsInt()
  @ApiProperty()
  assigned_manager: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
