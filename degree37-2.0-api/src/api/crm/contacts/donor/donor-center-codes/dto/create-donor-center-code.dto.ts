import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDonorCenterCodeDto {
  @IsNumber()
  @IsNotEmpty()
  donor_id: bigint;

  @IsNumber()
  @IsNotEmpty()
  center_code_id: bigint;

  @IsString({ message: 'Start Date must be a string.' })
  @IsNotEmpty({ message: 'Start Date is required' })
  start_date: string;
}
