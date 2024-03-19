import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ProcedureTypes } from '../../procedure-types/entities/procedure-types.entity';
import { Procedure } from '../../procedures/entities/procedure.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { Tenant } from '../../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Products {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false, nullable: false })
  is_active: boolean;

  @Column({ type: 'varchar', length: 60, nullable: true })
  external_reference: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by: bigint;

  @ManyToMany(
    () => ProcedureTypes,
    (procedureTypes) => procedureTypes.products,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  proceduretypes?: ProcedureTypes[];

  @ManyToMany(() => Procedure, (procedure) => procedure.products, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  procedure?: Procedure[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;
}
