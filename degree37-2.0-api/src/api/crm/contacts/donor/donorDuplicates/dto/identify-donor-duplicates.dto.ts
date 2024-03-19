import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class DonorDuplicateAddressDto {
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

export class IdentifyDonorDuplicateDto {
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
  @ValidateNested()
  @Type(() => DonorDuplicateAddressDto)
  @IsOptional()
  address?: DonorDuplicateAddressDto;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  donor_id?: bigint;
}
