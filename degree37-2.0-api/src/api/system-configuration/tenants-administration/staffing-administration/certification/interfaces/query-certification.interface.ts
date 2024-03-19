import { AssociationType } from '../enums/association_type.enum';

export interface FilterCertification {
  is_active?: boolean;
  associationType?: AssociationType;
}

export interface FilterCertificationInterface {
  is_active?: boolean;
  associationType?: string;
}
