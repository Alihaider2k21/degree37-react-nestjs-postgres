import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDate,
  MaxLength,
  IsArray,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Team Name must not exceed 50 characters' })
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10, { message: 'Short Description must not exceed 10 characters' })
  @ApiProperty()
  short_description: string;

  @IsArray()
  @ApiProperty()
  collection_operation_id: bigint[];

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_by?: bigint;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class AssignMembersDto {
  @IsArray()
  @ApiProperty({ type: [Number] })
  staff_ids: number[];

  @IsInt()
  @ApiProperty({ type: Number })
  team_id: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number })
  created_by?: number;
}

export class RemoveMembersDto {
  @IsArray()
  @ApiProperty({ type: Number })
  staff_id: number;

  @IsInt()
  @ApiProperty({ type: Number })
  team_id: number;
}
