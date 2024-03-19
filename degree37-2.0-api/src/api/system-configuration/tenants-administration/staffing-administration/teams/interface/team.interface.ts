import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class TeamInterface {
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

  @IsString()
  @ApiProperty()
  short_description: string;

  @ApiProperty()
  collection_operation_id: number[];

  @ApiProperty()
  is_active?: boolean;

  @ApiProperty()
  is_archive: boolean;

  @ApiProperty()
  created_by?: bigint;

  @ApiProperty()
  updated_by?: bigint;
}

export class GetAllTeamsInterface {
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
  collection_operation: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: [
      'name',
      'description',
      'short_description',
      'is_active',
      'collection_operation',
      'member_count',
    ],
  })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}

export class UpdateTeamInterface {
  @ApiProperty()
  @IsInt()
  id: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  short_description?: string;

  @IsNotEmpty({ message: 'Status is required' })
  @ApiProperty()
  is_active: boolean;

  @IsNotEmpty({ message: 'Collection Operation is required' })
  @IsArray()
  @ApiProperty()
  collection_operation_id?: bigint[];

  @ApiProperty()
  updated_by?: bigint;

  @ApiProperty()
  created_by?: bigint;
}
