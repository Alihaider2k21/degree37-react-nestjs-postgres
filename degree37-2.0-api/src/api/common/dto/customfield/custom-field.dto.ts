import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class customDto {
  @ApiProperty()
  field_id: bigint;

  @ApiProperty()
  field_data: string;
}

export class customFiledsDto {
  @ApiProperty({ type: () => [customDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => customDto)
  fields_data: customDto[];

  @ApiProperty()
  @IsOptional()
  custom_field_datable_type: string;
}
