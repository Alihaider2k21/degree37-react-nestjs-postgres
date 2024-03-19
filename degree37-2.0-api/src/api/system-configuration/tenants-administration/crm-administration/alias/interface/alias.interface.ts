import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { TypeEnum } from '../dto/create-alias.dto';

export class GetAliasInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  type?: TypeEnum;
}
