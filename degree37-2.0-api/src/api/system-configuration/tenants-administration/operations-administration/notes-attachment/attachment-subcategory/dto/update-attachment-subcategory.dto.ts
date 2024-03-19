import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateAttachmentSubCategoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Note category name is required' })
  @IsString({ message: 'Note Category name must be a string' })
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'Is_active must be a boolean value' })
  is_active: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is_archive is required' })
  @IsBoolean({ message: 'Is_archive must be a boolean value' })
  is_archived: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Parent id is required' })
  @IsInt({ message: 'Parent id must be a bigint value' })
  parent_id: bigint;
}
