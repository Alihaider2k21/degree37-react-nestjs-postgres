import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Drives } from './drives.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity('drives_zipcodes')
export class DrivesZipCodes extends GenericEntity {
  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'drive_id' })
  drive: Drives;

  @Column({ type: 'int', nullable: false, primary: true })
  drive_id: bigint;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zip_code: string;
}
