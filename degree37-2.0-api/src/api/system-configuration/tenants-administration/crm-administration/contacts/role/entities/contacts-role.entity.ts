import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
@Entity()
export class ContactsRoles extends GenericEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  short_name: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({ type: 'bigint', nullable: false })
  function_id: bigint;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  average_hourly_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  oef_contribution: number;

  @Column({ type: 'boolean' })
  impacts_oef: boolean;

  @Column({ type: 'boolean' })
  staffable: boolean;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'boolean', default: false })
  is_primary_chairperson: boolean;
}
