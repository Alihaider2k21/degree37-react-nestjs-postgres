import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetAllRolesInterface {
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsBoolean()
  staffable: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  short_name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  function_id: number;

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
  fetchAll?: string;
}
