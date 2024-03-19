// rolePermission.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Permissions } from './permission.entity';
import { Roles } from './role.entity';
import { User } from '../../../../tenants-administration/user-administration/user/entity/user.entity';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn({ type: 'bigint' }) // Use bigint type to match related entities
  id: bigint;

  @ManyToOne(() => Roles, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @ManyToOne(() => Permissions, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permissions;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
