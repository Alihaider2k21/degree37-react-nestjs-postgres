import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('staff_collection_operations')
export class StaffCollectionOperation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff_id: bigint;

  @ManyToOne(() => BusinessUnits, (businessUnit) => businessUnit.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'collection_operation_id' })
  collection_operation_id: bigint;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
