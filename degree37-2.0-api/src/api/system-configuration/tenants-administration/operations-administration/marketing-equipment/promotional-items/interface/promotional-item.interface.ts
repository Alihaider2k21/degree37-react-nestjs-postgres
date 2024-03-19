import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllPromotionalItemInterface {
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

  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation: bigint;

  @IsString()
  @IsOptional()
  tenantId: bigint;

  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: [
      'name',
      'short_name',
      'promotion',
      'description',
      'status',
      'retire_on',
    ],
  })
  sortBy?: string = '';
}

export class GetAllPromotionalItemCOInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collectionOperationId: number;

  @IsString()
  @IsOptional()
  tenantId: bigint;
}
