import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTerritoriyDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Territory name is required' })
  @IsString({ message: 'Territory name must be a string' })
  territory_name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty({ message: 'Recruiter is required' })
  recruiter: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Status is required' })
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  created_by: bigint;
}

export class GetAllTerritoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['territory_name', 'description', 'status', 'recruiter'],
  })
  sortBy?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: boolean;

  @ApiProperty()
  name?: string = '';

  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true, false'] })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  recruiter_id: bigint;
}
