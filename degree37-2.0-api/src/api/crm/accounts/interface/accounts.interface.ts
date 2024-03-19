import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class GetAllAccountsInterface {
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
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  state?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  industryCategory?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  industrySubCategory?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  stage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  source?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizational_levels?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  collectionOperation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  recruiter?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  territory?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}

export class GetAccountsSearch {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
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
