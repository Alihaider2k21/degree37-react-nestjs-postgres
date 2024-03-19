import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PolymorphicType } from '../../../../../common/enums/polymorphic-type.enum';

export class CreateContactPreferenceDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Contact preferenceable id is required' })
  @IsInt({ message: 'contact_preferenceable_id must be a bigint value' })
  contact_preferenceable_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'PolymorphicType is required' })
  @IsString({ message: 'PolymorphicType must be a PolymorphicType value' })
  contact_preferenceable_type: PolymorphicType;

  @ApiProperty()
  @IsOptional()
  next_call_date: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Opt Out Email is required' })
  @IsBoolean({ message: 'is_optout_email must be a boolean value' })
  is_optout_email: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Opt Out SMS is required' })
  @IsBoolean({ message: 'is_optout_email must be a boolean value' })
  is_optout_sms: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Opt Out Push is required' })
  @IsBoolean({ message: 'is_optout_email must be a boolean value' })
  is_optout_push: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'Opt Out Call is required' })
  @IsBoolean({ message: 'is_optout_email must be a boolean value' })
  is_optout_call: boolean;
}
