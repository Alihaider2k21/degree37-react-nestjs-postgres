import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class NCPBluePrintsInfoInterface {
  @IsString({ message: 'Vehicles must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  vehicles: string;

  @IsString({ message: 'Devices must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  devices: string;

  @IsString({ message: 'Roles must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  roles: string;
}
