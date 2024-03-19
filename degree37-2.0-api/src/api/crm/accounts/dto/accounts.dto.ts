import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { customFiledsDto } from '../../../common/dto/customfield/custom-field.dto';

export class AccountsDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty()
  name: string;

  // @IsOptional()
  // @IsInt({ message: 'Account Id must be a number' })
  // @ApiProperty()
  // account_id: number;

  // @IsOptional()
  // @IsString({ message: 'External Id must be a string' })
  // @ApiProperty()
  // external_id: string;

  alternate_name: string;

  address2: string;
  address1: string;

  county: string;

  latitude: number;

  longitude: number;

  @IsNotEmpty({ message: 'Mailing address is required' })
  @IsString({ message: 'Mailing address must be a string' })
  @ApiProperty()
  mailing_address: string;

  zip_code: string;

  city: string;

  state: string;

  country: string;

  website: string;

  facebook: string;

  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  @Matches(/^\(\d{3}\)\s\d{3}-\d{4}$/, {
    message: 'Invalid phone number format. Example: (123) 456-7890',
  })
  @ApiProperty()
  phone: string;

  @IsNotEmpty({ message: 'Industry Category should not be empty' })
  @IsInt({ message: 'Industry Category must be an integer number' })
  @ApiProperty()
  industry_category: bigint;

  @IsNotEmpty({ message: 'Industry Sub Category should not be empty' })
  @IsInt({ message: 'Industry Sub Category must be an integer number' })
  @ApiProperty()
  industry_subcategory: bigint;

  @IsNotEmpty({ message: 'Stage should not be empty' })
  @IsInt({ message: 'Stage must be an integer number' })
  @ApiProperty()
  stage: bigint;

  @IsNotEmpty({ message: 'Source should not be empty' })
  @IsInt({ message: 'Source must be an integer number' })
  @ApiProperty()
  source: bigint;

  @IsString({ message: 'BECS_code must be a string' })
  @IsOptional()
  @ApiProperty()
  BECS_code: string;

  @IsNotEmpty({ message: 'Collection Operation should not be empty' })
  @IsInt({ message: 'Collection Operation must be an integer number' })
  @ApiProperty()
  collection_operation: bigint;

  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  custom_fields: customFiledsDto;

  recruiter: bigint;

  territory: bigint;

  population: number;

  RSMO: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  is_active: boolean;

  @IsOptional()
  contacts: [
    {
      contactable_type: string;
      contactable_id: bigint;
      record_id: bigint;
      role_id: bigint;
    }
  ];

  @IsOptional()
  deleteContacts: [string];

  @ApiHideProperty()
  forbidUnknownValues: true;
}
