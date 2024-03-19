import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Donors } from './donors.entity';
import { Facility } from '../../../../system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';

@Entity()
export class DonorCenterCodes extends GenericEntity {
  @ManyToOne(() => Donors, (donors) => donors.id, { nullable: false })
  @JoinColumn({ name: 'donor_id' })
  @Column({ type: 'bigint', nullable: false })
  donor_id: bigint;

  @ManyToOne(() => Facility, (facilities) => facilities.id, { nullable: false })
  @JoinColumn({ name: 'center_code_id' })
  @Column({ type: 'bigint', nullable: false })
  center_code_id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  start_date: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
