import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Donors } from './donors.entity';
import { Procedure } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/entities/procedure.entity';

@Entity('donors_eligibilities')
export class DonorsEligibilities extends GenericEntity {
  @ManyToOne(() => Donors, (donors) => donors.id, { nullable: false })
  @JoinColumn({ name: 'donor_id' })
  @Column({ type: 'bigint', nullable: false })
  donor_id: bigint;

  @ManyToOne(() => Procedure, (proc) => proc.id, { nullable: false })
  @JoinColumn({ name: 'donation_type' })
  @Column({ type: 'bigint', nullable: false })
  donation_type: number;

  @Column({ type: 'date', nullable: true })
  donation_date: Date;

  @Column({ type: 'date', nullable: true })
  next_eligibility_date: Date;

  @Column({ type: 'int', nullable: false })
  donation_ytd: number;

  @Column({ type: 'int', nullable: false })
  donation_ltd: number;

  @Column({ type: 'int', nullable: false })
  donation_last_year: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
