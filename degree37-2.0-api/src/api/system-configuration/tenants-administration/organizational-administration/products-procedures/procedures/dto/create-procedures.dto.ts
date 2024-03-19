import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ProcedureProductsInterface } from '../interface/procedure.interface';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProceduresDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Procedure name is required' })
  @IsString({ message: 'Procedure name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  procedure_type_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'External Reference must be a string' })
  external_reference: string;

  @ApiProperty({ type: () => [ProcedureProductsInterface] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcedureProductsInterface)
  procedure_products: ProcedureProductsInterface[];

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;

  @ApiProperty()
  @IsOptional()
  @IsInt({ message: 'Credits must be a number' })
  credits: number;
}

export class UpdateProceduresDto extends PartialType(CreateProceduresDto) {
  @ApiProperty()
  @IsNotEmpty({ message: 'Procedure name is required' })
  @IsString({ message: 'Procedure name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  procedure_type_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'External Reference must be a string' })
  external_reference: string;

  @ApiProperty({ type: () => [ProcedureProductsInterface] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProcedureProductsInterface)
  procedure_products: ProcedureProductsInterface[];

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  updated_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;

  @ApiProperty()
  @IsOptional()
  @IsInt({ message: 'Credits must be a number' })
  credits: number;
}
