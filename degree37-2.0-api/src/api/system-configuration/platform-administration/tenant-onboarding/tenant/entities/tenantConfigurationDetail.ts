import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from '../../../../tenants-administration/user-administration/user/entity/user.entity';

@Entity()
export class TenantConfigurationDetail {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  element_name: string;

  @Column({ type: 'text', nullable: false })
  end_point_url: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  secret_key: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  secret_value: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: bigint;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;
}
