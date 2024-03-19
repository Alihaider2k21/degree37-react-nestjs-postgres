import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetMonthlyCalenderInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  organization_level_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operation_status_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  procedure_type_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  product_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  month?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  year?: number;
}
