import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class MonthlyGoalsHistory extends GenericHistoryEntity {
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

  @Column({ type: 'bigint', nullable: false })
  procedure_type: bigint;

  @Column({ type: 'bigint', nullable: true })
  donor_center: bigint;

  @Column({ type: 'bigint', name: 'recruiter', nullable: true })
  recruiter: bigint;

  @Column({ type: 'bigint', name: 'tenant_id', nullable: false })
  tenant_id: bigint;
}
