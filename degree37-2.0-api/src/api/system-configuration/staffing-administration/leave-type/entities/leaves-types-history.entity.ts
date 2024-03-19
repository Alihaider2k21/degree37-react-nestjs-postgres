import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class LeavesTypesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  short_description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
