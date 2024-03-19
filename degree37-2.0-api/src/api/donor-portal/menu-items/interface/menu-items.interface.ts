import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MenuItemsInterface {
  title: string;
  url: string;
  is_protected: boolean;
  parent_id: boolean;
  client_id: string;
  navigation_type: string;
}

export class GetMenuItemsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;
}

export class GetSingleMenuItemInterface {
  @IsNotEmpty()
  id: bigint;
}
