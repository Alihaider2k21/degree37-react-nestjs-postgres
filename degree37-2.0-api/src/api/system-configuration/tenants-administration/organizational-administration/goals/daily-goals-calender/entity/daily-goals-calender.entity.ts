import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { GenericEntity } from '../../../../../../common/entities/generic.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class DailyGoalsCalenders extends GenericEntity {
  @Column({
    type: 'date',
    nullable: true,
  })
  date: Date;

  @ManyToOne(() => ProcedureTypes, (procedureTypes) => procedureTypes.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'procedure_type_id' })
  procedure_type: ProcedureTypes;

  @Column()
  procedure_type_id: bigint;

  @Column({ type: 'float' })
  goal_amount: number;

  @ManyToOne(
    () => BusinessUnits,
    (collection_operation) => collection_operation.id,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'collection_operation' })
  collection_operation: BusinessUnits;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @Column({ default: false })
  is_locked: boolean;
}
