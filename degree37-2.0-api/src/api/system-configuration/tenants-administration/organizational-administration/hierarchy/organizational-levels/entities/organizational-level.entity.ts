import { User } from '../../../../../tenants-administration/user-administration/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DailyGoalsAllocations } from '../../../goals/daily-goals-allocation/entities/daily-goals-allocation.entity';
import { DailyGoalsCalenders } from '../../../goals/daily-goals-calender/entity/daily-goals-calender.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../../common/entities/generic.entity';

@Entity()
export class OrganizationalLevels extends GenericEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(
    () => OrganizationalLevels,
    (organizationalLevel) => organizationalLevel.id,
    { nullable: true }
  )
  @JoinColumn({ name: 'parent_level' })
  parent_level?: OrganizationalLevels;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant' })
  tenant: Tenant;

  @Column({ default: true, nullable: false })
  is_active: boolean;

  @Column({ default: false, nullable: false })
  is_collection_operation: boolean;

  @ManyToMany(() => DailyGoalsAllocations)
  daily_goals_allocations: DailyGoalsAllocations[];

  @ManyToMany(() => DailyGoalsCalenders)
  daily_goals_calenders: DailyGoalsCalenders[];
}
