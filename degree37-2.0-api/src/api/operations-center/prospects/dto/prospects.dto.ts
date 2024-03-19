import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProspectDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsArray()
  @ApiProperty()
  blueprints_ids: bigint[];

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  message: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  schedule_date: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  template_id: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  status: boolean;
}

export class ListProspectsDto {
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
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  getByIds?: bigint[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: [
      'name',
      'description',
      'status',
      'operations_status_id',
      'organization_level_id',
      'product_id',
      'procedure_id',
    ],
  })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}
