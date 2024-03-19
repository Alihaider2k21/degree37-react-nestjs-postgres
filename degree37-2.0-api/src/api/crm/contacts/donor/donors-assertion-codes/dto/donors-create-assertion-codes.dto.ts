import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateDonorAssertionCodeDto {
  @IsNumber()
  @IsNotEmpty()
  donor_id: bigint;

  @IsNumber()
  @IsNotEmpty()
  assertion_code_id: bigint;

  @IsString({ message: 'Start Date must be a string.' })
  @IsNotEmpty({ message: 'Start Date is required' })
  start_date: string;

  @IsString({ message: 'End Date must be a string.' })
  @IsOptional()
  end_date: string;
}
