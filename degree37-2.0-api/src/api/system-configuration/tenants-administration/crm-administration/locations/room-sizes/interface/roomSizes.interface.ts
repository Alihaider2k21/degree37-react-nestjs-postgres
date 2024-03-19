import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class GetAllRoomSizesInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 1 })
  page: number | 1;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 10 })
  limit?: number | 10;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['name', 'description', 'is_active'] })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;
}

export class GetUserId {
  @ApiProperty({ type: () => 'bigint' })
  updated_by?: bigint;
}
