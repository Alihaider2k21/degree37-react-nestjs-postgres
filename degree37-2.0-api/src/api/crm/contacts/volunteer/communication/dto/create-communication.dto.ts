import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  communication_message_type_enum,
  communication_status_enum,
  type_enum,
} from '../enum/communication.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateCommunicationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'communicationable_id is required' })
  communicationable_id: bigint;

  @ApiProperty()
  @IsEnum(type_enum)
  @IsNotEmpty({ message: 'communicationable_type is required' })
  communicationable_type: type_enum;

  // @ApiProperty()
  // contact_id: bigint;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  @IsEnum(communication_message_type_enum)
  message_type: communication_message_type_enum;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message_text: string;

  @ApiProperty()
  template_id: bigint;

  @ApiProperty()
  @IsEnum(communication_status_enum)
  status: communication_status_enum;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
