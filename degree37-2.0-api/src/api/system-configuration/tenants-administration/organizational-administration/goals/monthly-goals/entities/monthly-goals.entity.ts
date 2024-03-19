import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { Facility } from '../../../resources/facilities/entity/facility.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../../common/entities/generic.entity';
import { Donor } from '../../../../../../donor-portal/donor/entities/donor.entity';

@Entity()
export class MonthlyGoals extends GenericEntity {
  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'int', nullable: false })
  january: number;

  @Column({ type: 'int', nullable: false })
  february: number;

  @Column({ type: 'int', nullable: false })
  march: number;

  @Column({ type: 'int', nullable: false })
  april: number;

  @Column({ type: 'int', nullable: false })
  may: number;

  @Column({ type: 'int', nullable: false })
  june: number;

  @Column({ type: 'int', nullable: false })
  july: number;

  @Column({ type: 'int', nullable: false })
  august: number;

  @Column({ type: 'int', nullable: false })
  september: number;

  @Column({ type: 'int', nullable: false })
  october: number;

  @Column({ type: 'int', nullable: false })
  november: number;

  @Column({ type: 'int', nullable: false })
  december: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  total_goal: number;

  @ManyToOne(() => ProcedureTypes, (procedureType) => procedureType.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'procedure_type' })
  procedure_type: ProcedureTypes;

  @ManyToMany(() => BusinessUnits)
  @JoinTable({
    name: 'monthly_goals_collection_operations',
    joinColumn: {
      name: 'monthly_goals_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'business_unit_id',
      referencedColumnName: 'id',
    },
  })
  collection_operation: BusinessUnits[];

  @ManyToOne(() => Facility, (facility) => facility.id, { nullable: true })
  @JoinColumn({ name: 'donor_center' })
  donor_center: Donor;

  @ManyToOne(() => User, (recruiter) => recruiter.id, { nullable: true })
  @JoinColumn({ name: 'recruiter' })
  recruiter: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
