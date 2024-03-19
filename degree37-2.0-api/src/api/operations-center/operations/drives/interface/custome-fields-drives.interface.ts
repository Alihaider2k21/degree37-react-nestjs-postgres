// import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

// export class customFieldDrivesDto {
//   @ApiProperty()
//   field_id: bigint;

//   @ApiProperty()
//   field_data: string;
// }
// export class CreateCustomFieldDrivesDto {
//   @ApiProperty({ type: () => [customFieldDrivesDto] })
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => customFieldDrivesDto)
//   fields_data: customFieldDrivesDto[];

//   //   @ApiProperty()
//   //   @IsNotEmpty()
//   //   custom_field_datable_id: bigint;

//   @ApiProperty()
//   @IsNotEmpty()
//   custom_field_datable_type: string;
// }
