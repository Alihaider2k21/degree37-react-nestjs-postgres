import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateStaffConfigDto {
  @IsNumber()
  @IsNotEmpty({ message: 'quantity is required' })
  @ApiProperty()
  qty: number;

  @IsNumber()
  @IsNotEmpty({ message: 'lead time is required' })
  @ApiProperty()
  lead_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'setup time is required' })
  @ApiProperty()
  setup_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'breakdown time is required' })
  @ApiProperty()
  breakdown_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'wrap up time is required' })
  @ApiProperty()
  wrapup_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'role is required' })
  @ApiProperty()
  role_id: bigint;
}

export class UpdateStaffConfigDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  id: bigint;

  @IsNumber()
  @IsNotEmpty({ message: 'quantity is required' })
  @ApiProperty()
  qty: number;

  @IsNumber()
  @IsNotEmpty({ message: 'lead time is required' })
  @ApiProperty()
  lead_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'setup time is required' })
  @ApiProperty()
  setup_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'breakdown time is required' })
  @ApiProperty()
  breakdown_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'wrap up time is required' })
  @ApiProperty()
  wrapup_time: number;

  @IsNumber()
  @IsNotEmpty({ message: 'role is required' })
  @ApiProperty()
  role_id: bigint;
}
