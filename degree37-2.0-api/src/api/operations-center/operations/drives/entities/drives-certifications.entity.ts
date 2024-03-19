import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Drives } from './drives.entity';
import { Certification } from 'src/api/system-configuration/tenants-administration/staffing-administration/certification/entity/certification.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity('drives_certifications')
export class DrivesCertifications extends GenericEntity {
  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'drive_id' })
  drive: Drives;

  @Column({ type: 'int', nullable: false, primary: true })
  drive_id: bigint;

  @ManyToOne(() => Certification, (certification) => certification.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'certification_id' })
  certification: Certification;

  @Column({ type: 'int', nullable: false, primary: true })
  certification_id: bigint;
}
