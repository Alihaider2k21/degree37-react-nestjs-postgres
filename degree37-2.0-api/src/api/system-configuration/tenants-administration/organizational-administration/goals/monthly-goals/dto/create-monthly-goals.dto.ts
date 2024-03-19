import { IsNotEmpty, IsInt, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsIntegerArray } from '../../daily-goals-allocation/dto/create-daily-goals-allocation.dto';

export class CreateMonthlyGoalsDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  procedure_type: bigint;

  @IsNotEmpty({ message: 'Collection Operation IDs must not be empty' })
  @ArrayNotEmpty({
    message: 'Collection Operation IDs array must not be empty',
  })
  @IsIntegerArray({
    message: 'Each Collection Operation Id must be an integer',
  })
  @ApiProperty()
  collection_operation: number[];

  @IsInt()
  @IsOptional()
  @ApiProperty()
  recruiter: bigint;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  donor_center: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'year is required' })
  @IsInt({ message: 'year must be a number' })
  year: number;

  @IsNotEmpty({ message: 'January is required' })
  @IsInt({ message: 'January must be a number' })
  @ApiProperty()
  january: number;

  @IsNotEmpty({ message: 'February is required' })
  @IsInt({ message: 'February must be a number' })
  @ApiProperty()
  february: number;

  @IsNotEmpty({ message: 'March is required' })
  @IsInt({ message: 'March must be a number' })
  @ApiProperty()
  march: number;

  @IsNotEmpty({ message: 'April is required' })
  @IsInt({ message: 'April must be a number' })
  @ApiProperty()
  april: number;

  @IsNotEmpty({ message: 'May is required' })
  @IsInt({ message: 'May must be a number' })
  @ApiProperty()
  may: number;

  @IsNotEmpty({ message: 'June is required' })
  @IsInt({ message: 'June must be a number' })
  @ApiProperty()
  june: number;

  @IsNotEmpty({ message: 'July is required' })
  @IsInt({ message: 'July must be a number' })
  @ApiProperty()
  july: number;

  @IsNotEmpty({ message: 'August is required' })
  @IsInt({ message: 'August must be a number' })
  @ApiProperty()
  august: number;

  @IsNotEmpty({ message: 'September is required' })
  @IsInt({ message: 'September must be a number' })
  @ApiProperty()
  september: number;

  @IsNotEmpty({ message: 'October is required' })
  @IsInt({ message: 'October must be a number' })
  @ApiProperty()
  october: number;

  @IsNotEmpty({ message: 'November is required' })
  @IsInt({ message: 'November must be a number' })
  @ApiProperty()
  november: number;

  @IsNotEmpty({ message: 'December is required' })
  @IsInt({ message: 'December must be a number' })
  @ApiProperty()
  december: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}

export class UpdateMonthlyGoalsDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  procedure_type: bigint;

  @IsNotEmpty({ message: 'Collection Operation IDs must not be empty' })
  @ArrayNotEmpty({
    message: 'Collection Operation IDs array must not be empty',
  })
  @IsIntegerArray({
    message: 'Each Collection Operation Id must be an integer',
  })
  @ApiProperty()
  collection_operation: number[];

  @IsInt()
  @IsOptional()
  @ApiProperty()
  donor_center: bigint;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  recruiter: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'year is required' })
  @IsInt({ message: 'year must be a number' })
  year: number;

  @IsNotEmpty({ message: 'January is required' })
  @IsInt({ message: 'January must be a number' })
  @ApiProperty()
  january: number;

  @IsNotEmpty({ message: 'February is required' })
  @IsInt({ message: 'February must be a number' })
  @ApiProperty()
  february: number;

  @IsNotEmpty({ message: 'March is required' })
  @IsInt({ message: 'March must be a number' })
  @ApiProperty()
  march: number;

  @IsNotEmpty({ message: 'April is required' })
  @IsInt({ message: 'April must be a number' })
  @ApiProperty()
  april: number;

  @IsNotEmpty({ message: 'May is required' })
  @IsInt({ message: 'May must be a number' })
  @ApiProperty()
  may: number;

  @IsNotEmpty({ message: 'June is required' })
  @IsInt({ message: 'June must be a number' })
  @ApiProperty()
  june: number;

  @IsNotEmpty({ message: 'July is required' })
  @IsInt({ message: 'July must be a number' })
  @ApiProperty()
  july: number;

  @IsNotEmpty({ message: 'August is required' })
  @IsInt({ message: 'August must be a number' })
  @ApiProperty()
  august: number;

  @IsNotEmpty({ message: 'September is required' })
  @IsInt({ message: 'September must be a number' })
  @ApiProperty()
  september: number;

  @IsNotEmpty({ message: 'October is required' })
  @IsInt({ message: 'October must be a number' })
  @ApiProperty()
  october: number;

  @IsNotEmpty({ message: 'November is required' })
  @IsInt({ message: 'November must be a number' })
  @ApiProperty()
  november: number;

  @IsNotEmpty({ message: 'December is required' })
  @IsInt({ message: 'December must be a number' })
  @ApiProperty()
  december: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}
