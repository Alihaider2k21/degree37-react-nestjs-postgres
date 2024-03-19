import { PartialType } from '@nestjs/mapped-types';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { UpdateTenantConfigDetailInterface } from '../interface/tenant.interface';
import {
  CreateTenantConfigDto,
  CreateTenantDto,
  IsIntegerArray,
} from './create-tenant.dto';
export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tenant name is required' })
  @IsString({ message: 'Tenant name must be a string' })
  tenant_name: string;

  @IsNotEmpty({ message: 'Tenant domain is required' })
  @IsUrl()
  @ApiProperty()
  tenant_domain: string;

  @IsNotEmpty({ message: 'Admin domain is required' })
  @IsUrl()
  @ApiProperty()
  admin_domain: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Tenant code is required' })
  @IsString({ message: 'Tenant code must be a string' })
  @ApiProperty()
  tenant_code: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\(\d{3}\)\s\d{3}-\d{4}$/, {
    message: 'Invalid phone number format. Example: (123) 456-7890',
  })
  @ApiProperty()
  phone_number: string;

  @IsNotEmpty({ message: 'Tenant timezone is required' })
  @IsString({ message: 'Tenant timezone must be a string' })
  // @MaxLength(5, {
  //   message:
  //     'Tenant timezone must not exceed 5 characters. Example: Tenant timezone short code like (AST, EST, CST)',
  // })
  @ApiProperty()
  tenant_timezone: string;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  @ApiProperty()
  address1: string;

  @IsString({ message: 'Address 2 must be a string' })
  @ApiProperty()
  address2: string;

  @IsNotEmpty({ message: 'Zip code is required' })
  @IsString({ message: 'Zip code must be a string' })
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'Invalid zip code format. Example: 12345 or 12345-6789',
  })
  @ApiProperty()
  zip_code: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'only alphabetic characters are allowed for City',
  })
  @ApiProperty()
  city: string;

  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State must be a string' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'only alphabetic characters are allowed for State',
  })
  @ApiProperty()
  state: string;

  @IsNotEmpty({ message: 'Address id is required' })
  @ApiProperty()
  address_id: bigint;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsNotEmpty()
  @ApiProperty()
  updated_by: bigint;
  // @IsNotEmpty({ message: 'Country is required' })
  // @IsString({ message: 'Country must be a string' })
  // @Matches(/^[A-Za-z\s]+$/, {
  //   message: 'only alphabetic characters are allowed for Country',
  // })
  @ApiProperty()
  country: string;

  // @IsNotEmpty({ message: 'County is required' })
  // @IsOptional({ message: 'County must be a string' })
  // @Matches(/^[A-Za-z\s]+$/, {
  //   message: 'only alphabetic characters are allowed for County',
  // })
  @ApiProperty()
  county: string;

  @IsBoolean({ message: 'Allow email must have boolean value' })
  @ApiProperty()
  allow_email: boolean;

  // @IsNotEmpty({ message: 'Latitude is required' })
  // @IsNumber({}, { message: 'Latitude must be a number' })
  // @ApiProperty()
  // latitude: number;

  // @IsNotEmpty({ message: 'Latitude is required' })
  // @IsNumber({}, { message: 'Latitude must be a number' })
  // @ApiProperty()
  // longitude: number;

  // coordinate

  @ApiProperty({ type: () => [UpdateTenantConfigDetailInterface] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateTenantConfigDetailInterface)
  tenant_config: UpdateTenantConfigDetailInterface[];

  @IsIntegerArray({
    message: 'Each Applications Id must be an integer',
  })
  @ApiProperty()
  applications: number[];

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class UpdateTenantConfigDto extends PartialType(CreateTenantConfigDto) {
  @IsBoolean({ message: 'Allow email must have boolean value' })
  @ApiProperty()
  allow_email: boolean;

  @IsOptional({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiProperty({ type: () => [UpdateTenantConfigDetailInterface] })
  @IsOptional({ message: 'Configuration detail' })
  @ValidateNested({ each: true })
  @Type(() => UpdateTenantConfigDetailInterface)
  configuration_detail: UpdateTenantConfigDetailInterface[];

  @ApiHideProperty()
  forbidUnknownValues: true;
}
