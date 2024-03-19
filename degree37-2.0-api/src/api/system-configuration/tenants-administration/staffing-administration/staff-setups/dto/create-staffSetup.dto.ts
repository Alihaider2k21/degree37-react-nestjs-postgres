import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsBoolean,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateStaff_Dto } from './create-staff.dto';
import {
  CreateStaffConfigDto,
  UpdateStaffConfigDto,
} from './create-staffConfig.dto';
import { Type } from 'class-transformer';
export class CreateStaffSetupDto {
  @ApiProperty({ type: () => CreateStaff_Dto })
  staff?: CreateStaff_Dto;

  @IsNotEmpty({ message: 'Staff Configuration IDs must not be empty' })
  @ArrayNotEmpty({
    message: 'Staff Configuration IDs array must not be empty',
  })
  @ApiProperty({ type: () => [CreateStaffConfigDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateStaffConfigDto)
  staff_configuration: CreateStaffConfigDto[];

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ type: () => 'bigint' })
  created_by?: bigint;

  @ApiProperty({ type: () => 'bigint', nullable: true })
  updated_by?: bigint;
}

export class UpdateStaffSetupDto {
  @ApiProperty({ type: () => CreateStaff_Dto })
  staff?: CreateStaff_Dto;

  @IsNotEmpty({ message: 'Staff Configuration IDs must not be empty' })
  @ArrayNotEmpty({
    message: 'Staff Configuration IDs array must not be empty',
  })
  @ApiProperty({ type: () => [UpdateStaffConfigDto] })
  @ValidateNested({ each: true })
  @Type(() => UpdateStaffConfigDto)
  staff_configuration: UpdateStaffConfigDto[];

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ type: () => 'bigint' })
  created_by?: bigint;

  @ApiProperty({ type: () => 'bigint', nullable: true })
  updated_by?: bigint;
}
