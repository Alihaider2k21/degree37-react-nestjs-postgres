import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsObject,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateDailyGoalsCalendarDto {
  @IsInt({ message: 'Collection Operation is required' })
  @IsNotEmpty({ message: 'Collection Operation is required' })
  @ApiProperty()
  collectionOperation: bigint;

  @IsInt({ message: 'Procedure Type is required' })
  @IsNotEmpty({ message: 'Procedure Type is required' })
  @ApiProperty()
  procedureType: bigint;

  @IsInt({ message: 'Year is required' })
  @IsNotEmpty({ message: 'Year is required' })
  @ApiProperty()
  year: number;

  @IsInt({ message: 'Diffrence is required' })
  @IsNotEmpty({ message: 'Diffrence is required' })
  @ApiProperty()
  diffrence: number;

  @IsInt({ message: 'Month is required' })
  @IsNotEmpty({ message: 'Month is required' })
  @ApiProperty()
  month: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is Locked is required' })
  @IsBoolean({ message: 'Is Locked must be a boolean value' })
  isLocked: boolean;

  @IsNotEmpty({ message: 'Days values are required' })
  @IsObject({ message: 'Days values are required' })
  daysValues: Record<string, any>;

  @IsString({ message: 'Allocate Diffrence Over is required' })
  @IsNotEmpty({ message: 'Allocate Diffrence Over is required' })
  @ApiProperty()
  allocatedDiffrenceOver: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;
}
