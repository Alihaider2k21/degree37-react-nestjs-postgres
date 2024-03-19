import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

export class CreateGoalVarianceDto {
  @IsNotEmpty({ message: 'Over Goal is required' })
  @IsInt({ message: 'Over Goal must be a number' })
  @ApiProperty()
  over_goal: number;

  @IsNotEmpty({ message: 'Maximum OEF is required' })
  @IsInt({ message: 'Maximum OEF must be a number' })
  @ApiProperty()
  under_goal: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  created_by: bigint;
}

export class UpdateGoalVarianceDto extends PartialType(CreateGoalVarianceDto) {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  updated_by: bigint;
}
