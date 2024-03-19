import {
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUrl,
  IsBoolean,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  appliesToTypeEnum,
  fieldDataTypeEnum,
} from '../enum/custom-field.enum';
import { Type } from 'class-transformer';

export class PickListDto {
  @ApiProperty()
  type_name: string;

  @ApiProperty()
  type_value: string;

  @ApiProperty()
  sort_order: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
export class CreateCustomFieldDto {
  @IsNotEmpty()
  @ApiProperty()
  field_name: string;

  @ApiProperty()
  @IsEnum(fieldDataTypeEnum)
  field_data_type: fieldDataTypeEnum;

  @ApiProperty({ type: () => [PickListDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PickListDto)
  @IsOptional() // Mark it as optional
  pick_list: PickListDto[];

  @ApiProperty()
  @IsEnum(appliesToTypeEnum)
  applies_to: appliesToTypeEnum;

  @ApiProperty()
  @IsBoolean({ message: 'Is active must be a boolean value' })
  is_active: boolean;

  @ApiProperty()
  @IsBoolean({ message: 'Is required must be a boolean value' })
  is_required: boolean;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
export class customFieldDataDto {
  @ApiProperty()
  field_id: bigint;

  @ApiProperty()
  field_data: string;
}
export class CreateCustomFieldDataDto {
  @ApiProperty({ type: () => [customFieldDataDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => customFieldDataDto)
  fields_data: customFieldDataDto[];

  @ApiProperty()
  @IsNotEmpty()
  custom_field_datable_id: bigint;

  @ApiProperty()
  @IsNotEmpty()
  custom_field_datable_type: string;
}
