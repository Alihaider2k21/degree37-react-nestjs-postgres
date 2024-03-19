import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ResolveDuplicateDto {
  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  record_id?: bigint;
}
