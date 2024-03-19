import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAddressInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  address1?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  address2?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  latitude?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  longitude?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  addressabe_type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  zip_code?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  state?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  county?: string;

  @ApiProperty()
  coordinates: { latitude: string; longitude: string };

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  addressable_id?: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  addressable_type: string;
}
