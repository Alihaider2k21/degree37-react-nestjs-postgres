import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DailyGoalAllocationsFiltersInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  childSortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsOptional()
  @ApiProperty({ type: [Number], required: false })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  collection_operation: number[];

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: 'Procedure type ID',
    required: false,
  })
  procedure_type?: bigint;

  @IsOptional()
  @ApiProperty({
    description: 'Selected date in the format "YYYY-MM-DD HH:mm:ss"',
    required: false,
  })
  selected_date?: string;

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
}
