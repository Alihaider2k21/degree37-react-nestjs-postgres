import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationalLevelDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Level name is required' })
  @IsString({ message: 'Level name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Short label is required' })
  @IsString({ message: 'Short label must be a string' })
  short_label: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  parent_level_id: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'Is active must be a boolean value' })
  is_active: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  updated_by: bigint;
}
