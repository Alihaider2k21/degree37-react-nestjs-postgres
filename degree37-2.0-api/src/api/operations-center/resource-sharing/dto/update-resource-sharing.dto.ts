import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceSharingDto } from './create-resource-sharing.dto';

export class UpdateResourceSharingDto extends PartialType(
  CreateResourceSharingDto
) {}
