import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class UpdateDeviceTypeDto {
  @IsNotEmpty({ message: 'Id should not be empty' })
  @IsInt({ message: 'Id must be an integer number' })
  @ApiProperty()
  id: bigint;

  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @IsString()
  @IsOptional()
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
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  @IsNotEmpty({ message: 'Updated By should not be empty' })
  @IsInt({ message: 'Updated By must be an integer number' })
  @ApiProperty()
  updated_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
