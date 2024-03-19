import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomFieldDto } from './create-custom-field.dto';
import {
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
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
  id: bigint;

  @ApiProperty()
  sort_order: bigint;

  @ApiProperty()
  type_name: string;

  @ApiProperty()
  type_value: string;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
export class UpdateCustomFieldDto extends PartialType(CreateCustomFieldDto) {
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

export class customFieldDataDtoUpdate {
  @ApiProperty()
  id: bigint;

  @ApiProperty()
  field_id: bigint;

  @ApiProperty()
  field_data: string;
}
export class updateCustomFieldDataDto {
  @ApiProperty({ type: () => [customFieldDataDtoUpdate] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => customFieldDataDtoUpdate)
  fields_data: customFieldDataDtoUpdate[];

  @ApiProperty()
  @IsNotEmpty()
  custom_field_datable_id: bigint;

  @ApiProperty()
  @IsNotEmpty()
  custom_field_datable_type: string;
}
