export enum taskable_type_enum {
  CRM_ACCOUNTS = 'accounts', //CRM -> Accounts
  CRM_LOCATIONS = 'crm_locations', //CRM -> Locations
  CRM_CONTACTS_STAFF = 'staff', //CRM -> Contacts -> Staff
  CRM_CONTACTS_VOLUNTEERS = 'crm_volunteer', //CRM -> Contacts -> Volunteer
  CRM_CONTACTS_DONORS = 'donors', //CRM -> Contacts -> Donors
  CRM_DONOR_CENTERS = 'donor_centers', //CRM Menu -> Donor Centers
  CRM_NON_COLLECTION_PROFILES = 'crm_non_collection_profiles', //CRM Menu -> Non-Collection Profil
  OC_OPERATIONS_SESSIONS = 'sessions', //OC -> Operations -> Sessions
  OC_OPERATIONS_NON_COLLECTION_EVENTS = 'oc_non_collection_events', //OC -> Operations -> NOC
  OC_OPERATIONS_DRIVES = 'drives', //OC -> Operations -> Drives
}
export enum task_status_enum {
  not_started = 'Not Started',
  in_process = 'In Process',
  deferred = 'Deferred',
  completed = 'Completed',
  cancelled = 'Cancelled',
}

export enum task_due_date_enum {
  all = 'All',
  past_date = 'Past Due',
  due_this_week = 'Due This Week',
  due_next_week = 'Due Next Week',
}

export const TaskDueDateEnumKeys = {
  1: task_due_date_enum.all,
  2: task_due_date_enum.past_date,
  3: task_due_date_enum.due_this_week,
  4: task_due_date_enum.due_next_week,
};
