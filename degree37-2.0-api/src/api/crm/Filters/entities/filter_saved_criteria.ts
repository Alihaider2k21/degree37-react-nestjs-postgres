import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
// import { GenericEntity } from "../../../common/entities/generic.entity";
import { FilterCriteria } from './filter_criteria';
import { FilterSaved } from './filter_saved';
import { GenericEntity } from '../../../common/entities/generic.entity';

@Entity('filter_saved_criteria')
export class FilterSavedCriteria extends GenericEntity {
  @ManyToOne(() => FilterSaved, (filterSaved) => filterSaved.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'filter_saved_id' })
  filter_saved_id: FilterSaved;

  @ManyToOne(() => FilterCriteria, (filterCriteria) => filterCriteria.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'filter_criteria_id' })
  filter_criteria_id: FilterCriteria;

  @Column({ type: 'varchar', length: 250, nullable: false })
  filter_saved_value: string;
}
