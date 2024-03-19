import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNonCollectionProfileDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Profile name is required' })
  @IsString({ message: 'Profile name must be a string' })
  profile_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Alternate name must be a string' })
  alternate_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Event category should not be empty' })
  @IsInt({ message: 'Event category must be an integer number' })
  event_category_id: bigint;

  @ApiProperty()
  @IsOptional()
  @IsInt({ message: 'Event subCategory must be an integer number' })
  event_subcategory_id: bigint;

  @ApiProperty()
  @IsArray({ message: 'Collection operation must be an array' })
  @IsNotEmpty({ message: 'Collection operation should not be empty' })
  collection_operation_id: Array<number>;

  @IsBoolean({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: [true, false], default: true })
  is_active: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Owner should not be empty' })
  @IsInt({ message: 'Owner must be an integer number' })
  owner_id: bigint;
}
