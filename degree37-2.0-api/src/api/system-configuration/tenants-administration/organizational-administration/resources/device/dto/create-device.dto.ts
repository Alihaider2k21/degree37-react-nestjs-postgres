import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  @Matches(/^[0-9\s\S]+$/, {
    message:
      'Invalid Name. Only alphabets, numbers and special characters are allowed.',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Short Name is required' })
  @ApiProperty()
  @Matches(/^[0-9\s\S]+$/, {
    message:
      'Invalid Short Name. Only alphabets, numbers and special characters are allowed.',
  })
  short_name: string;

  @IsNotEmpty({ message: 'Device Type should not be empty' })
  @IsInt({ message: 'Device Type is required' })
  @ApiProperty()
  device_type_id: bigint;

  @IsInt({ message: 'Collection Operation must be an integer number' })
  @ApiProperty()
  collection_operation_id: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  @ApiHideProperty()
  forbidUnknownValues: true;

  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;
}
