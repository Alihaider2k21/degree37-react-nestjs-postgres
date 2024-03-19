import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetAllOrganizationalLevelsInterface {
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
  keyword?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  parent_level_id?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  collectionOperation: string;
}
