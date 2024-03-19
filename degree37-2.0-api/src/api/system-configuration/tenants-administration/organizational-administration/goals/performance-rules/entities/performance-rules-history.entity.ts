import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PerformanceRulesHistory extends GenericHistoryEntity {
  @Column({ type: 'int', nullable: false })
  projection_accuracy_minimum: number;

  @Column({ type: 'int', nullable: false })
  projection_accuracy_maximum: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  projection_accuracy_ref: string;

  @Column({ nullable: false })
  is_include_qns: boolean;

  @Column({ name: 'tenant_id', type: 'bigint', nullable: false })
  tenant_id: bigint;
}
