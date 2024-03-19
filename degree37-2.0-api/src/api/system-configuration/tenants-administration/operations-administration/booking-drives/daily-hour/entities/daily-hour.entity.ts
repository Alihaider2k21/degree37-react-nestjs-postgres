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
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class DailyHour extends GenericEntity {
  @Column({ type: 'varchar', nullable: false })
  mon_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  mon_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  tue_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  tue_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  wed_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  wed_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  thu_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  thu_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  fri_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  fri_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  @Column({ type: 'varchar', nullable: false })
  sat_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  sat_latest_return_time: string;
  @Column({ type: 'varchar', nullable: false })
  sun_earliest_depart_time: string;
  @Column({ type: 'varchar', nullable: false })
  sun_latest_return_time: string;
  @ManyToMany(() => BusinessUnits)
  @JoinTable({
    name: 'daily_hour_collection_operations',
    joinColumn: {
      name: 'daily_hour_id',
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

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
