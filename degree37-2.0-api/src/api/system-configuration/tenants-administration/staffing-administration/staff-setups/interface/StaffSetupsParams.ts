import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LocationTypeEnum, OperationTypeEnum } from '../enum/type';

export class GetStaffSetupsParamsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 1 })
  page: number | 1;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 10 })
  limit?: number | 10;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operation_type?: OperationTypeEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  location_type?: LocationTypeEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: [
      'name',
      'short_name',
      'beds',
      'concurrent_beds',
      'stagger_slots',
      'procedure_type_id',
      'procedure_type_id.name',
      'opeartion_type_id',
      'location_type_id',
      'is_active',
    ],
  })
  sortName?: string;
}

export class GetStaffSetupsDriveParamsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operation_type?: OperationTypeEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  location_type?: LocationTypeEnum;

  @IsNotEmpty({ message: 'Procedure Type is required' })
  @IsString()
  @ApiProperty()
  procedure_type_id: bigint;

  @IsNotEmpty({ message: 'Collection Operation is required' })
  @IsString()
  @ApiProperty()
  collectionOperation: bigint;

  @IsNotEmpty({ message: 'Minimum Staff Amount is required' })
  @IsString()
  @ApiProperty()
  minStaff: number;

  @IsNotEmpty({ message: 'Maximum Staff Amount is required' })
  @IsString()
  @ApiProperty()
  maxStaff: number;

  @ApiProperty({ required: true })
  @IsString()
  drive_date: string;
}

export class GetStaffSetupsBluePrintParamsInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operation_type?: OperationTypeEnum;

  @IsNotEmpty({ message: 'Procedure Type is required' })
  @IsString()
  @ApiProperty()
  procedure_type_id: bigint;

  @IsNotEmpty({ message: 'Minimum Staff Amount is required' })
  @IsString()
  @ApiProperty()
  minStaff: number;

  @IsNotEmpty({ message: 'Maximum Staff Amount is required' })
  @IsString()
  @ApiProperty()
  maxStaff: number;
}

export class GetStaffSetupsByIdsInterface {
  @IsNotEmpty({ message: 'Staff setup Ids are required.' })
  @ApiProperty()
  ids: string;
}

export class GetUserId {
  @ApiProperty({ type: () => 'bigint' })
  created_by?: bigint;
}
