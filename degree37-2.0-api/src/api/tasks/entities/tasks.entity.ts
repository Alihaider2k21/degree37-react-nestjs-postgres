import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Tenant } from '../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../common/entities/generic.entity';
@Entity()
export class Tasks extends GenericEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'bigint', nullable: true })
  taskable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  taskable_type: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'assigned_to' })
  assigned_to: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'assigned_by' })
  assigned_by: User;

  @Column({ type: 'varchar', length: 60, nullable: true })
  task_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  due_date: Date;

  @Column({ type: 'int', nullable: true })
  status: number | null;
}
