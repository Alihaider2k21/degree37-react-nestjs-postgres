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

export class UpdateMarketingMaterialDto {
  @IsOptional()
  @ApiProperty()
  @IsString({ message: 'Marketing Material name must be a string' })
  name: string;

  @IsOptional()
  @ApiProperty()
  @IsString({ message: 'Marketing Material short name must be a string' })
  short_name: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsIntegerArray({
    message: 'Each Collection Operation Id must be an integer',
  })
  @ApiProperty()
  collection_operation: number[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    format: 'date',
    example: '26-03-2023',
  })
  retire_on: Date;

  @IsOptional()
  @ApiProperty({ default: true })
  status: boolean;

  @IsInt({ message: 'Created by must be an integer number' })
  @IsOptional()
  @ApiProperty()
  created_by: bigint;
}
