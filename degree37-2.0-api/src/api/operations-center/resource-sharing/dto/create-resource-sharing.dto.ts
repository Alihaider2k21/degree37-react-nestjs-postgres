import {
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  Length,
  IsArray,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { resource_share_type_enum } from '../enum/resource-sharing.enum';

export class CreateResourceSharingDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'start date is required' })
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'end date is required' })
  end_date: Date;

  @ApiProperty()
  @IsEnum(resource_share_type_enum)
  share_type: resource_share_type_enum;

  @ApiProperty()
  @Min(1, { message: 'Quantity must be greater than or equal to 1' })
  @Max(1000, { message: 'Quantity must be less than or equal to 1000' })
  quantity: number;

  @ApiProperty()
  @Length(0, 500, { message: 'Description must be at most 500 characters' })
  description: string;

  @ApiProperty()
  @IsBoolean({ message: 'Is active must be a boolean value' })
  is_active: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'From collection operation is required' })
  from_collection_operation_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'To collection operation is required' })
  to_collection_operation_id: number;

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class ResourceFullfilmentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Resource share type id is required' })
  resource_share_id: bigint;

  @ApiProperty()
  @IsNotEmpty({ message: 'Share type id is required' })
  share_type_id: bigint;
}
export class AddResourceShareFullfilmentDto {
  @ApiProperty({
    type: [ResourceFullfilmentDto],
  })
  @IsArray()
  fullfilment_data: ResourceFullfilmentDto[];
}
