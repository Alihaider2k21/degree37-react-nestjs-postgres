import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { templateType } from '../enums/template-type.enum';
import { CreateEmailTemplateDto } from './create-email-template.dto';

export class UpdateEmailTemplateDto extends PartialType(
  CreateEmailTemplateDto
) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: () => BigInt })
  templateId: bigint;

  @IsEnum(templateType)
  @IsNotEmpty()
  @ApiProperty({ enum: templateType })
  templateType: templateType;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: () => String })
  subject: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: () => String })
  content: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  isActive: boolean;
}
