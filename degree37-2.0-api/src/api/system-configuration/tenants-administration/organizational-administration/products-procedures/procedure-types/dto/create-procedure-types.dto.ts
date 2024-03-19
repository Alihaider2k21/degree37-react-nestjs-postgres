import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProcedureTypesProductsInterface } from '../interface/procedure-types.interface';

export class CreateProcedureTypesDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Procedure name is required' })
  @IsString({ message: 'Procedure name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Short description is required' })
  @IsString({ message: 'Short description must be a string' })
  short_description: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'is_goal_type must be a boolean value' })
  is_goal_type: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Procedure duration is required' })
  procedure_duration: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is generate online appointments is required' })
  @IsBoolean({
    message: 'is_generate_online_appointments must be a boolean value',
  })
  is_generate_online_appointments: boolean;

  @ApiProperty({ type: () => [ProcedureTypesProductsInterface] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcedureTypesProductsInterface)
  procedure_types_products: ProcedureTypesProductsInterface[];

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;
}

export class UpdateProcedureTypesDto extends PartialType(
  CreateProcedureTypesDto
) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Procedure name is required' })
  @IsString({ message: 'Procedure name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Short description is required' })
  @IsString({ message: 'Short description must be a string' })
  short_description: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'is_goal_type must be a boolean value' })
  is_goal_type: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Procedure duration is required' })
  procedure_duration: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is generate online appointments is required' })
  @IsBoolean({
    message: 'is_generate_online_appointments must be a boolean value',
  })
  is_generate_online_appointments: boolean;

  @ApiProperty({ type: () => [ProcedureTypesProductsInterface] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcedureTypesProductsInterface)
  procedure_types_products: ProcedureTypesProductsInterface[];

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  updated_by: bigint;
}
