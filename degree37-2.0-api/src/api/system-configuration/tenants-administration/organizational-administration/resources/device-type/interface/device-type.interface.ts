import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ArchiveDeviceTypeInterface {
  @IsNotEmpty({ message: 'Id should not be empty' })
  // @IsInt({ message: 'Id must be an integer number' })
  @ApiProperty()
  id: bigint;

  @IsOptional()
  @IsBoolean({ message: 'Archive must be boolean' })
  @ApiProperty()
  is_archive: boolean;
}
export class GetAllDeviceTypesInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: string;
}
