import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';

@Entity()
export class StaffingClassificationHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_description: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
