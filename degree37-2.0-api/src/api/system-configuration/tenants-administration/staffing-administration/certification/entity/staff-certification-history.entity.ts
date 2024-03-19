import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class StaffCertificationHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  staff_id: bigint;

  @Column({ type: 'bigint' })
  certificate_id: bigint;

  @Column({ type: 'date' })
  certificate_start_date: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
