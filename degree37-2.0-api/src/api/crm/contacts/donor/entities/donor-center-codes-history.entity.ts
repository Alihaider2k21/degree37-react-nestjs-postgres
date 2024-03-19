import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class DonorCenterCodesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: true })
  donor_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  center_code_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  start_date: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;
}
