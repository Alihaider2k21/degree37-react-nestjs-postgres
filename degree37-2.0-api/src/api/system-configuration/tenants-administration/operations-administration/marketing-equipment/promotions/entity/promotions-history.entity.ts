import { Entity, Column } from 'typeorm';

import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';

@Entity()
export class PromotionHistory extends GenericHistoryEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  donor_message: string;

  @Column({ type: 'date', nullable: false })
  start_date: string;

  @Column({ type: 'date', nullable: false })
  end_date: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'bigint', array: true, nullable: false })
  collection_operations: Array<bigint>;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
