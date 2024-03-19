import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProcedureProductsInterface {
  @IsInt()
  @IsOptional()
  procedures_id: bigint;

  @IsOptional()
  @IsInt({ message: 'Product Id must be an integer number' })
  @ApiProperty()
  product_id: bigint;

  @IsOptional()
  @IsNumber({}, { message: 'Quanity must be an integer number' })
  @ApiProperty()
  quantity: number;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class GetAllProcedureInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

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
