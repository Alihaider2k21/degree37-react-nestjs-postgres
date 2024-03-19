import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ClassificationInterface {
  @ApiProperty()
  @IsInt({ message: 'Id must be an integer value' })
  id: bigint;

  @IsString({ message: 'Name must be a string value' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsString({ message: 'Description must be a string value' })
  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsString({ message: 'Short Description must be a string value' })
  @ApiProperty()
  @IsNotEmpty({ message: 'short description is required' })
  short_description: string;

  @IsNotEmpty({ message: 'Status is required' })
  @ApiProperty()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status?: boolean;

  @ApiProperty()
  is_archive: boolean;

  @IsInt({ message: 'Created_By  must be an integer value' })
  @ApiProperty()
  created_by?: bigint;
}

export class SearchInterface {
  @IsString({ message: 'Name must be a string value' })
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString({ message: 'Name must be a string value' })
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  status?: boolean;
}

export class GetAllClassificationsInterface {
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString({ message: 'Name must be a string value' })
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString({ message: 'Name must be a string value' })
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}

export class UpdateClassificationInterface {
  @ApiProperty()
  @IsInt()
  id: bigint;

  @IsString({ message: 'Name must be a string value' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(60, { message: 'Name must not exceed 60 characters' })
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(255, {
    message: 'Short Description must not exceed 255 characters',
  })
  description?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Short Description is required' })
  @MaxLength(255, {
    message: 'Short Description must not exceed 255 characters',
  })
  short_description?: string;

  @IsNotEmpty({ message: 'Status is required' })
  @IsBoolean({ message: 'Status must be a boolean value' })
  @ApiProperty()
  status: boolean;
}
