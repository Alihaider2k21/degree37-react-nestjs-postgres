import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LockDateInterface {
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
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  locked_dates: string;

  @IsOptional()
  @ApiProperty()
  collection_operation: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: string;
}
