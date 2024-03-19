import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class DailyCapacity extends GenericEntity {
  @Column({ type: 'int', nullable: false })
  mon_max_drives: number;

  @Column({ type: 'int', nullable: false })
  mon_max_staff: number;

  @Column({ type: 'int', nullable: false })
  tue_max_drives: number;

  @Column({ type: 'int', nullable: false })
  tue_max_staff: number;

  @Column({ type: 'int', nullable: false })
  wed_max_drives: number;

  @Column({ type: 'int', nullable: false })
  wed_max_staff: number;

  @Column({ type: 'int', nullable: false })
  thur_max_staff: number;

  @Column({ type: 'int', nullable: false })
  thur_max_drives: number;

  @Column({ type: 'int', nullable: false })
  fri_max_drives: number;

  @Column({ type: 'int', nullable: false })
  fri_max_staff: number;

  @Column({ type: 'int', nullable: false })
  sat_max_drives: number;

  @Column({ type: 'int', nullable: false })
  sat_max_staff: number;

  @Column({ type: 'int', nullable: false })
  sun_max_drives: number;

  @Column({ type: 'int', nullable: false })
  sun_max_staff: number;

  @ManyToMany(() => BusinessUnits)
  @JoinTable({
    name: 'daily_capacity_collection_operations',
    joinColumn: {
      name: 'daily_capacity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'business_unit_id',
      referencedColumnName: 'id',
    },
  })
  collection_operation: BusinessUnits[];

  @Column({ type: 'date', nullable: true })
  effective_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'boolean', nullable: true })
  is_current: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ default: false, nullable: false })
  is_archived: boolean;
}
