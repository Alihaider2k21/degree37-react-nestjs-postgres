import { Column, Entity } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';

@Entity()
export class TerritoryHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  territory_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bigint', nullable: false })
  recruiter: bigint;

  @Column({ default: true, nullable: false })
  status: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
