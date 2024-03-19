import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ArchiveRoleInterface {
  @IsBoolean({ message: 'is_archived must have a boolean value' })
  @ApiProperty({ required: true })
  is_archived: boolean;
}
