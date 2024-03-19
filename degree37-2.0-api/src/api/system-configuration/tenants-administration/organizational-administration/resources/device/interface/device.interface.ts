import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export enum enumShareTypes {
  staff = 'STAFF',
  vehicle = 'VEHICLE',
  device = 'DEVICE',
}

export class GetAllDevicesInterface {
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
  device_type: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation: string;
}

export class GetDevicesForDriveInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation: bigint;
}
