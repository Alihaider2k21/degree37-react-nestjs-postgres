import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class GetAllDonorActivitiesInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  resourceId?: number;
}
