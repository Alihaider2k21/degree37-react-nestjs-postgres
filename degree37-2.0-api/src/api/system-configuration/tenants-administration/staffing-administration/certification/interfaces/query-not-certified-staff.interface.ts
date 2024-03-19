export interface FilterNotCertifiedStaff {
  status?: boolean;
  co_id?: bigint;
  team_id?: bigint;
  role_id?: bigint;
  certificate_id?: bigint;
}

export interface SortNotCertifiedStaff {
  sortName?: string;
  sortOrder?: 'ASC' | 'DESC';
}
