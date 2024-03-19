import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessUnitDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Business unit name is required' })
  @IsString({ message: 'Business unit name must be a string' })
  name: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  parent_level_id: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: any;

  @IsInt()
  @ApiProperty()
  organizational_level_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'Is active must be a boolean value' })
  is_active: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  updated_by: bigint;
}

export class GetAllBusinessUnitDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  parent_level_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenant_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  organizational_level_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';
}

export class GetAllCollectionOperations {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'status must be a string' })
  status?: boolean;
}
