import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ShiftSlotsDto {
  @IsNotEmpty({ message: 'Start time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  start_time: Date;

  @IsNotEmpty({ message: 'Start time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  end_time: Date;
}

export class ShiftProjectionsDto {
  @IsNotEmpty({ message: 'Procedure Type is required' })
  @IsInt({ message: 'Procedure Type must be an integer number' })
  @ApiProperty()
  procedure_type_id: bigint;

  @IsNotEmpty({ message: 'Procedure Type Quantity is required' })
  @IsInt({ message: 'Procedure Type Quantity must be an integer number' })
  @ApiProperty()
  procedure_type_qty: number;

  @IsNotEmpty({ message: 'Product Yield is required' })
  @IsInt({ message: 'Product Yield must be an integer number' })
  @ApiProperty()
  product_yield: number;

  @ApiProperty({
    type: Array<bigint>,
    example: [1, 2],
  })
  @IsArray()
  staff_setups: Array<bigint>;
}

export class ShiftsDto {
  @IsNotEmpty({ message: 'Shift Start time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Shift Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  start_time: Date;

  @IsNotEmpty({ message: 'Shift End time should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Shift End time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  end_time: Date;

  @IsNotEmpty({ message: 'Break Start time should not be empty' })
  // @Transform(({ value }) => {
  //   if (typeof value === 'string' ) {
  //     return new Date(value);
  //   }
  //   return value;
  // })
  // @IsDate({ message: 'Break Start time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  break_start_time: string;

  @IsNotEmpty({ message: 'Break End time should not be empty' })
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     return new Date(value);
  //   }
  //   return value;
  // })
  // @IsDate({ message: 'Break End time must be a valid date and time' })
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-08-01 14:16:39.830431',
  })
  break_end_time: string;

  @IsNotEmpty({ message: 'OEF Products value is required' })
  // @IsInt({ message: 'OEF Products must be an integer number' })
  @ApiProperty()
  oef_products: number;

  @IsNotEmpty({ message: 'OEF Procedures value is required' })
  // @IsInt({ message: 'OEF Products must be an integer number' })
  @ApiProperty()
  oef_procedures: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  reduce_slots: boolean;

  @IsNotEmpty({ message: 'Reduction Percentage is required' })
  @IsInt({ message: 'Reduction Percentage must be an integer number' })
  @ApiProperty()
  reduction_percentage: number;

  @ApiProperty({ type: [ShiftProjectionsDto] })
  @IsArray()
  projections: ShiftProjectionsDto[];

  @ApiProperty({
    type: Array<bigint>,
    example: [1, 2],
    required: false,
  })
  @IsOptional()
  @IsArray()
  vehicles: Array<bigint>;

  @ApiProperty({
    type: Array<bigint>,
    example: [1, 2],
  })
  @IsArray()
  devices: Array<bigint>;

  @IsOptional()
  @IsInt()
  created_by: any;

  @IsOptional()
  @IsInt()
  tenant_id: bigint;
}
