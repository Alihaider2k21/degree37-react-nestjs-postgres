import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllMonthlyGoalsInterface {
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
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  childSortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  year?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  procedureType?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  collectionOperation?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  donorCenter?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenant_id?: number;
}

export class getRecruitersAndDonorCenetrs {
  @ApiProperty({ required: false })
  collectionOperation?: bigint;

  @ApiProperty({ required: false })
  procedure_type?: bigint;

  @ApiProperty({ required: false })
  year?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenant_id?: any;
}
