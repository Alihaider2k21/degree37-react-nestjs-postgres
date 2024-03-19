import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from '../../../../common/entities/generic-history.entity';

@Entity()
export class AssertionCodesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  bbcs_uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
