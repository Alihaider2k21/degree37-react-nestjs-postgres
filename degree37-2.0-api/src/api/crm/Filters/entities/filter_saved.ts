import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
// import { GenericEntity } from "../../../common/entities/generic.entity";
import { GenericEntity } from '../../../common/entities/generic.entity';

@Entity('filter_saved')
export class FilterSaved extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  application_code: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_predefined: boolean;
}
