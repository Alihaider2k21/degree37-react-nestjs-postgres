import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsInt,
  IsUrl,
  Matches,
  MinLength,
  IsBoolean,
  ValidateNested,
  IsOptional,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ArrayNotEmpty,
} from 'class-validator';
import { TenantConfigInterface } from '../interface/tenant.interface';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'isIntegerArray', async: false })
export class IsIntegerArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }

    for (const item of value) {
      if (typeof item !== 'number') {
        return false;
      }
    }

    return true;
  }
}

export function IsIntegerArray(validationOptions?: any) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isIntegerArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIntegerArrayConstraint,
    });
  };
}

export class CreateTenantDto {
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

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one numeric character, and one special character',
  })
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  @ApiProperty()
  address1: string;

  @IsString({ message: 'Address2 must be a string' })
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

  @IsNotEmpty({ message: 'Donor minimum age is required' })
  @IsInt({ message: 'Donor minimum age must be a number' })
  @ApiProperty()
  allow_donor_minimum_age: number;

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

  @ApiProperty()
  coordinates: { latitude: string; longitude: string };

  @ApiProperty({ type: () => [TenantConfigInterface] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TenantConfigInterface)
  tenant_config: TenantConfigInterface[];

  @IsNotEmpty({ message: 'Applications IDs must not be empty' })
  @ArrayNotEmpty({
    message: 'Applications IDs array must not be empty',
  })
  @IsIntegerArray({
    message: 'Each Applications Id must be an integer',
  })
  @ApiProperty()
  applications: number[];

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class CreateTenantConfigDto {
  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiProperty({ type: () => [TenantConfigInterface] })
  @IsNotEmpty({ message: 'Configuration detail' })
  @ValidateNested({ each: true })
  @Type(() => TenantConfigInterface)
  configuration_detail: TenantConfigInterface[];

  @ApiHideProperty()
  forbidUnknownValues: true;
}
