import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllMarketingMaterialInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString({ message: 'Keyword must be string' })
  @IsOptional()
  @ApiProperty({ required: false })
  keyword: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collectionOperationId: string;

  @IsString()
  @IsOptional()
  tenantId: bigint;

  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['name', 'short_name', 'description', 'status', 'retire_on'],
  })
  sortBy?: string = '';
}

export class GetAllMarketingMaterialCOInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collectionOperationId: number;

  @IsString()
  @IsOptional()
  tenantId: bigint;
}
