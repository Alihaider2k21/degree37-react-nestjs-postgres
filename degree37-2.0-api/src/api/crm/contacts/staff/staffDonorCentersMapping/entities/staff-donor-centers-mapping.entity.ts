import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Staff } from '../../entities/staff.entity';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';

@Entity()
export class StaffDonorCentersMapping extends GenericEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff_id: Staff;

  @ManyToOne(() => Facility, (facility) => facility.id, { nullable: true })
  @JoinColumn({ name: 'donor_center_id' })
  donor_center_id: Facility;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
