import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
  registerDecorator,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

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
export class CreateTenantRolePermissionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Description name must be a string' })
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Recruiter is Optional' })
  is_recruiter: boolean;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty({ message: 'Permissions array must not be empty' })
  // @IsIntegerArray({ message: 'Each permission must be an integer' })
  permissions: string[];

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class CreateRolePermissionDto {
  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be a string' })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Description name must be a string' })
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty({ message: 'Permissions array must not be empty' })
  // @IsIntegerArray({ message: 'Each permission must be an integer' })
  permissions: string[];

  @ApiHideProperty()
  forbidUnknownValues: true;
}
