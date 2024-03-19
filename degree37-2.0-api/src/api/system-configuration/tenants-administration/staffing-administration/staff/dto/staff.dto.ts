import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllStaffDto {
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
  collection_operation_id: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['name', 'description', 'is_active', 'role'],
  })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}

export class GetAllTeamStaffDto {
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
  @ApiProperty({ required: false })
  team: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['name', 'description', 'is_active', 'role'],
  })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}

export class GetStaffOtherTeamDto {
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
  role: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  team: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['name', 'description', 'is_active', 'role'],
  })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}
