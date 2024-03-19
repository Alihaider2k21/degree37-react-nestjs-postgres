import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class IdentifyDuplicateDto {
  @ApiProperty()
  @IsString({ message: 'First Name must be a string.' })
  @IsNotEmpty({ message: 'First Name is required' })
  first_name: string;

  @ApiProperty()
  @IsString({ message: 'Last Name must be a string.' })
  @IsNotEmpty({ message: 'Last Name is required' })
  last_name: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  birth_date?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  work_phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mobile_phone?: string;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  staff_id?: bigint;
}
