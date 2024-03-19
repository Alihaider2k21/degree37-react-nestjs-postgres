import { User } from '../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { IndustryCategories } from 'src/api/system-configuration/tenants-administration/crm-administration/account/industry-categories/entities/industry-categories.entity';
import { Stages } from 'src/api/system-configuration/tenants-administration/crm-administration/account/stages/entities/stages.entity';
import { Sources } from 'src/api/system-configuration/tenants-administration/crm-administration/account/sources/entities/sources.entity';
import { Territory } from 'src/api/system-configuration/tenants-administration/geo-administration/territories/entities/territories.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';

@Entity()
@Index('idx_industry_category', ['industry_category'])
@Index('idx_industry_subcategory', ['industry_subcategory'])
@Index('idx_stage', ['stage'])
@Index('idx_source', ['source'])
@Index('idx_collection_operation', ['collection_operation'])
@Index('idx_recruiter', ['recruiter'])
@Index('idx_territory', ['territory'])
@Index('idx_tenant_id', ['tenant_id'])
export class Accounts extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  // @Column({ type: 'varchar', length: 36, nullable: true })
  // external_id: string;

  // @Column({ type: 'integer', nullable: true })
  // account_id: number;

  @Column({ type: 'varchar', length: 60, nullable: true })
  alternate_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  facebook: string;

  @ManyToOne(
    () => IndustryCategories,
    (industryCategories) => industryCategories.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'industry_category' })
  industry_category: bigint;

  @ManyToOne(
    () => IndustryCategories,
    (industryCategories) => industryCategories.id,
    { nullable: true }
  )
  @JoinColumn({ name: 'industry_subcategory' })
  industry_subcategory: bigint;

  @ManyToOne(() => Stages, (stages) => stages.id, { nullable: true })
  @JoinColumn({ name: 'stage' })
  stage: bigint;

  @ManyToOne(() => Sources, (sources) => sources.id, { nullable: true })
  @JoinColumn({ name: 'source' })
  source: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  BECS_code: string;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation' })
  collection_operation: BusinessUnits;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'recruiter' })
  recruiter: User;

  @ManyToOne(() => Territory, (territory) => territory.id, { nullable: true })
  @JoinColumn({ name: 'territory' })
  territory: bigint;

  @Column({ type: 'float', nullable: true })
  population: number;

  @Column({ default: true, nullable: false })
  is_active: boolean;

  @Column({ default: false, nullable: false })
  RSMO: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: bigint;

  @OneToMany(() => Drives, (drive) => drive.account, { nullable: false })
  @JoinColumn({ name: 'drives' })
  drives: Drives;
}
