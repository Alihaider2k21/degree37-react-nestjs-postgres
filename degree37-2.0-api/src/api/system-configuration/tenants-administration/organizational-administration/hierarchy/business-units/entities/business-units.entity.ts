import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrganizationalLevels } from '../../organizational-levels/entities/organizational-level.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../../common/entities/generic.entity';
@Entity()
export class BusinessUnits extends GenericEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(
    () => OrganizationalLevels,
    (organizationalLevels) => organizationalLevels.id,
    { nullable: true }
  )
  @JoinColumn({ name: 'organizational_level_id' })
  organizational_level_id?: OrganizationalLevels;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => BusinessUnits, (businessUnits) => businessUnits.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_level' })
  parent_level?: BusinessUnits;

  @Column({ default: true, nullable: false })
  is_active: boolean;
}
