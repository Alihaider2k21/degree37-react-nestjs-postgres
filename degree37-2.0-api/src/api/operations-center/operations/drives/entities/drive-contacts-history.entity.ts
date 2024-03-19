import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('drives_contacts_history')
export class DrivesContactsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', name: 'drive_id', nullable: false })
  drive_id: bigint;

  @Column({ type: 'bigint', name: 'accounts_contacts_id', nullable: false })
  accounts_contacts_id: bigint;

  @Column({ type: 'bigint', name: 'role_id', nullable: false })
  role_id: bigint;
}
