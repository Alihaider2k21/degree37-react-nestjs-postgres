import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('drives_zipcodes_history')
export class DrivesZipCodesHistory extends GenericHistoryEntity {
  @Column({ type: 'int', nullable: false, primary: true })
  drive_id: bigint;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zip_code: string;
}
