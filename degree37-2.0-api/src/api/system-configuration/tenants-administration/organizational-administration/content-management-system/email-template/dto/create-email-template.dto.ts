import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { templateType } from '../../../../../../admin/email-template/enums/template-type.enum';

export class CreateEmailTemplateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: () => BigInt })
  templateId: bigint;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  subject: string;

  @IsEnum(templateType)
  @IsNotEmpty()
  @ApiProperty({ enum: templateType })
  type: templateType;

  @IsBoolean()
  @ApiProperty({ type: () => Boolean })
  status: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  variables: string;
}
