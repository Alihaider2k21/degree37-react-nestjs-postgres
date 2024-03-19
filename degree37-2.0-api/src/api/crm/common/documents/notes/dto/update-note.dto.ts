import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { noteableType } from '../enum/note.enum';

export class UpdateNotesDto {
  @IsOptional()
  @IsInt({ message: 'Notable Id must be an integer number' })
  @ApiProperty()
  noteable_id: bigint;

  @IsOptional()
  @IsEnum(noteableType)
  @ApiProperty({ enum: noteableType })
  noteable_type: noteableType;

  @IsOptional()
  @IsString()
  @ApiProperty()
  note_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  details: string;

  @IsOptional()
  @IsInt({ message: 'Category Id must be an integer number' })
  @ApiProperty()
  category_id: bigint;

  @IsOptional()
  @IsInt({ message: 'SubCategory Id must be an integer number' })
  @ApiProperty()
  sub_category_id: bigint;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
