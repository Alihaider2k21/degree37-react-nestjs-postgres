import { Entity, Column } from 'typeorm';
import { ApprovalStatusEnum } from '../../drives/enums';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('sessions_history')
export class SessionsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  tenant_id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'bigint' })
  donor_center_id: number;

  @Column({ type: 'bigint' })
  operation_status_id: number;

  @Column({ type: 'bigint' })
  collection_operation_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  oef_products: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  oef_procedures: number;

  @Column({ type: 'enum', enum: ApprovalStatusEnum })
  approval_status: ApprovalStatusEnum;
}
