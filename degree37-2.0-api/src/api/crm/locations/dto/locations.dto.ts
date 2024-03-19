import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { GetAddressInterface } from '../interface/address.interface';
import { GetAddressHistoryInterface } from '../interface/addressHistory.interface';
import { customFiledsDto } from '../../../common/dto/customfield/custom-field.dto';

export class LocationsDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty()
  name: string;

  //   @IsNotEmpty({ message: "cross_street is required" })
  //   @IsString({ message: "cross_street must be a string" })
  //   @ApiProperty()
  //   cross_street: string;

  // @IsNotEmpty({ message: 'floor is required' })
  @IsOptional()
  @IsString({ message: 'floor must be a string' })
  @ApiProperty()
  floor: string;

  @IsNotEmpty({ message: 'room is required' })
  @IsString({ message: 'room must be a string' })
  @ApiProperty()
  room: string;

  @IsOptional()
  room_phone: string;

  // @IsNotEmpty({ message: 'site_contact_id is required' })
  @IsOptional()
  @IsInt({ message: 'site_contact_id must be a bigint' })
  @ApiProperty()
  site_contact_id: bigint;

  becs_code: bigint;

  @IsNotEmpty({ message: 'site_contact_id is required' })
  @IsString({ message: 'site_contact_id must be a bigint' })
  @ApiProperty()
  site_type: string;

  @IsNotEmpty({ message: 'is_active is required' })
  @IsBoolean({ message: 'is_active must be a boolean' })
  @ApiProperty()
  is_active: boolean;

  created_by: bigint;

  is_archived: boolean;

  // @IsNotEmpty({ message: 'cross_street is required' })
  @IsOptional()
  @IsString({ message: 'cross_street must be a String' })
  @ApiProperty()
  cross_street: string;

  @ApiHideProperty()
  forbidUnknownValues: true;

  @ApiHideProperty()
  address: GetAddressInterface;

  @ApiHideProperty()
  addressHistory: GetAddressHistoryInterface;

  //   @IsString()
  //   @IsOptional()
  //   @ApiProperty({ required: false })
  //   location_id: string;

  @IsNotEmpty({ message: 'room_size_id is required' })
  @IsInt({ message: 'room_size_id must be a bigint' })
  @ApiProperty({ required: false })
  room_size_id: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  elevator: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  inside_stairs: bigint;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  outside_stairs: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  electrical_note: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  special_instructions: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  qualification_status: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  specsData: object[];

  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  custom_fields: customFiledsDto;
}
