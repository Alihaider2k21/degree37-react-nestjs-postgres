import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class CreateDonorCenterFilterDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @ApiProperty()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Invalid City. Only alphabets are allowed.',
  })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  @ApiProperty()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Invalid State. Only alphabets are allowed.',
  })
  state: string;

  @IsBoolean({ message: 'Staging Facility must be a boolean value' })
  staging_site: boolean;

  @IsNumber()
  @IsNotEmpty({ message: 'Collection Operation is required' })
  @ApiProperty()
  collection_operation_id: bigint;

  @IsNumber()
  @IsNotEmpty({ message: 'Organizational Level is required' })
  @ApiProperty()
  organizational_level_id: bigint;

  @IsBoolean({ message: 'Status must be a boolean value' })
  is_active: boolean;

  @IsOptional()
  @ApiHideProperty()
  created_by: bigint;
}
