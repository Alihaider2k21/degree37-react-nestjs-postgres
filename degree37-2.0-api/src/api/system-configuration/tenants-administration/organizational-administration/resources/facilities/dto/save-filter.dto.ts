import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class SaveFilterDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  state: string;

  @IsBoolean({ message: 'Staging Facility must be a boolean value' })
  staging_site: boolean;

  @IsNumber()
  @ApiProperty()
  collection_operation_id: bigint;

  @IsNumber()
  @ApiProperty()
  organizational_level_id: bigint;

  @IsBoolean({ message: 'Status must be a boolean value' })
  is_active: boolean;

  @IsOptional()
  @ApiHideProperty()
  created_by: bigint;
}
