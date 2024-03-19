import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class FacilityInterface {}

export class GetFacilityInterface {
  @ApiProperty({ required: true })
  @IsString()
  id: any;
}

export class GetDonorCenterStagingSitesInterface {
  @ApiProperty({ required: true })
  @IsString()
  collection_operation: bigint;

  @ApiProperty({ required: true })
  @IsString()
  drive_date: string;
}
