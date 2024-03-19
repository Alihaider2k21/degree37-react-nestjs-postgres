import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class DeviceShareDto {
  @IsString()
  @IsNotEmpty({ message: 'Start date should not be empty' })
  @ApiProperty()
  start_date: string;

  @IsString()
  @IsNotEmpty({ message: 'End date should not be empty' })
  @ApiProperty()
  end_date: string;

  @IsInt({ message: 'Collection Operation must be an integer number' })
  @IsNotEmpty({ message: 'Share from is required' })
  @ApiProperty()
  from: bigint;

  @IsInt({ message: 'Collection Operation must be an integer number' })
  @IsNotEmpty({ message: 'Share to is required' })
  @ApiProperty()
  to: bigint;

  @IsNotEmpty({ message: 'Created By should not be empty' })
  @IsInt({ message: 'Created By must be an integer number' })
  @ApiProperty()
  created_by: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
