import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  FavoriteCalendarPreviewTypeEnum,
  FavoriteLocationTypeEnum,
  FavoriteOperationTypeEnum,
} from '../enum/manage-favorites.enum';

export class CreateManageFavoritesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  alternate_name: string;

  @IsOptional()
  @IsEnum(FavoriteCalendarPreviewTypeEnum)
  @ApiProperty({ required: false, enum: FavoriteCalendarPreviewTypeEnum })
  preview_in_calendar: FavoriteCalendarPreviewTypeEnum;

  @IsOptional()
  @IsEnum(FavoriteLocationTypeEnum)
  @ApiProperty({ required: false, enum: FavoriteLocationTypeEnum })
  location_type: FavoriteLocationTypeEnum;

  @IsOptional()
  @IsEnum(FavoriteOperationTypeEnum)
  @ApiProperty({ required: false, enum: FavoriteOperationTypeEnum })
  operation_type: FavoriteOperationTypeEnum;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  recruiters_ids: bigint[];

  @ApiProperty()
  is_default: boolean;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  is_open_in_new_tab: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  created_by: bigint;

  @ApiProperty()
  organization_level_id: bigint;

  @ApiProperty()
  tenant_id: bigint;

  @ApiProperty()
  product_id: bigint;

  @ApiProperty()
  procedure_id: bigint;

  @ApiProperty()
  operations_status_id: bigint;
}

export class ListManageFavoritesDto {
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
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: [
      'name',
      'description',
      'status',
      'operations_status_id',
      'organization_level_id',
      'product_id',
      'procedure_id',
    ],
  })
  sortName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll?: string;
}

export class MakeDefaultDto {
  @IsInt()
  @ApiProperty({ required: true })
  id: number;

  @IsBoolean()
  @ApiProperty({ required: true })
  is_default: boolean;
}
