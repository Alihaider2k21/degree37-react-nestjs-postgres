import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class NotesFiltersInterface {
  @IsOptional()
  @ApiProperty({
    description: 'keyword',
    required: false,
  })
  keyword?: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Category ID',
    required: false,
  })
  category_id?: bigint;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'SubCategory ID',
    required: false,
  })
  sub_category_id?: bigint;

  @IsOptional()
  @ApiProperty({ required: false })
  is_active?: boolean;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Noteable ID',
    required: false,
  })
  noteable_id?: bigint;

  @IsOptional()
  @ApiProperty({
    description: 'Noteable Type',
    required: false,
  })
  noteable_type?: string;

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
  @ApiProperty()
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
