import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { StaffConfig } from './StaffConfig.entity';
import { LocationTypeEnum, OperationTypeEnum } from '../enum/type';
import { ProcedureTypes } from '../../../organizational-administration/products-procedures/procedure-types/entities/procedure-types.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class StaffSetup extends GenericEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  short_name: string;

  @Column({ type: 'int', default: 1 })
  beds: number;

  @Column({ type: 'int', default: 1 })
  concurrent_beds: number;

  @Column({ type: 'int', default: 1 })
  stagger_slots: number;

  @ManyToOne(() => ProcedureTypes, (procedure) => procedure.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'procedure_type_id' })
  procedure_type_id: ProcedureTypes;

  @Column({ type: 'varchar' })
  opeartion_type_id: OperationTypeEnum;

  @Column({ type: 'varchar', nullable: true })
  location_type_id: LocationTypeEnum;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => StaffConfig, (item) => item.staff_setup_id)
  staff_configuration: StaffConfig[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
