import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class NonCollectionProfileInterface {
  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  is_active: string;

  @IsOptional()
  @ApiProperty({
    description: 'keyword',
    required: false,
  })
  keyword?: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Event Category ID',
    required: false,
  })
  event_category_id?: bigint;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Event SubCategory ID',
    required: false,
  })
  event_subcategory_id?: bigint;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizational_levels?: string;

  @ApiProperty({
    type: String,
    description: 'Collection operation IDs',
    required: false,
  })
  collection_operation_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @IsInt()
  tenant_id: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';
}
