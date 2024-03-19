import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetEmailTemplateDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: () => Number, default: 10 })
  to: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: () => Number, default: 0 })
  from: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: () => String, default: '' })
  search: string;
}
