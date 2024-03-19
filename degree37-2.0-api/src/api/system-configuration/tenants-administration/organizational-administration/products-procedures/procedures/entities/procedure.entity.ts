import { User } from '../../../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Unique,
  OneToMany,
} from 'typeorm';
import { ProcedureTypes } from '../../procedure-types/entities/procedure-types.entity';
import { Products } from '../../products/entities/products.entity';
import { ProceduresProducts } from './procedures-products.entity';
import { Tenant } from '../../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Procedure {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => ProcedureTypes, (procedureType) => procedureType.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'procedure_type_id ' })
  procedure_type_id: bigint;

  @Column({ type: 'text', nullable: false })
  description: string;

  @ManyToMany(() => Products, (product) => product.id, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'procedures_products',
    joinColumn: {
      name: 'procedures_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products?: Products[];

  @Column()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  external_reference: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @OneToMany(
    () => ProceduresProducts,
    (procedureProducts) => procedureProducts.procedure
  )
  procedure_products: ProceduresProducts[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  credits: number;
}
