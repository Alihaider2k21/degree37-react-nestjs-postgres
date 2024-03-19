import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';

import { User } from '../../../user-administration/user/entity/user.entity';
import { typeEnum } from '../enums/type.enum';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  // @Column({ default: true })
  // status: boolean

  @Column({ default: true })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: typeEnum,
    nullable: true,
    default: typeEnum.CRM_ACCOUNTS_ATTACHMENTS,
  })
  type: typeEnum;

  @Column({ default: false, nullable: false })
  is_archived: boolean;

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent_id: Category;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
