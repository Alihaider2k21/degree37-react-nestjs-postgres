import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { LocationTypeEnum } from 'src/api/system-configuration/tenants-administration/staffing-administration/staff-setups/enum/type';

export enum enumShareTypes {
  staff = 'STAFF',
  vehicle = 'VEHICLE',
  device = 'DEVICE',
}

export class GetAllVehiclesInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  vehicle_type: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: string;
}

export class GetAllVehiclesForDricveInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  location_type?: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  start_time?: any;
}
