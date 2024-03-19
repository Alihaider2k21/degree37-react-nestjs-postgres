import { ApiProperty } from '@nestjs/swagger';
import { resourceTypeEnum } from '../enums/recent-activity.enum';
import { IsEnum } from 'class-validator';

export class CreateActivityLogDto {
  @ApiProperty()
  resource_id: bigint;

  @ApiProperty()
  @IsEnum(resourceTypeEnum)
  resource_type: resourceTypeEnum;

  // @ApiProperty()
  // user_id: bigint;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  date: string;
}
