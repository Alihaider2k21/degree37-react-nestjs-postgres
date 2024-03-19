import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  isNotEmpty,
} from 'class-validator';

export class CreateClassificationDto {
  @IsString({ message: 'Name must be a string value' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(60, { message: 'Name must not exceed 60 characters' })
  @ApiProperty()
  name: string;

  @IsString({ message: 'Description must be a string value' })
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsString({ message: 'Short Description must be a string value' })
  @IsNotEmpty({ message: 'Short Description is required' })
  @MaxLength(255, {
    message: 'Short Description must not exceed 255 characters',
  })
  @ApiProperty()
  short_description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Status is required' })
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  @IsInt({ message: 'Created_By  must be an integer value' })
  @ApiProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class GetAllClassificationDto {
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
  @ApiProperty({
    required: false,
    enum: ['name', 'description', 'short_description', 'status'],
  })
  sortBy?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  status?: boolean;
}

export class SearchClassificationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  keyword?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  status?: boolean;
}

export class UpdateClassificationDto {
  @IsString({ message: 'Name must be a string value' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(60, { message: 'Name must not exceed 60 characters' })
  @ApiProperty()
  name: string;

  @IsString({ message: 'Description must be a string value' })
  @ApiProperty()
  description: string;

  @IsString({ message: 'Short Description must be a string value' })
  @MaxLength(255, {
    message: 'Short Description must not exceed 255 characters',
  })
  @ApiProperty()
  short_description: string;

  @ApiProperty()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  @IsInt({ message: 'Created_By  must be an integer value' })
  @ApiProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
