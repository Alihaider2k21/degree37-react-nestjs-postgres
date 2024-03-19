import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Team } from './team.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('team_staff')
export class TeamStaff {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => Team, (team) => team.id, { nullable: false })
  @JoinColumn({ name: 'team_id' })
  team_id: bigint;

  @ManyToOne(() => Staff, (staff) => staff.id, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff_id: bigint;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
