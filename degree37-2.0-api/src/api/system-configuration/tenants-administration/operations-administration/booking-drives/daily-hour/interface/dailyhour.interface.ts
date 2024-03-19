import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class DailyHourInterface {
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

export class GetByCollectionOperationInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  collectionOperation: bigint;

  @IsNotEmpty({ message: 'Date should not be empty' })
  @ApiProperty({
    type: String,
    format: 'date',
    example: '2023-08-01',
  })
  driveDate: Date;
}
