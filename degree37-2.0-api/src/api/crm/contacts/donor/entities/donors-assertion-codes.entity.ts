import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Donors } from './donors.entity';
import { AssertionCodes } from './assertion-codes.entity';

@Entity()
export class DonorsAssertionCodes extends GenericEntity {
  @ManyToOne(() => Donors, (donors) => donors.id, { nullable: false })
  @JoinColumn({ name: 'donor_id' })
  @Column({ type: 'bigint', nullable: false })
  donor_id: bigint;

  @ManyToOne(() => AssertionCodes, (assertionCodes) => assertionCodes.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'assertion_code_id' })
  @Column({ type: 'bigint', nullable: false })
  assertion_code_id: bigint;

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

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
