import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { attachmentType } from '../enum/attachment.enum';

export class UpdateAttachmentsDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  attachment_files: string[];

  @IsOptional()
  @IsInt({ message: 'Category Id must be an integer number' })
  @ApiProperty()
  category_id: bigint;

  @IsOptional()
  @IsInt({ message: 'SubCategory Id must be an integer number' })
  @ApiProperty()
  sub_category_id: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
