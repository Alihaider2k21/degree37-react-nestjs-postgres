import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAddressHistoryInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  address1?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  address2?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
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
