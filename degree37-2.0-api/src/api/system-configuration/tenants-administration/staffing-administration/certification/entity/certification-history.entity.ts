import { Entity, Column } from 'typeorm';
import { AssociationType } from '../enums/association_type.enum';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity({ name: 'certification_history' })
export class CertificationHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  short_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AssociationType,
    nullable: true,
  })
  association_type: AssociationType;

  @Column()
  expires: boolean;

  @Column({ default: 0 })
  expiration_interval: number;

  @Column({ default: 0 })
  assignments: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
