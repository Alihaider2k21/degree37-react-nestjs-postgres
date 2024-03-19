import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateDeviceTypeDto {
  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  @Matches(/^[a-z A-Z]+$/, {
    message: 'Invalid Name. Only alphabets are allowed.',
  })
  name: string;

  @IsNotEmpty({ message: 'Procedure type should not be empty' })
  @IsInt({ message: 'Procedure type must be an integer number' })
  @ApiProperty()
  procedure_type: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
