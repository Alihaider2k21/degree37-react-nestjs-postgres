import { ApiProperty } from '@nestjs/swagger';

export class ArchiveTaskManagementDto {
  @ApiProperty({ type: Boolean })
  is_archive: boolean;
}
