import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity('account_affiliations_history')
export class AccountAffilitaionsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  account_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  affiliation_id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: null,
    nullable: true,
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: null,
    nullable: true,
  })
  closeout_date: Date;
}
