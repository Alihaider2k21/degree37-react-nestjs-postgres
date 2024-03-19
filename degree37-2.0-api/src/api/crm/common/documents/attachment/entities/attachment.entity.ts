import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../../../../system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { User } from '../../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AttachmentsFiles } from './attachment-files.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';

@Entity()
export class CrmAttachments extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(
    () => AttachmentsFiles,
    (attachment_files) => attachment_files.attachment_id
  )
  attachment_files: AttachmentsFiles[];

  @Column({ type: 'bigint', nullable: true })
  attachmentable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attachmentable_type: string;

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
