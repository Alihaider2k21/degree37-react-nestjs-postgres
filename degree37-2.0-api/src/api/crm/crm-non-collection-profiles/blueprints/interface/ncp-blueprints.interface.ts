import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class NCPBluePrintsInterface {
  @IsString({ message: 'Status must be boolean' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['true', 'false'] })
  is_active: string;

  @IsOptional()
  @ApiProperty({
    description: 'keyword',
    required: false,
  })
  keyword?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @IsInt()
  tenant_id: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';
}
