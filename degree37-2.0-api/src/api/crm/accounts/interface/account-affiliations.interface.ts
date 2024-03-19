import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllAccountAffiliationsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  is_current?: string;
}
