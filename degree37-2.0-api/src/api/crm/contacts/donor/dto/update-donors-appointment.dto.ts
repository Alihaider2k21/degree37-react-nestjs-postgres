import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsBoolean } from 'class-validator';

export class updateDonorAppointmentDto {
  @IsInt()
  @IsNotEmpty({ message: 'Procedure type id is required' })
  @ApiProperty()
  procedure_type_id: bigint;

  @IsInt()
  @IsNotEmpty({ message: 'Slot id is required' })
  @ApiProperty()
  slot_id: bigint;

  @IsNotEmpty({ message: 'Note should not be empty' })
  @IsString({ message: 'Note is required' })
  @ApiProperty()
  note: string;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  @ApiProperty()
  status: string;
}

export class cancelDonorAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  @ApiProperty()
  status: string;
}
