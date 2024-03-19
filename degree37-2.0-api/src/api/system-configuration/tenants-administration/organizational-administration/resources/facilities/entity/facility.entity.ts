import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { IndustryCategories } from '../../../../crm-administration/account/industry-categories/entities/industry-categories.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alternate_name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  code: string;

  @Column({ default: false })
  donor_center: boolean;

  @Column({ default: false })
  staging_site: boolean;

  @ManyToOne(() => BusinessUnits, (businessUnits) => businessUnits.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation' })
  collection_operation: BusinessUnits;

  @Column({ default: false })
  status: boolean;

  @ManyToOne(
    () => IndustryCategories,
    (industryCategory) => industryCategory.id,
    { nullable: true }
  )
  @JoinColumn({ name: 'industry_category' })
  industry_category: IndustryCategories;

  @ManyToMany(() => IndustryCategories)
  @JoinTable({
    name: 'facility_industry_sub_category',
    joinColumn: {
      name: 'facility_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'industry_sub_category_id',
      referencedColumnName: 'id',
    },
  })
  industry_sub_category: IndustryCategories[];

  @Column({ default: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
