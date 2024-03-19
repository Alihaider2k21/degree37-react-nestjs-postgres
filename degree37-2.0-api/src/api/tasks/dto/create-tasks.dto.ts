import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { taskable_type_enum } from '../enum/tasks.enum';

export class TasksDto {
  @IsNotEmpty({ message: 'Assigned to value is required' })
  @IsInt({ message: 'Assigned to must be an integer number' })
  @ApiProperty()
  assigned_to: bigint;

  @IsNotEmpty({ message: 'Assigned by value is required' })
  @IsInt({ message: 'Assigned by must be an integer number' })
  @ApiProperty()
  assigned_by: bigint;

  @IsNotEmpty({ message: 'Task name is required' })
  @IsString()
  @ApiProperty()
  task_name: string;

  @IsNotEmpty({ message: 'Task description is required' })
  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Due date should not be empty' })
  @ApiProperty({
    type: String,
    format: 'date',
    example: '03/26/2023',
  })
  due_date: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'Status should not be empty' })
  @ApiProperty({ required: false, enum: [1, 2, 3, 4, 5] })
  status?: number;

  @ApiHideProperty()
  forbidUnknownValues: true;
}
