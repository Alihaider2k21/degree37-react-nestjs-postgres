import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Prospects } from './prospects.entity';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('prospects_communications_history')
export class ProspectsCommunicationsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  prospect_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'varchar', length: 500, nullable: false })
  message: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  message_type: string;

  @Column({ type: 'int', nullable: false })
  template_id: number;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  schedule_date: Date;
}
