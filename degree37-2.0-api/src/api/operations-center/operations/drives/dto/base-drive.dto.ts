import {
  IsNotEmpty,
  IsInt,
  IsDate,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class BaseDriveDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  id: bigint;

  @IsNotEmpty({ message: 'Drive date should not be empty' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({
    message: 'Drive date must be a valid date in the format DD-MM-YYYY',
  })
  @ApiProperty({
    type: String,
    format: 'date',
    example: '2023-08-01',
  })
  date: Date;

  @IsNotEmpty({ message: 'OEF Products value is required' })
  @IsInt({ message: 'OEF Products must be an integer number' })
  @ApiProperty()
  oef_products: number;

  @IsNotEmpty({ message: 'OEF Procedures value is required' })
  @IsInt({ message: 'OEF Products must be an integer number' })
  @ApiProperty()
  oef_procedures: number;

  @IsNotEmpty({ message: 'Miles value is required' })
  @IsInt({ message: 'Miles must be an integer number' })
  @ApiProperty()
  miles: number;

  @IsNotEmpty({ message: 'Minutes value is required' })
  @IsInt({ message: 'Minutes must be an integer number' })
  @ApiProperty()
  minutes: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  is_multi_day_drive: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  online_scheduling_allowed: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  tele_recruitment_enabled: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  email_enabled: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  sms_enabled: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  tele_recruitment_status: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  email_status: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  sms_status: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  is_linked: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  is_linkable: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  is_archived: boolean;

  @IsNotEmpty({ message: 'Created by should not be empty' })
  @IsInt({ message: 'Created by must be an integer number' })
  @IsOptional()
  @ApiProperty()
  created_by: bigint;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  tenant_id: bigint;

  // TODO : Add the following elements in DTO
  // contacts: contactsDto[];
  // shifts: shiftDto[];
  // open_to_public: boolean;
  // equipments: driveEquipmentsDto[];
  // certifications: certificationDto[];
  // marketing: driveMarketingBaseDto;
  // donor_communication: supplementalRecruitmentDto;
  // approval_status: approvalStatusEnum;
}
