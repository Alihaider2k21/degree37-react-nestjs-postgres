import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetAllLocationInterface {
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
  downloadAll?: boolean;

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
  status?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  county?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  state?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  account?: string;

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
  site_type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  organizational_levels?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  qualification_status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collection_operation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  recruiter?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  territory?: string;

  //spec

  //specOptions

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  location_specs_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  specs_key: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  specs_value: boolean;
}

export class GetDrivesHistoryQuery {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortName?: string;

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

  @IsOptional()
  @ApiProperty({
    description: 'Selected date in the format "YYYY-MM-DD HH:mm:ss"',
    required: false,
  })
  start_date?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Selected date in the format "YYYY-MM-DD HH:mm:ss"',
    required: false,
  })
  end_date?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  status?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  view_as: string;
}
