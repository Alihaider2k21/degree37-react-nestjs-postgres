import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity('banners_history')
export class BannerHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'date', nullable: false })
  start_date: string;

  @Column({ type: 'date', nullable: false })
  end_date: string;

  @Column({ type: 'bigint', array: true, nullable: false })
  collection_operations: Array<bigint>;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
