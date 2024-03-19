import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssociationType } from '../enums/association_type.enum';

export class UpdateCertificationDto {
  @ApiProperty()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty()
  @IsString({ message: 'Short Name must be a string' })
  @IsNotEmpty({ message: 'Short Name is required' })
  short_name: string;

  @ApiProperty({ enum: AssociationType })
  @IsEnum(AssociationType)
  @IsNotEmpty({ message: 'Association Type is required' })
  association_type: AssociationType;

  @ApiPropertyOptional({ default: true })
  @IsBoolean({ message: 'Active must be a boolean' })
  @IsOptional()
  is_active: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Expires is required' })
  @IsBoolean({ message: 'Expires must be as boolean' })
  expires: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsInt({ message: 'Expiration Interval must be a number' })
  expiration_interval?: number;
}
