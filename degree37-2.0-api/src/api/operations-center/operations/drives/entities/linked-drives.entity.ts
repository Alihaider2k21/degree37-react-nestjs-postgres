import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Drives } from './drives.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity('linked_drives')
export class LinkedDrives extends GenericEntity {
  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'current_drive_id' })
  current_drive_id: bigint;

  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prospective_drive_id' })
  prospective_drive_id: bigint;
}
