import { ApiProperty } from '@nestjs/swagger';
import { LocationTypeEnum, OperationTypeEnum } from '../enum/type';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateStaff_Dto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'short name is required' })
  @ApiProperty()
  short_name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'number of beds is required' })
  @ApiProperty()
  beds: number;

  @IsNumber()
  @IsNotEmpty({ message: 'number of concurrent beds is required' })
  @ApiProperty()
  concurrent_beds: number;

  @IsNumber()
  @IsNotEmpty({ message: 'number of stagger slots is required' })
  @ApiProperty()
  stagger_slots: number;

  @IsNumber()
  @IsNotEmpty({ message: 'procedure type is required' })
  @ApiProperty()
  procedure_type_id: bigint | any;

  @IsNumber()
  @IsNotEmpty({ message: 'operation type is required' })
  @ApiProperty()
  opeartion_type_id: OperationTypeEnum;

  @IsNumber()
  @IsNotEmpty({ message: 'location type is required' })
  @ApiProperty()
  location_type_id: LocationTypeEnum;
}
