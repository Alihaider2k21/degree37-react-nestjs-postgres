import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from '../../../../../system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';

@Entity()
export class Notes extends GenericEntity {
  @Column({ type: 'bigint', nullable: true })
  noteable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  noteable_type: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  note_name: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category_id: Category;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  @JoinColumn({ name: 'sub_category_id' })
  sub_category_id: Category;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
