import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class GetAllDonorsInterface {
  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  fetchAll?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

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
  selectedOptions?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  downloadType?: string;

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
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  blood_type?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  last_donation_start?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  last_donation_end?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  group_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  center_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  assertion?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;
}

export class GetAllDonorsAppointments {
  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  fetchAll?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  donor_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  procedure_type?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  locationType?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  dateRange?: string;

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
  @ApiProperty({ required: false })
  tenant_id?: bigint;
}
export class GetAppointmentsCreateListingInterface {
  @ApiPropertyOptional({ type: 'boolean' })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  fetchAll?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  radius?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  procedureType?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  accountType?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  donorCenter?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  dateRange?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  earlierThan?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  laterThan?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenant_id?: bigint;
}

export class GetAppointmentCreateDetailsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  type?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  donor_id?: number;
}

export class GetStartTimeCreateDetailsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  shiftId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  slotId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  procedureId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  isCancelled?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  type?: string;
}
