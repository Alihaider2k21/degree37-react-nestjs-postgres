import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity('account_contacts_history')
export class AccountContactsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  record_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  contactable_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  role_id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  contactable_type: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: null,
    nullable: true,
  })
  closeout_date: Date;
}
