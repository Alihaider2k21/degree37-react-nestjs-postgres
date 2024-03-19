import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveTypeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Leave name is required' })
  @IsString({ message: 'Leave name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Leave description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Leave short description is required' })
  short_description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  status: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;
}
