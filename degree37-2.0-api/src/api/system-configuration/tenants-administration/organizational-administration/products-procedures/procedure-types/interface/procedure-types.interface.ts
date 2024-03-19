import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export enum enumStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export class ProcedureTypesProductsInterface {
  @IsInt()
  @IsOptional()
  procedure_type_id: bigint;

  @IsOptional()
  @IsInt({ message: 'Product must be an integer number' })
  @ApiProperty()
  product_id: bigint;

  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be an integer number' })
  @ApiProperty()
  quantity: number;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class GetProcedureTypesInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page: number | null = null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  goal_type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['name', 'is_active'] })
  sortName?: string = '';
}
