import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateRoomSizeDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;

  @IsBoolean()
  @ApiProperty()
  is_archived?: boolean;

  @ApiProperty({ type: () => 'bigint' })
  created_by?: bigint;

  @ApiProperty({ type: () => 'bigint' })
  updated_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: boolean;
}
