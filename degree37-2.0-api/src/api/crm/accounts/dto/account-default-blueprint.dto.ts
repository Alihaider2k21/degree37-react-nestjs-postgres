import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class AccountDefaultBlueprintDto {
  @IsNotEmpty({ message: 'Account Id is required.' })
  @IsInt({ message: 'Account Id must be an integer number' })
  @ApiProperty()
  account_id: bigint;

  @IsNotEmpty({ message: 'Blueprint Id is required.' })
  @IsInt({ message: 'Blueprint Id must be an integer number' })
  @ApiProperty()
  blueprint_id: bigint;

  @IsOptional()
  @IsInt()
  created_by: any;

  @IsOptional()
  @IsInt()
  tenant_id: any;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
