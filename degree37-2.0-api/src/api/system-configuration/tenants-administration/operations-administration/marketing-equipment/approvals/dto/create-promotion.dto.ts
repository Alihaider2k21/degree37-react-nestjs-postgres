import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAprovalsDto {
  @ApiProperty()
  @IsBoolean()
  promotional_items: boolean;

  @ApiProperty()
  @IsBoolean()
  marketing_materials: boolean;

  @ApiProperty()
  @IsBoolean()
  tele_recruitment: boolean;

  @ApiProperty()
  @IsBoolean()
  email: boolean;

  @ApiProperty()
  @IsBoolean()
  sms_texting: boolean;
}
