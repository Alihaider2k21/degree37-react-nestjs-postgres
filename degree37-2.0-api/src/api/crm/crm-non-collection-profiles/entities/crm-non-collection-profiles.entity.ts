import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { GenericEntity } from '../../../common/entities/generic.entity';
import { Category } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
@Entity()
export class CrmNonCollectionProfiles extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: true })
  profile_name: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  alternate_name: string;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @JoinColumn({ name: 'event_category_id' })
  event_category_id: bigint;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @JoinColumn({ name: 'event_subcategory_id' })
  event_subcategory_id: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnits) => businessUnits.id, {
    nullable: true,
  })
  @ManyToMany(() => BusinessUnits)
  @JoinTable({
    name: 'ncp_collection_operations',
    joinColumn: {
      name: 'ncp_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'business_unit_id',
      referencedColumnName: 'id',
    },
  })
  collection_operation_id: BusinessUnits[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner_id: User;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
