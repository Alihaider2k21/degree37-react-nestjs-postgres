import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class VolunteerDuplicateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address1: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address2?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zip_code: string;
}

export class IdentifyVolunteerDuplicateDto {
  @ApiProperty()
  @IsString({ message: 'First Name must be a string.' })
  @IsNotEmpty({ message: 'First Name is required' })
  first_name: string;

  @ApiProperty()
  @IsString({ message: 'Last Name must be a string.' })
  @IsNotEmpty({ message: 'Last Name is required' })
  last_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  work_phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mobile_phone?: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => VolunteerDuplicateAddressDto)
  @IsOptional()
  address?: VolunteerDuplicateAddressDto;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  volunteer_id?: bigint;
}
