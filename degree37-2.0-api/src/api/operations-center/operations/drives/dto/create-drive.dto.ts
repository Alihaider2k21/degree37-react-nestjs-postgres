import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ShiftSlotsDto, ShiftsDto } from 'src/api/shifts/dto/shifts.dto';
import { CreateDonorAppointmentDto } from 'src/api/crm/contacts/donor/dto/create-donors-appointment.dto';

export class DriveContact {
  accounts_contacts_id: bigint;
  role_id: bigint;
}

export class DriveEquipment {
  equipment_id: bigint;
  quantity: number;
}

export class DriveMaterialItemDTO {
  marketing_material_id: number;
  quantity: number;
}

export class customFieldDrivesDto {
  @ApiProperty()
  field_id: bigint;

  @ApiProperty()
  field_data: string;
}

export class customFiledsDto {
  @ApiProperty({ type: () => [customFieldDrivesDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => customFieldDrivesDto)
  fields_data: customFieldDrivesDto[];

  @ApiProperty()
  @IsOptional()
  custom_field_datable_type: string;
}

export class DriveMarketingBaseDto {
  marketing_start_date: Date;
  marketing_start_time: Date;
  marketing_end_date: Date;
  marketing_end_time: Date;
  instructional_info: string;
  donor_info: string;
  order_due_date: Date;
}

export class DriveMaterialItemInputDto {
  marketing_material_id: bigint;
  quantity: number;
}

export class DriveMarketingInputDto extends DriveMarketingBaseDto {
  marketing_materials: DriveMaterialItemInputDto[];
  promotional_items: DrivePromotionalItemDto[];
}

export class DrivePromotionalItemDto {
  promotional_item_id: bigint;
  quantity: number;
}

export class SupplementalRecruitmentDto {
  account_ids: Array<bigint>;
}

export class CreateDriveDto {
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

  @IsInt({ message: 'Account must be an integer number' })
  @IsNotEmpty({ message: 'Account should not be empty' })
  @ApiProperty()
  account_id: bigint;

  @IsBoolean({ message: 'is_linked must be a boolean' })
  @ApiProperty()
  is_linked: boolean;

  @IsBoolean({ message: 'is_linkable must be a boolean' })
  @ApiProperty()
  is_linkable: boolean;

  @ApiProperty()
  account: any;

  @IsInt({ message: 'Location must be an integer number' })
  @IsNotEmpty({ message: 'Location should not be empty' })
  @ApiProperty()
  location_id: bigint;

  @IsInt({ message: 'Promotion must be an integer number' })
  @IsNotEmpty({ message: 'Promotion should not be empty' })
  @ApiProperty()
  promotion_id: bigint;

  @IsInt({ message: 'Recruiter must be an integer number' })
  @IsNotEmpty({ message: 'Recruiter should not be empty' })
  @ApiProperty()
  recruiter_id: bigint;

  @IsInt({ message: 'Operation Status must be an integer number' })
  @IsNotEmpty({ message: 'Operation Status should not be empty' })
  @ApiProperty()
  operations_status_id: bigint;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  is_multi_day_drive: boolean;

  @IsOptional()
  @IsInt()
  created_by: any;

  @IsOptional()
  @IsInt()
  tenant_id: any;

  @ApiProperty({
    type: [DriveContact],
    example: [{ accounts_contacts_id: 1, role_id: 1 }],
  })
  @IsArray()
  contacts: DriveContact[];

  @ApiProperty({
    type: [ShiftsDto],
  })
  @IsArray()
  shifts: ShiftsDto[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  open_to_public: boolean;

  @ApiProperty({
    type: [DriveEquipment],
    example: [{ equipment_id: 1, quantity: 1 }],
  })
  @IsArray()
  equipment: DriveEquipment[];

  @ApiProperty({
    type: Array<bigint>,
    example: [1, 2],
  })
  @IsArray()
  certifications: Array<bigint>;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  online_scheduling_allowed: boolean;

  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  custom_fields: customFiledsDto;

  @ApiProperty({
    type: DriveMarketingInputDto,
    example: {
      marketing_materials: { marketing_material_id: 1, quantity: 1 },
      promotional_items: { promotional_item_id: 1, quantity: 1 },
      marketing_start_date: new Date(),
      marketing_start_time: new Date(),
      marketing_end_date: new Date(),
      marketing_end_time: new Date(),
      instructional_info: '',
      donor_info: '',
      order_due_date: new Date(),
    },
  })
  marketing: DriveMarketingInputDto;

  @ApiProperty({
    type: SupplementalRecruitmentDto,
    example: [1, 2, 3],
  })
  donor_communication: SupplementalRecruitmentDto;

  @ApiProperty({
    type: Array<string>,
    example: ['12345'],
  })
  @IsArray()
  zip_codes: Array<string>;

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
}

export class CreateDonorAppointment {
  @ApiProperty({ type: [CreateDonorAppointmentDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateDonorAppointmentDto)
  @IsArray()
  donor_appointment: CreateDonorAppointmentDto[];
}

export class UpdateDriveDto {
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

  @IsInt({ message: 'Account must be an integer number' })
  @IsNotEmpty({ message: 'Account should not be empty' })
  @ApiProperty()
  account_id: bigint;

  @IsBoolean({ message: 'is_linked must be a boolean' })
  @ApiProperty()
  is_linked: boolean;

  @IsBoolean({ message: 'is_linkable must be a boolean' })
  @ApiProperty()
  is_linkable: boolean;

  @ApiProperty()
  account: any;

  @IsInt({ message: 'Location must be an integer number' })
  @IsNotEmpty({ message: 'Location should not be empty' })
  @ApiProperty()
  location_id: bigint;

  @IsInt({ message: 'Promotion must be an integer number' })
  @IsNotEmpty({ message: 'Promotion should not be empty' })
  @ApiProperty()
  promotion_id: bigint;

  @IsInt({ message: 'Recruiter must be an integer number' })
  @IsNotEmpty({ message: 'Recruiter should not be empty' })
  @ApiProperty()
  recruiter_id: bigint;

  @IsInt({ message: 'Operation Status must be an integer number' })
  @IsNotEmpty({ message: 'Operation Status should not be empty' })
  @ApiProperty()
  operations_status_id: bigint;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  is_multi_day_drive: boolean;

  @IsOptional()
  @IsInt()
  created_by: any;

  @IsOptional()
  @IsInt()
  tenant_id: any;

  @ApiProperty({
    type: [DriveContact],
    example: [{ accounts_contacts_id: 1, role_id: 1 }],
  })
  @IsArray()
  contacts: DriveContact[];

  @ApiProperty({
    type: [ShiftsDto],
  })
  @IsArray()
  shifts: ShiftsDto[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  open_to_public: boolean;

  @ApiProperty({
    type: [DriveEquipment],
    example: [{ equipment_id: 1, quantity: 1 }],
  })
  @IsArray()
  equipment: DriveEquipment[];

  @ApiProperty({
    type: Array<bigint>,
    example: [1, 2],
  })
  @IsArray()
  certifications: Array<bigint>;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  online_scheduling_allowed: boolean;

  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  custom_fields: customFiledsDto;

  @ApiProperty({
    type: DriveMarketingInputDto,
    example: {
      marketing_materials: { marketing_material_id: 1, quantity: 1 },
      promotional_items: { promotional_item_id: 1, quantity: 1 },
      marketing_start_date: new Date(),
      marketing_start_time: new Date(),
      marketing_end_date: new Date(),
      marketing_end_time: new Date(),
      instructional_info: '',
      donor_info: '',
      order_due_date: new Date(),
    },
  })
  marketing: DriveMarketingInputDto;

  @ApiProperty({
    type: SupplementalRecruitmentDto,
    example: [1, 2, 3],
  })
  donor_communication: SupplementalRecruitmentDto;

  @ApiProperty({
    type: Array<string>,
    example: ['12345'],
  })
  @IsArray()
  zip_codes: Array<string>;

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

  @IsOptional()
  slots: ShiftSlotsDto;
}
