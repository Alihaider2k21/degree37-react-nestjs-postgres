import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Products } from '../../products/entities/products.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { ProcedureTypesProducts } from './procedure-types-products.entity';
import { Tenant } from '../../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';

@Entity()
export class ProcedureTypes {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false, nullable: false })
  is_goal_type: boolean;

  @Column({ type: 'boolean', default: false })
  is_archive: boolean;

  @ManyToMany(() => Products, (product) => product.id, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'procedure_types_products',
    joinColumn: {
      name: 'procedure_type_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products?: Products[];

  @Column({ type: 'bigint', nullable: false })
  procedure_duration: bigint;

  @Column({ default: false, nullable: false })
  is_generate_online_appointments: boolean;

  @Column({ default: false, nullable: false })
  is_active: boolean;

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
    () => ProcedureTypesProducts,
    (procedureTypesProducts) => procedureTypesProducts.procedureTypes
  )
  procedure_types_products: ProcedureTypesProducts[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @OneToMany(() => ShiftsProjectionsStaff, (proj) => proj.procedure_type_id, {
    nullable: true,
  })
  shift_projections_staff: ShiftsProjectionsStaff;
}
