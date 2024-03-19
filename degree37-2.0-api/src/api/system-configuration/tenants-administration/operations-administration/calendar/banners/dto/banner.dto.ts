import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class BannerDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Start date should not be empty' })
  @ApiProperty()
  start_date: string;

  @IsString()
  @IsNotEmpty({ message: 'End date should not be empty' })
  @ApiProperty()
  end_date: string;

  @IsNotEmpty({ message: 'Collection Operations should not be empty' })
  @IsArray({ message: 'Collection Operations must be an integer array' })
  @ApiProperty()
  collection_operations: Array<bigint>;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
