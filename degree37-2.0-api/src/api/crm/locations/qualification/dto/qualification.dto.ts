import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateQualificationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Location ID is required' })
  @IsInt({ message: 'Location ID must be a number' })
  location_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Qualification description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Qualified by is required' })
  @IsInt({ message: 'qualified_by must be a number value' })
  qualified_by: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Qualification date is required' })
  @IsString({ message: 'qualification_date must be a timestamp' })
  qualification_date: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'qualified_expires must be a timestamp' })
  qualification_expires: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Qualification Status is required' })
  @IsBoolean({ message: 'qualification_status must be a boolean value' })
  qualification_status: boolean;
}
