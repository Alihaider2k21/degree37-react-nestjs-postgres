import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export enum enumStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export class GetAllVehicleTypesInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page: number | null = null;

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
  location_type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  linkable: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: string;
}
