import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { templateType } from '../enums/template-type.enum';

export class CreateEmailTemplateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: () => BigInt })
  templateId: bigint;

  @IsEnum(templateType)
  @IsNotEmpty()
  @ApiProperty({ enum: templateType })
  templateType: templateType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  subject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  content: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: () => Boolean })
  isActive: boolean;
}
