import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { appliesToEnum } from '../enums/operation-status.enum';

export class OperationStatusInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page: number | null = null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetch_all?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: appliesToEnum })
  appliesTo?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: [
      'name',
      'is_active',
      'description',
      'schedulable',
      'hold_resources',
      'contribute_to_scheduled',
      'requires_approval',
      'applies_to',
    ],
  })
  sortName?: string = '';
}
