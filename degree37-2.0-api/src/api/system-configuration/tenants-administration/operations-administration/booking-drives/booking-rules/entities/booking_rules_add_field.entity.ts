import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';
import { AuditFields } from '../../../audit-fields/entities/audit-fields.entity';
import { BookingRules } from './booking-rules.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';

@Entity()
export class BookingRulesAddField {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @PrimaryColumn({ type: 'bigint' })
  add_field_id: bigint;

  @PrimaryColumn({ type: 'bigint' })
  booking_rules_id: bigint;

  @ManyToOne(() => BookingRules, (bookingRules) => bookingRules.addFields, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'booking_rules_id', referencedColumnName: 'id' }])
  bookingRules: BookingRules[];

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;
}
