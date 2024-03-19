import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AccountAffiliationsDto {
  @ApiProperty()
  allAffiliations: [string];

  deleteAffiliations: [string];

  @IsOptional()
  closeout_date: Date;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
