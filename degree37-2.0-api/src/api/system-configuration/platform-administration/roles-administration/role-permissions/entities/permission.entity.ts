import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Modules } from './module.entity';
import { RolePermission } from './rolePermission.entity';
import { Applications } from '../../application/entities/application.entity';

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  code: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_super_admin_permission: boolean;

  @ManyToOne(() => Modules, (module) => module.permissions)
  @JoinColumn({ name: 'module_id' })
  module: Modules;

  @ManyToOne(() => Applications, (app) => app.id)
  @JoinColumn({ name: 'application_id' })
  application: Applications;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission
  )
  rolePermissions: RolePermission[];

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
