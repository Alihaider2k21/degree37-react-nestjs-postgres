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

export class CreateNotesDto {
  @IsNotEmpty({ message: 'Noteable Id is required' })
  @IsInt({ message: 'Noteable Id must be an integer number' })
  @ApiProperty()
  noteable_id: bigint;

  @IsNotEmpty({ message: 'Noteable Type is required' })
  @IsEnum(noteableType)
  @ApiProperty({ enum: noteableType })
  noteable_type: noteableType;

  @IsNotEmpty({ message: 'Note name is required' })
  @IsString()
  @ApiProperty()
  note_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  details: string;

  @IsNotEmpty({ message: 'Category Id value is required' })
  @IsInt({ message: 'Category Id must be an integer number' })
  @ApiProperty()
  category_id: bigint;

  @IsNotEmpty({ message: 'Sub Category Id value is required' })
  @IsInt({ message: 'Sub Category Id must be an integer number' })
  @ApiProperty()
  sub_category_id: bigint;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
