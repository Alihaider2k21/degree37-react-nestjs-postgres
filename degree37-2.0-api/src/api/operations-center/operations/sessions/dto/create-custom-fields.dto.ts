import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CustomFieldsSessionsDto {
  @ApiPropertyOptional({ type: () => [CustomFieldDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDto)
  fields_data?: CustomFieldDto[];

  @ApiPropertyOptional()
  @IsOptional()
  custom_field_datable_type?: string;
}

export class CustomFieldDto {
  @ApiProperty()
  @IsInt()
  field_id: number;

  @ApiProperty()
  @IsString()
  field_data: string;
}
