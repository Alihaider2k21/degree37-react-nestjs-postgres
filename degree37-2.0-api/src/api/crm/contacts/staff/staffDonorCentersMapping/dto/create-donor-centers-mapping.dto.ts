import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsIntegerArray } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/dto/create-role-permission.dto';

export class CreateStaffDonorCentersMappingDto {
  @IsNotEmpty({ message: 'Staff id is required' })
  @IsInt({ message: 'Staff id must be a Number' })
  @ApiProperty()
  staff_id: bigint;

  @IsNotEmpty({ message: 'Donor Center id must not be empty' })
  @ArrayNotEmpty({ message: 'Donor Center id array must not be empty' })
  @IsIntegerArray({ message: 'Donor Center id must be an integer' })
  @ApiProperty()
  donor_center_id: number[];

  @IsOptional()
  @IsBoolean({ message: 'Is Primary must be a Boolean' })
  @ApiProperty({ default: false })
  is_primary: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Is Active must be a Boolean' })
  @ApiProperty({ default: true })
  is_active: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Is Archive must be a Boolean' })
  @ApiProperty({ default: false })
  is_archived: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}

export class UpdateStaffDonorCentersMappingDto {
  @IsNotEmpty({ message: 'Staff id is required' })
  @IsInt({ message: 'Staff id must be a Number' })
  @ApiProperty()
  staff_id: bigint;

  @IsNotEmpty({ message: 'Donor Center id is required' })
  @IsInt({ message: 'Donor Center id must be a Number' })
  @ApiProperty()
  donor_center_id: bigint;

  @IsOptional()
  @IsBoolean({ message: 'Is Primary must be a Boolean' })
  @ApiProperty()
  is_primary: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}
