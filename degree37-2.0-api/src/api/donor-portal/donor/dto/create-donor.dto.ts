import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateDonorDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: () => String })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
