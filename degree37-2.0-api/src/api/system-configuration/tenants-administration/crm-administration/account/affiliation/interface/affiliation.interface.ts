import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';

export class AffiliationInterface {
  @ApiProperty()
  @IsInt()
  id: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty()
  collection_operation_id: bigint;

  @ApiProperty()
  is_active?: boolean;

  @ApiProperty()
  is_archive: boolean;

  @ApiProperty()
  created_by?: bigint;
}

export class GetAllAffiliationsInterface {
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
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['name', 'description', 'is_active', 'collection_operation'],
  })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}

export class UpdateAffiliationsInterface {
  @ApiProperty()
  @IsInt()
  id: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @IsNotEmpty({ message: 'Status is required' })
  @ApiProperty()
  is_active: boolean;

  @IsArray()
  @ApiProperty()
  collection_operation: Array<bigint>;

  @ApiProperty()
  created_by?: bigint;

  @ApiProperty()
  updated_by?: bigint;
}
