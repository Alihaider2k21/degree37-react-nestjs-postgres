import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateDonorAppointmentDto {
  @IsInt()
  @IsNotEmpty({ message: 'Appointment id is required' })
  @ApiProperty()
  appointmentable_id: bigint;

  @IsInt()
  @IsNotEmpty({ message: 'Procedure type id is required' })
  @ApiProperty()
  procedure_type_id: bigint;

  @IsInt()
  @IsNotEmpty({ message: 'Slot id is required' })
  @ApiProperty()
  slot_id: bigint;

  @IsNotEmpty({ message: 'Donor id is required' })
  @ApiProperty()
  donor_id: bigint;

  @IsString()
  @IsNotEmpty({ message: 'Appointment type is required' })
  @ApiProperty()
  appointmentable_type: string;

  @IsNotEmpty({ message: 'Note should not be empty' })
  @IsString({ message: 'Note is required' })
  @ApiProperty()
  note: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: string;

  @IsOptional()
  @IsInt({ message: 'Created by must be an integer number' })
  @ApiProperty()
  created_by?: any;
}
