import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity('account_preferences_history')
export class AccountPreferencesHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  staff_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  account_id: bigint;

  @Column({ type: 'int', nullable: false })
  preference: number;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: null,
    nullable: true,
  })
  assigned_date: Date;

  @Column({ nullable: false, default: true })
  is_active: boolean;
}
