import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateStageDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Stage name is required' })
  @IsString({ message: 'Stage name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Stage description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  @IsNotEmpty({ message: 'User not authenticated' })
  created_by: bigint;
}

export class UpdateStageDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Stage name is required' })
  @IsString({ message: 'Stage name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Stage description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Is active is required' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean;
}
