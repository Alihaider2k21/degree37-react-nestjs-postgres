import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class DailyCapacityInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page: number | null = null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword: string | null = null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: ['All', 'Current', 'Past', 'Scheduled'],
  })
  display: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  collectionOperation: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string = '';
}
