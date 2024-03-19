import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllStagesInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortOrder?: string;

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
  is_active: boolean;
}
