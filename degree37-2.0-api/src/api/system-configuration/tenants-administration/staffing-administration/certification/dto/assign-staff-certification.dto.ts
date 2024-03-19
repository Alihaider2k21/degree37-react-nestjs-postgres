import {
  IsArray,
  IsNotEmpty,
  ArrayNotEmpty,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignStaffCertificationDto {
  @ApiProperty()
  @IsArray({ message: 'Staff should be an array' })
  @ArrayNotEmpty({ message: 'Staff array should not be empty' })
  staff_ids: bigint[];

  @ApiProperty({ type: 'bigint' })
  @IsNotEmpty({ message: 'Certification is required' })
  certification_id: bigint;

  @ApiProperty({ type: 'date' })
  @IsDateString()
  @IsNotEmpty({ message: 'Start Date is required' })
  start_date: Date;
}
