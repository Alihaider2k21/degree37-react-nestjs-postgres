import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Permissions } from './permission.entity';
import { Applications } from '../../application/entities/application.entity';

@Entity()
export class Modules {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', nullable: true, unique: true, length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'bigint', nullable: true })
  parent_id: bigint; // Store the ID of the parent module

  @ManyToOne(() => Applications, (app) => app.modules, { nullable: false })
  @JoinColumn({ name: 'application_id' })
  application: Applications;

  @OneToMany(() => Modules, (module) => module.parent, { nullable: true })
  child_modules: Modules[];

  @OneToMany(() => Permissions, (permission) => permission.module, {
    nullable: false,
  })
  permissions: Permissions[];

  @Column({ default: false, nullable: false })
  is_super_admin_module: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => Modules, (module) => module.child_modules, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Modules;
}
