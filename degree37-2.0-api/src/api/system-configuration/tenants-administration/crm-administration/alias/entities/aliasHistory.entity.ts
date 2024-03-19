import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TypeEnum } from '../dto/create-alias.dto';
import { GenericHistoryEntity } from '../../../../../common/entities/generic-history.entity';
@Entity()
export class AliasHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 100 })
  text: string;

  @Column({ type: 'varchar', length: 100 })
  type: TypeEnum;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
