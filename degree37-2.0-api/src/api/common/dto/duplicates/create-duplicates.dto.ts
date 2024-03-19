import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDuplicateDto {
  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Record is required' })
  record_id: bigint;

  @ApiPropertyOptional({ type: 'boolean', default: false })
  @IsBoolean({ message: 'Resolved should be a boolean' })
  @IsOptional()
  is_resolved: boolean;
}
