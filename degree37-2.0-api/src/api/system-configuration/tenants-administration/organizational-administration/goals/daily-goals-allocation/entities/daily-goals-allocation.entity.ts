import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from '../../../../../../common/entities/generic.entity';

@Entity()
export class DailyGoalsAllocations extends GenericEntity {
  @ManyToMany(() => BusinessUnits)
  @JoinTable({
    name: 'daily_goals_collection_operations',
    joinColumn: {
      name: 'daily_goals_allocation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'business_unit_id',
      referencedColumnName: 'id',
    },
  })
  collection_operation: BusinessUnits[];

  @ManyToOne(() => ProcedureTypes, (procedureTypes) => procedureTypes.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'procedure_type_id' })
  procedure_type: ProcedureTypes;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  effective_date: Date;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'float' })
  sunday: number;

  @Column({ type: 'float' })
  monday: number;

  @Column({ type: 'float' })
  tuesday: number;

  @Column({ type: 'float' })
  wednesday: number;

  @Column({ type: 'float' })
  thursday: number;

  @Column({ type: 'float' })
  friday: number;

  @Column({ type: 'float' })
  saturday: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
