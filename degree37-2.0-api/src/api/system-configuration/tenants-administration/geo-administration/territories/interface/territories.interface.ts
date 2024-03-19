import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export enum enumStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export class GetAllTerritoriesInterface {
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
  fetchAll?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: boolean;
}
