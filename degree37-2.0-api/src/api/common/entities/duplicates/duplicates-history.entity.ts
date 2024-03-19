import { Column, Entity } from 'typeorm';
import { PolymorphicType } from '../../enums/polymorphic-type.enum';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class DuplicatesHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  record_id: bigint;

  @Column({ type: 'bigint' })
  duplicatable_id: bigint;

  @Column({ type: 'enum', enum: PolymorphicType })
  duplicatable_type: PolymorphicType;

  @Column({ default: false })
  is_resolved: boolean;

  @Column({ nullable: true })
  tenant_id: number;
}
