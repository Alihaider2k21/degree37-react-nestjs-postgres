import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  IsInt,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { GetAddressInterface } from 'src/api/crm/locations/interface/address.interface';
import { customFiledsDto } from '../../../../../../common/dto/customfield/custom-field.dto';
export class CreateFacilityDto {
  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Alternate Name is required' })
  @ApiProperty()
  alternate_name: string;

  // @IsString()
  // @IsNotEmpty({ message: 'City is required' })
  // @ApiProperty()
  // city: string;

  // @IsString()
  // @IsNotEmpty({ message: 'State is required' })
  // @ApiProperty()
  // // @Matches(/^[a-zA-Z\s]+$/, {
  // //   message: 'Invalid State. Only alphabets are allowed.',
  // // })
  // state: string;

  // @IsString()
  // @IsNotEmpty({ message: 'Country is required' })
  // @ApiProperty()
  // // @Matches(/^[a-zA-Z\s]+$/, {
  // //   message: 'Invalid Country. Only alphabets are allowed.',
  // // })
  // country: string;

  // @IsString()
  // @IsNotEmpty({ message: 'Physical address is required' })
  // @ApiProperty()
  // physical_address: string;

  // @IsString()
  // @IsNotEmpty({ message: 'Postal code is required' })
  // @ApiProperty()
  // postal_code: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @ApiProperty()
  phone: string;

  // @IsString()
  // @IsNotEmpty({ message: 'Code is required' })
  // @ApiProperty()
  // code: string;

  @IsBoolean({ message: 'Donor Center must be a boolean value' })
  donor_center: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Archived must be a boolean value' })
  is_archived?: boolean;

  @IsBoolean({ message: 'Status must be a boolean value' })
  staging_site: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Collection Operation is required' })
  @ApiProperty()
  collection_operation: bigint;

  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  @IsString()
  @IsOptional({ message: 'Industry category is required' })
  @ApiProperty()
  industry_category: bigint;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  industry_sub_category: Array<number>;

  @ApiProperty()
  updated_by: bigint;

  @ApiHideProperty()
  address: GetAddressInterface;

  @IsOptional()
  @ApiProperty()
  custom_fields: customFiledsDto;
}
