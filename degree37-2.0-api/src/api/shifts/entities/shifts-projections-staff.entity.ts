import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { GenericEntity } from '../../common/entities/generic.entity';
import { Shifts } from './shifts.entity';
import { ProcedureTypes } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types.entity';
import { StaffSetup } from 'src/api/system-configuration/tenants-administration/staffing-administration/staff-setups/entity/staffSetup.entity';

@Entity()
export class ShiftsProjectionsStaff extends GenericEntity {
  @ManyToOne(() => Shifts, (shift) => shift.id, { nullable: true })
  @JoinColumn({ name: 'shift_id' })
  shift: Shifts;

  @Column({ type: 'int', nullable: false })
  shift_id: bigint;

  @ManyToOne(() => ProcedureTypes, (procedure_type) => procedure_type.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'procedure_type_id' })
  procedure_type: ProcedureTypes;

  @Column({ type: 'int', nullable: false })
  procedure_type_id: bigint;

  @Column({ type: 'float', nullable: false })
  procedure_type_qty: number;

  @ManyToOne(() => StaffSetup, (staff_setup) => staff_setup.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'staff_setup_id' })
  staff_setup: StaffSetup;

  @Column({ type: 'int', nullable: false })
  staff_setup_id: bigint;

  @Column({ type: 'float', nullable: false })
  product_yield: number;

  @Column({ type: 'boolean', default: true })
  is_donor_portal_enabled: boolean;
}
