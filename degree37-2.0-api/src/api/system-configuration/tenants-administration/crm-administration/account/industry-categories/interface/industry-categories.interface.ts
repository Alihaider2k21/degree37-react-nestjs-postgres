import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllIndustryCategoriesInterface {
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
  fetchAll: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  subCategories: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  categories: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  parent_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortBy?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['name', 'is_active'] })
  sortName?: string = '';
}
