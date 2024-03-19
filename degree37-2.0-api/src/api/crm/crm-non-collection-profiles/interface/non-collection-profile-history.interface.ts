import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class NonCollectionProfileEventHistoryInterface {
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
