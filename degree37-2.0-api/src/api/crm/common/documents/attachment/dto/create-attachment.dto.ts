import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateAttachmentsDto {
  @IsNotEmpty({ message: 'Attachment name is required' })
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsArray()
  @ApiProperty()
  attachment_files: string[];

  @IsNotEmpty({ message: 'Category Id value is required' })
  @IsInt({ message: 'Category Id must be an integer number' })
  @ApiProperty()
  category_id: bigint;

  @IsNotEmpty({ message: 'SubCategory Id value is required' })
  @IsInt({ message: 'SubCategory Id must be an integer number' })
  @ApiProperty()
  sub_category_id: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
