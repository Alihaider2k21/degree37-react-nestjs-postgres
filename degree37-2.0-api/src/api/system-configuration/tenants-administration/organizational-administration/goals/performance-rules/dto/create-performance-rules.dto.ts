import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export enum ProjectionAccuracyRef {
  PRODUCT = 'Product',
  PROCEDURES = 'Procedures',
}

export class CreatePerformanceRulesDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Projection Accuracy Minimum is required' })
  @IsInt({ message: 'Projection Accuracy Minimum must be a number' })
  projection_accuracy_minimum: number;

  @IsNotEmpty({ message: 'Projection Accuracy Maximum is required' })
  @IsInt({ message: 'Projection Accuracy Maximum must be a number' })
  @ApiProperty()
  projection_accuracy_maximum: number;

  @IsNotEmpty({ message: 'Projection Accuracy ref is required' })
  @IsEnum(ProjectionAccuracyRef)
  @ApiProperty({ enum: ProjectionAccuracyRef })
  projection_accuracy_ref: ProjectionAccuracyRef;

  @IsNotEmpty({ message: 'Is Include qns is required' })
  @IsBoolean({ message: 'Is Include qns must be a Boolean' })
  @ApiProperty()
  is_include_qns: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}

export class UpdatePerformanceRulesDto extends PartialType(
  CreatePerformanceRulesDto
) {}
