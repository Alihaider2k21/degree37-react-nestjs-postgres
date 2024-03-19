import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateMenuItemsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: () => String })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  is_protected: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  parent_id: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  navigation_type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  client_id: string;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class UpdateMenuItemsDto extends PartialType(CreateMenuItemsDto) {
  @IsString()
  @ApiProperty({ type: () => String })
  title: string;

  @IsString()
  @ApiProperty()
  url: string;

  @IsBoolean()
  @ApiProperty()
  is_protected: boolean;

  @IsBoolean()
  @ApiProperty()
  parent_id: boolean;

  @IsString()
  @ApiProperty()
  navigation_type: string;

  @IsString()
  @ApiProperty()
  client_id: string;

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;
}
