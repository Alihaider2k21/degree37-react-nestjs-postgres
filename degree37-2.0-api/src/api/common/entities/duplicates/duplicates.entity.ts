import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PolymorphicType } from '../../enums/polymorphic-type.enum';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Duplicates extends GenericEntity {
  @Column({ type: 'bigint' })
  record_id: bigint;

  @Column({ type: 'bigint' })
  duplicatable_id: bigint;

  @Column({ type: 'enum', enum: PolymorphicType })
  duplicatable_type: PolymorphicType;

  @Column({ default: false })
  is_resolved: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ nullable: true })
  tenant_id: number;
}
