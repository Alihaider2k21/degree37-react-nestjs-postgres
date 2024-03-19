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

export class UpdatePromotionalItemDto {
  @IsOptional()
  @ApiProperty()
  @IsString({ message: 'Promotional Item name must be a string' })
  name: string;

  @IsOptional()
  @ApiProperty()
  @IsString({ message: 'Promotional Item short name must be a string' })
  short_name: string;

  @IsOptional()
  @ApiProperty()
  promotion_id: bigint;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsIntegerArray({
    message: 'Each Collection Operation Id must be an integer',
  })
  @ApiProperty()
  collection_operation: bigint[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  retire_on: Date;

  @IsOptional()
  @ApiProperty({ default: true })
  status: boolean;

  @IsInt({ message: 'Created by must be an integer number' })
  @IsOptional()
  created_by: bigint;
}
