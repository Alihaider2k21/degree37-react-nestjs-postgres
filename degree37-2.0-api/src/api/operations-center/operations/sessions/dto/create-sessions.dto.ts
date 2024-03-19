import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CustomFieldsSessionsDto } from './create-custom-fields.dto';
import { ShiftsDto } from 'src/api/shifts/dto/shifts.dto';

export class CreateSessionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Session date should not be empty' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  promotion_ids?: number[];

  @ApiProperty()
  @IsInt({ message: 'Donor Center should be a number' })
  @IsNotEmpty({ message: 'Donor Center should not be empty' })
  donor_center_id: number;

  @ApiProperty()
  @IsInt({ message: 'Collection Operation should be a number' })
  @IsNotEmpty({ message: 'Collection Operation should not be empty' })
  collection_operation_id: number;

  @ApiProperty()
  @IsInt({ message: 'Status should be a number' })
  @IsNotEmpty({ message: 'Status should not be empty' })
  status_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  custom_fields?: CustomFieldsSessionsDto;

  @ApiProperty({ type: [ShiftsDto] })
  @IsArray()
  shifts: ShiftsDto[];

  @ApiPropertyOptional()
  @IsOptional()
  slots?: object;
}
