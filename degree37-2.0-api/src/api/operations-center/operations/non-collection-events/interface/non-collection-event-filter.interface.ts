import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class NonCollectionEventInterface {
  @IsOptional()
  @ApiProperty({
    type: Date,
    description: 'Non Collection Event Date',
    required: false,
  })
  date?: Date;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Locations Id',
    required: false,
  })
  location_id?: bigint;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'NCE SubCategory Id',
    required: false,
  })
  event_category_id?: bigint;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'NCE Category  Id',
    required: false,
  })
  event_subcategory_id?: bigint;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizational_levels?: string;

  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  status: string;

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

  @IsOptional()
  @IsInt()
  collection_operation_id: bigint;

  @IsOptional()
  @IsInt()
  status_id: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  exportType?: string;
}
