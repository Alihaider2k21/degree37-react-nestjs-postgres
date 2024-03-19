import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllAssertionCodesInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  isFilter?: string;

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
  fetchAll?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

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
  downloadType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  selectedOptions?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tableHeaders?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  exportType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  bbcs_uuid?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}
