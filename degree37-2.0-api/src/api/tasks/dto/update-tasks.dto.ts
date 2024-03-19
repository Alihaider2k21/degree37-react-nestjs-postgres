import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class UpdateTasksDto {
  @IsOptional()
  @IsInt({ message: 'Assigned to must be an integer number' })
  @ApiProperty()
  assigned_to: bigint;

  @IsOptional()
  @IsInt({ message: 'Assigned by must be an integer number' })
  @ApiProperty()
  assigned_by: bigint;

  @IsOptional()
  @IsString()
  @ApiProperty()
  task_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    format: 'date',
    example: '03/26/2023',
  })
  due_date: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, enum: [1, 2, 3, 4, 5] })
  status?: number;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
