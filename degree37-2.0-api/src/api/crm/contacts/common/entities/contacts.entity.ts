import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Contacts extends GenericEntity {
  @Column({ type: 'int', nullable: false })
  contactable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  contactable_type: string;

  @Column({ type: 'int', nullable: false })
  contact_type: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  data: string;

  @Column({ type: 'boolean', nullable: true })
  is_primary: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
