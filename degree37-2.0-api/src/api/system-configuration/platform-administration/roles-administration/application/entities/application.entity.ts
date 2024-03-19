import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Modules } from '../../role-permissions/entities/module.entity';
import { Tenant } from '../../../tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Applications {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @OneToMany(() => Modules, (module) => module.application, { nullable: false })
  modules: Modules[];

  @ManyToMany(() => Tenant)
  tenants: Tenant[];
}
