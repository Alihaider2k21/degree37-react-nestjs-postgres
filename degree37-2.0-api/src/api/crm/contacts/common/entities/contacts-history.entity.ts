import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class ContactsHistory extends GenericHistoryEntity {
  @Column({ type: 'int', nullable: false })
  contactable_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  contactable_type: string;

  @Column({ type: 'int', nullable: false })
  contact_type: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  data: string;

  @Column({ type: 'boolean', nullable: true })
  is_primary: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
