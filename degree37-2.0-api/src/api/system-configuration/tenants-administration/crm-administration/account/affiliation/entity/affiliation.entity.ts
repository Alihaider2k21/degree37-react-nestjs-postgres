import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
@Entity()
export class Affiliation {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => BusinessUnits)
  @JoinTable({
    name: 'affiliation_collection_operations',
    joinColumn: {
      name: 'affiliation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'business_unit_id',
      referencedColumnName: 'id',
    },
  })
  collection_operation: BusinessUnits[];

  @Column()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
