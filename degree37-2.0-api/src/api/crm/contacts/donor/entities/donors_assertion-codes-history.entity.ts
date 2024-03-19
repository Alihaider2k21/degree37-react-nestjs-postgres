import { Entity, Column } from 'typeorm';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericHistoryEntity } from '../../../../common/entities/generic-history.entity';

@Entity()
export class DonorsAssertionCodesHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  donor_id: string;

  @Column({ type: 'bigint', nullable: false })
  assertion_code_id: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  end_date: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
