import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { appliesToEnum } from '../enums/operation-status.enum';

export class OperationStatusDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Operation Status name is required' })
  @IsString({ message: 'Operation Status name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Applies To is required' })
  @ApiProperty({
    description: 'List of Applies To',
    isArray: true,
    enum: appliesToEnum,
  })
  @IsEnum(appliesToEnum, { each: true })
  applies_to: appliesToEnum[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'Schedulable must be a boolean value' })
  schedulable: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'Hold Resources must be a boolean value' })
  hold_resources: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'Contribute To Scheduled must be a boolean value' })
  contribute_to_scheduled: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'Requires Approval must be a boolean value' })
  requires_approval: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Chip Color is required' })
  @IsString({ message: 'Chip Color must be a string' })
  chip_color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean({ message: 'Is Active must be a boolean value' })
  is_active: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class UpdateOperationStatusDto extends PartialType(OperationStatusDto) {
  @ApiProperty()
  updated_by: bigint;
}
