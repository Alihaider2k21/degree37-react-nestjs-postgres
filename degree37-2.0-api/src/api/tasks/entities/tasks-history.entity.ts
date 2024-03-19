import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
@Entity()
export class TasksHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: true })
  taskable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  taskable_type: string;

  @Column({ type: 'bigint', name: 'tenant_id', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', name: 'assigned_to' })
  assigned_to: bigint;

  @Column({ type: 'bigint', name: 'assigned_by' })
  assigned_by: bigint;

  @Column({ type: 'varchar', length: 60, nullable: true })
  task_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  due_date: Date;

  @Column({ type: 'int', nullable: true })
  status: number | null;
}
