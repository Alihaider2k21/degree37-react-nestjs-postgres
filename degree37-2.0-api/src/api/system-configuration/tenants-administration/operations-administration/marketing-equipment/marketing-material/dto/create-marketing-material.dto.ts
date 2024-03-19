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

export class CreateMarketingMaterialDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Marketing Material name is required' })
  @IsString({ message: 'Marketing Material name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Marketing Material short name is required' })
  @IsString({ message: 'Marketing Material short name must be a string' })
  short_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Marketing Material description is required' })
  description: string;

  @IsNotEmpty({ message: 'Collection Operation IDs must not be empty' })
  @ArrayNotEmpty({
    message: 'Collection Operation IDs array must not be empty',
  })
  @IsIntegerArray({
    message: 'Each Collection Operation Id must be an integer',
  })
  @ApiProperty()
  collection_operation: number[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    format: 'date',
    example: '26-03-2023',
  })
  retire_on: Date;

  @IsOptional()
  @IsBoolean({ message: 'Status must be an integer number' })
  @ApiProperty({ default: true })
  status: boolean;

  @IsNotEmpty({ message: 'Created by should not be empty' })
  @IsInt({ message: 'Created by must be an integer number' })
  @IsOptional()
  created_by: bigint;

  @IsNotEmpty({ message: 'Tenant Id should not be empty' })
  @IsInt({ message: 'Tenant Id must be an integer number' })
  @IsOptional()
  tenant_id: bigint;
}
