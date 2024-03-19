import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllPermissionsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  isSuperAdminPermission?: boolean;
}

export class RemovePermissionsInterface {
  @IsString()
  @ApiProperty({ required: true })
  roleId: any;

  @IsString()
  @ApiProperty({ required: true })
  permissionId?: any;
}

export class GetAllRolesInterface {
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
  search?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  isActive?: string;

  @IsOptional()
  tenant_id?: number;
}
