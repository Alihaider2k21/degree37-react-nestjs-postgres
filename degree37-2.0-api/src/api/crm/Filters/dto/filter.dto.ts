import { PartialType } from '@nestjs/mapped-types';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { isString } from 'lodash';

export class FilterDto {
  @IsNotEmpty({ message: 'filter_Array is required' })
  @ApiProperty()
  filter_Array: string[];

  @IsNotEmpty({ message: 'application_code is required' })
  @IsString({ message: 'application_code should be a string' })
  @ApiProperty()
  application_code: string;

  @IsNotEmpty({ message: 'Filter Name  is required' })
  @IsString({ message: 'Filter Name should be a string' })
  @ApiProperty()
  filter_name: string;
}
