import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Donors } from './donors.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import { ProcedureTypes } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types.entity';

@Entity('donors_appointments')
export class DonorsAppointments extends GenericEntity {
  @Column({ type: 'bigint', nullable: false })
  appointmentable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  appointmentable_type: string;

  @ManyToOne(() => Donors, (donor) => donor.id, { nullable: false })
  @JoinColumn({ name: 'donor_id' })
  @Column({ type: 'bigint', nullable: true })
  donor_id: bigint;

  // @Column({ type: 'bigint', nullable: true })
  // donor_id: bigint;

  @ManyToOne(() => ShiftsSlots, (slots) => slots.id, { nullable: false })
  @JoinColumn({ name: 'slot_id' })
  @Column({ type: 'bigint', nullable: true })
  slot_id: bigint;

  // @Column({ type: 'bigint', nullable: true })
  // slot_id: bigint;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @ManyToOne(() => ProcedureTypes, (procedureTypes) => procedureTypes.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'procedure_type_id' })
  procedure_type: ProcedureTypes;

  @ManyToOne(() => Donors, (donor) => donor.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'donor_id' })
  donor: Donors;

  @Column({ type: 'bigint', nullable: true })
  procedure_type_id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  status: string;
}
