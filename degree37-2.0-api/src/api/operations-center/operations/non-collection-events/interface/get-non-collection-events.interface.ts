import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetAllNonCollectionEventsInterface {
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
    description: 'keyword',
    required: false,
  })
  keyword?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Selected date in the format "YYYY-MM-DD HH:mm:ss"',
    required: false,
  })
  selected_date?: string;

  @IsString({ message: 'Status is not valid.' })
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['event_name', 'location', 'status', 'date'],
  })
  sortBy?: string = '';
}

export class GetNonCollectionEventsChangeAuditInterface {
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
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['changes_from', 'changed_when', 'changes_to', 'changes_field'],
  })
  sortBy?: string = '';
}
