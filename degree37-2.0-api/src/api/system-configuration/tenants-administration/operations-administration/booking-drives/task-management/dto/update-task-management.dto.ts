import { PartialType } from '@nestjs/swagger';
import { CreateTaskManagementDto } from './create-task-management.dto';

export class UpdateTaskManagementDto extends PartialType(
  CreateTaskManagementDto
) {}
