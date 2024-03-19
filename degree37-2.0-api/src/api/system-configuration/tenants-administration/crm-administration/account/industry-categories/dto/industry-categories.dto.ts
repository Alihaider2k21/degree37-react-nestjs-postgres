import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateIndustryCategoriesDto {
  @ApiProperty()
  @IsOptional()
  parent_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Industry Category name is required' })
  @IsString({ message: 'Industry Category Name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Industry Category description is required' })
  description: string;

  @IsNotEmpty({ message: 'Minimum OEF is required' })
  @IsNumber({}, { message: 'Minimum OEF must be a number' })
  @ApiProperty()
  minimum_oef: number;

  @IsNotEmpty({ message: 'Maximum OEF is required' })
  @IsNumber({}, { message: 'Maximum OEF must be a number' })
  @ApiProperty()
  maximum_oef: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;
}

export class UpdateIndustryCategoriesDto extends PartialType(
  CreateIndustryCategoriesDto
) {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  updated_by: bigint;
}
