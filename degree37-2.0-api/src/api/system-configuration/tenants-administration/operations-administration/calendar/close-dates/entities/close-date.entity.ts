import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { CloseDateCollectionOperation } from './close-date-collection-operations.entity';

@Entity('close_dates')
export class CloseDate extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'date', nullable: false })
  start_date: string;

  @Column({ type: 'date', nullable: false })
  end_date: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;

  @OneToMany(
    () => CloseDateCollectionOperation,
    (close_date_collection_operations) =>
      close_date_collection_operations.close_date_id,
    {
      nullable: false,
    }
  )
  close_date_collection_operations: CloseDateCollectionOperation;
}
