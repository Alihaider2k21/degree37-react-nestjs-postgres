import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIntegerArray } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/dto/create-role-permission.dto';

export class CreateStaffRolesMappingDto {
  @IsNotEmpty({ message: 'Staff id is required' })
  @IsInt({ message: 'Staff id must be a Number' })
  @ApiProperty()
  staff_id: bigint;

  @IsNotEmpty({ message: 'Role IDs must not be empty' })
  @ArrayNotEmpty({ message: 'Role IDs array must not be empty' })
  @IsIntegerArray({ message: 'Role Id must be an integer' })
  @ApiProperty()
  role_id: number[];

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

export class UpdateStaffRolesMappingDto {
  @IsNotEmpty({ message: 'Staff id is required' })
  @IsInt({ message: 'Staff id must be a Number' })
  @ApiProperty()
  staff_id: bigint;

  @IsNotEmpty({ message: 'Role id is required' })
  @IsInt({ message: 'Role id must be a Number' })
  @ApiProperty()
  role_id: bigint;

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
