import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssertionCodeDto {
  @IsString({ message: 'BBCS UUID must be a string' })
  @IsNotEmpty({ message: 'BBCS UUID is required' })
  bbcs_uuid: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
