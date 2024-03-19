import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';
import { Products } from '../../products/entities/products.entity';
import { Procedure } from './procedure.entity';

@Entity()
export class ProceduresProducts {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @PrimaryColumn({ type: 'bigint' })
  procedures_id: bigint;

  @PrimaryColumn({ type: 'bigint' })
  product_id: bigint;

  @ManyToOne(() => Procedure, (procedure) => procedure.products, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'procedures_id', referencedColumnName: 'id' }])
  procedure: Procedure[];

  @ManyToOne(() => Products, (products) => products.procedure, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  products: Products[];

  @Column({ type: 'float', nullable: true, default: 0 })
  quantity: number;
}
