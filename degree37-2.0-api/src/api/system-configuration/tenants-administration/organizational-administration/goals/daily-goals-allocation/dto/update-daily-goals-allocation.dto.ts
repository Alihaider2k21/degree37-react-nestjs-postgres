import {
  IsInt,
  IsDate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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

export class UpdateDailyGoalsAllocationDto {
  @IsInt({ message: 'Year is required.' })
  @IsNotEmpty({ message: 'Year is required.' })
  @ApiProperty({ required: false })
  month?: number;

  @IsInt({ message: 'Year is required.' })
  @IsNotEmpty({ message: 'Year is required.' })
  @ApiProperty({ required: false })
  year?: number;

  @IsOptional()
  @IsIntegerArray({
    message: 'Each Collection Operation Id must be an integer',
  })
  @ApiProperty()
  collection_operation: number[];

  @IsOptional()
  @IsInt({ message: 'Procedure type ID must be an integer number' })
  @ApiProperty()
  procedure_type_id: bigint;

  @IsOptional()
  @IsInt({ message: 'Sunday must be an integer number' })
  @ApiProperty()
  sunday: number;

  @IsOptional()
  @IsInt({ message: 'Monday must be an integer number' })
  @ApiProperty()
  monday: number;

  @IsOptional()
  @IsInt({ message: 'Tuesday must be an integer number' })
  @ApiProperty()
  tuesday: number;

  @IsOptional()
  @IsInt({ message: 'Wednesday must be an integer number' })
  @ApiProperty()
  wednesday: number;

  @IsOptional()
  @IsInt({ message: 'Thursday must be an integer number' })
  @ApiProperty()
  thursday: number;

  @IsOptional()
  @IsInt({ message: 'Friday must be an integer number' })
  @ApiProperty()
  friday: number;

  @IsOptional()
  @IsInt({ message: 'Saturday must be an integer number' })
  @ApiProperty()
  saturday: number;

  @IsOptional()
  @IsInt({ message: 'Created by must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt({ message: 'Updated by must be an integer number' })
  @ApiProperty()
  updated_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}
