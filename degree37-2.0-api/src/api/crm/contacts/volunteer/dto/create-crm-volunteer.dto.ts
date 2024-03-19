import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AddressDto, ContactDto } from '../../common/dto';
import { Type } from 'class-transformer';
import { AttachmentableType } from '../../common/enums';
import { customFiledsDto } from 'src/api/common/dto/customfield/custom-field.dto';

export class CreateCRMVolunteerDto {
  @IsOptional()
  @IsInt({ message: 'Prefix Id must be a number' })
  @ApiProperty({ default: null })
  prefix_id: number;

  @IsOptional()
  @IsInt({ message: 'Suffix Id must be a number' })
  @ApiProperty({ default: null })
  suffix_id: number;

  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString({ message: 'Employee must be a string' })
  @ApiProperty()
  employee: string;

  @IsOptional()
  @IsString({ message: 'Nick Name must be a string' })
  @ApiProperty()
  nick_name: string;

  @IsNotEmpty({ message: 'First Name is required' })
  @IsString({ message: 'Fist Name must be a string' })
  @ApiProperty()
  first_name: string;

  @IsNotEmpty({ message: 'Last Name is required' })
  @IsString({ message: 'Last Name must be a string' })
  @ApiProperty()
  last_name: string;

  @IsNotEmpty({ message: 'Date of Birth is required' })
  @IsString({ message: 'Date of Birth must be a Date' })
  @ApiProperty()
  birth_date: Date;

  @IsOptional()
  @IsBoolean({ message: 'Is Archive must be a Boolean' })
  @ApiProperty({ default: false })
  is_archived: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Is Active must be a Boolean' })
  @ApiProperty({ default: true })
  is_active: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;

  @ApiProperty({ type: () => AddressDto })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ type: () => [ContactDto] })
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contact: ContactDto[];

  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  custom_fields: customFiledsDto;
}

export class UpdateCRMVolunteerDto extends PartialType(CreateCRMVolunteerDto) {}
