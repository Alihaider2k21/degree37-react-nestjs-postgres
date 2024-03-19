import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';

export class GetContactPreferenceInterface {
  @IsNotEmpty({ message: 'Contact preferenceable id is required' })
  @ApiProperty()
  preference_id: bigint;

  @IsString()
  @IsNotEmpty({ message: 'PolymorphicType is required' })
  @ApiProperty()
  type_name: PolymorphicType;
}
