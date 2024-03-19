import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { BookingRules } from '../../booking-drives/booking-rules/entities/booking-rules.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class AuditFields {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @ManyToMany(() => BookingRules, (bookingRules) => bookingRules.addFields, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  bookingRules?: BookingRules[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
