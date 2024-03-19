import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailTemplateInterface {
  subject: string;
  content: string;
  templateId: bigint;
  isActive: boolean;
  templateType: string;
}

export class GetEmailTemplateInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;
}

export class GetSingleEmailInterface {
  @IsNotEmpty()
  id: bigint;
}
