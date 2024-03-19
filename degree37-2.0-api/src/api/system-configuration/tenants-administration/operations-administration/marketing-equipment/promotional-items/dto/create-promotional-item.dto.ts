import {
  IsNotEmpty,
  IsInt,
  ArrayNotEmpty,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class CreatePromotionalItemDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Promotional Item name is required' })
  @IsString({ message: 'Promotional Item name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Promotional Item short name is required' })
  @IsString({ message: 'Promotional Item short name must be a string' })
  short_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Promotional Item Promotion is required' })
  promotion_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Promotional Item description is required' })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  retire_on: Date;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an integer number' })
  @ApiProperty({ default: true })
  status: boolean;

  @IsInt({ message: 'Created by must be an integer number' })
  @IsOptional()
  created_by: bigint;

  @IsNotEmpty({ message: 'Tenant Id should not be empty' })
  @IsInt({ message: 'Tenant Id must be an integer number' })
  @IsOptional()
  tenant_id: bigint;

  @IsNotEmpty({ message: 'Collection Operations should not be empty' })
  @IsArray({ message: 'Collection Operations must be an integer array' })
  @ApiProperty()
  collection_operations: Array<bigint>;
}
