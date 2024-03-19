import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Certification } from './certification.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class StaffCertification extends GenericEntity {
  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ type: 'bigint' })
  staff_id: bigint;

  @ManyToOne(() => Certification, (certif) => certif.id, { nullable: false })
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certification;

  @Column({ type: 'bigint' })
  certificate_id: bigint;

  @Column({ type: 'date' })
  certificate_start_date: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
