import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class DeviceType {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: false })
  name: string;

  // @Column({nullable: false})
  // procedure_type: string;

  @Column({ nullable: false })
  description: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: false })
  is_archive: boolean;

  @ManyToOne(() => ProcedureTypes, (procedureTypes) => procedureTypes.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'procedure_type' })
  procedure_type: bigint;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  // @ManyToOne(() => User, (user) => user.id, { nullable: true })
  // @JoinColumn({name:'updated_by'})
  // updated_by?: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  // @UpdateDateColumn({ nullable: false, type: 'timestamp' })
  // updated_at: Date;
}
