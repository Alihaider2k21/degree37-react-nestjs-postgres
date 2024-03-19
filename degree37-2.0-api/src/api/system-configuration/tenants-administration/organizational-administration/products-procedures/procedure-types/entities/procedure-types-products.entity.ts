import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
} from 'typeorm';
import { Products } from '../../products/entities/products.entity';
import { ProcedureTypes } from './procedure-types.entity';

@Entity()
export class ProcedureTypesProducts {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @PrimaryColumn({ type: 'bigint' })
  procedure_type_id: bigint;

  @PrimaryColumn({ type: 'bigint' })
  product_id: bigint;

  @ManyToOne(
    () => ProcedureTypes,
    (procedureTypes) => procedureTypes.products,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
  )
  @JoinColumn([{ name: 'procedure_type_id', referencedColumnName: 'id' }])
  procedureTypes: ProcedureTypes[];

  @ManyToOne(() => Products, (products) => products.proceduretypes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  products: Products[];

  @Column({ type: 'float', nullable: true, default: 0 })
  quantity: number;
}
