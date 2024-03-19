import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetAllPromotionsInterface {
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
  keyword: string;

  @IsOptional()
  @ApiProperty()
  collection_operation: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  donor_message: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sort_order?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['name', 'description', 'is_active'] })
  sort_name?: string = '';
}

export class GetPromotionsForDriveInterface {
  @IsString({ message: 'Collection Operation must be a number' })
  @ApiProperty()
  collection_operation_id: number;

  @IsString({ message: 'Date is required' })
  @IsNotEmpty({ message: 'Date is required' })
  @ApiProperty()
  date: Date;

  @ApiPropertyOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  @Type(() => Boolean)
  @IsOptional()
  status?: boolean;
}
