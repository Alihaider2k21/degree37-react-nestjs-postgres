export const FACILITIES_PATH = {
  LIST: '/system-configuration/resource-management/facilities',
  CREATE: '/system-configuration/resource-management/facilities/create',
  EDIT: '/system-configuration/resource-management/facilities/:id',
  VIEW: '/system-configuration/resource-management/facilities/view/:id',
};

export const BUSINESS_UNIT_PATH = {
  LIST: '/system-configuration/hierarchy/business-units',
  CREATE:
    '/system-configuration/tenant-administration/organizational-administration/hierarchy/business-units/create',
  EDIT: '/system-configuration/business-unit/edit/:id',
  VIEW: '/system-configuration/business-unit/view/:id',
};

export const MONTHLY_GOALS_PATH = {
  LIST: '/system-configuration/tenant-administration/organizational-administration/goals/monthly-goals',
  CREATE:
    '/system-configuration/tenant-administration/organizational-administration/goals/monthly-goals/create',
  EDIT: '/system-configuration/tenant-administration/organizational-administration/goals/monthly-goals/:id/edit',
  VIEW: '/system-configuration/tenant-administration/organizational-administration/goals/monthly-goals/:id/view',
};

export const DAILY_GOALS_ALLOCATION_PATH = {
  LIST: '/system-configuration/tenant-administration/organizational-administration/goals/daily-goals-allocation',
  CREATE:
    '/system-configuration/tenant-administration/organizational-administration/goals/daily-goals-allocation/create',
  EDIT: '/system-configuration/tenant-administration/organizational-administration/goals/daily-goals-allocation/:id/edit',
  VIEW: '/system-configuration/tenant-administration/organizational-administration/goals/daily-goals-allocation/:id/view',
};

export const DAILY_GOALS_CALENDAR = {
  EDIT: '/system-configuration/tenant-administration/organizational-administration/goals/daily-goals-calendar/edit',
  VIEW: '/system-configuration/tenant-administration/organizational-administration/goals/daily-goals-calendar/view',
};
export const TEAMS_PATH = {
  LIST: '/system-configuration/staffing-admin/teams',
  CREATE: '/system-configuration/staffing-admin/teams/create',
  EDIT: '/system-configuration/staffing-admin/teams/:id/edit',
  VIEW: '/system-configuration/staffing-admin/teams/:id',
};

export const GOALS_PERFORMANCE_RULES = {
  LIST: '/system-configuration/tenant-administration/organizational-administration/goals/performance-rules/view',
  EDIT: '/system-configuration/tenant-administration/organizational-administration/goals/performance-rules/edit',
  VIEW: '/system-configuration/tenant-administration/organizational-administration/goals/performance-rules/view',
};

export const USER_ROLES = {
  CREATE:
    '/system-configuration/tenant-administration/users-administration/user-roles/create',
  EDIT: '/system-configuration/tenant-administration/users-administration/user-roles/:id/edit',
  VIEW: '/system-configuration/tenant-administration/users-administration/user-roles/:id/view',
  LIST: '/system-configuration/tenant-administration/users-administration/user-roles',
  ASSIGN:
    '/system-configuration/tenant-administration/users-administration/user-roles/:id/assign',
};

export const CLASSIFICATIONS_PATH = {
  LIST: '/system-configuration/tenant-admin/staffing-admin/classifications/list',
  CREATE:
    '/system-configuration/tenant-admin/staffing-admin/classifications/create',
  EDIT: '/system-configuration/tenant-admin/staffing-admin/classifications/:id/edit',
  VIEW: '/system-configuration/tenant-admin/staffing-admin/classifications/:id/view',
};

export const SETTINGS_CLASSIFICATIONS_PATH = {
  LIST: '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list',
  CREATE:
    '/system-configuration/tenant-admin/staffing-admin/classifications/settings/create',
  EDIT: '/system-configuration/tenant-admin/staffing-admin/classifications/settings/:id/edit',
  VIEW: '/system-configuration/tenant-admin/staffing-admin/classifications/settings/:id/view',
};

export const STAFF_SETUP = {
  LIST: '/system-configuration/tenant-admin/staffing-admin/staff-setup',
  CREATE:
    '/system-configuration/tenant-admin/staffing-admin/staff-setup/create',
  EDIT: '/system-configuration/tenant-admin/staffing-admin/staff-setup/:id/edit',
  VIEW: '/system-configuration/tenant-admin/staffing-admin/staff-setup/:id',
};
export const TEAMS_ASSIGN_MEMBERS = {
  LIST: '/system-configuration/staffing-admin/teams/members',
  ASSIGN: '/system-configuration/staffing-admin/teams/assign-members',
};

export const CRM_DONORS_CENTERS = {
  LIST: '/crm/donor_center',
  VIEW: '/crm/donor_center/:id',
  BLUEPRINT: '/crm/donor-centers/:id/blueprints',
  BLUEPRINT_VIEW: '/crm/donor-centers/:id/blueprints/:blueprintId/view',
  BLUEPRINT_VIEW_DETAILS:
    '/crm/donor-centers/:id/blueprints/:blueprintId/shiftDetails',
  BLUEPRINT_VIEW_SCHEDULE:
    '/crm/donor-centers/:id/blueprints/:blueprintId/donorSchedules',
};

export const ACCOUNT_TASKS_PATH = {
  LIST: '/crm/accounts/:account_id/tasks',
  CREATE: '/crm/accounts/:account_id/tasks/create',
  EDIT: '/crm/accounts/:account_id/tasks/:id/edit',
  VIEW: '/crm/accounts/:account_id/tasks/:id/view',
};

export const DONOR_TASKS_PATH = {
  LIST: '/crm/contacts/donor/:donorId/tasks',
  CREATE: '/crm/contacts/donor/:donorId/tasks/create',
  EDIT: '/crm/contacts/donor/:donorId/tasks/:id/edit',
  VIEW: '/crm/contacts/donor/:donorId/tasks/:id/view',
};

export const DONOR_DONATION_HISTORY_PATH = {
  LIST: '/crm/contacts/donor/:donorId/donation-history',
};

export const STAFF_TASKS_PATH = {
  LIST: '/crm/contacts/staff/:staff_id/tasks',
  CREATE: '/crm/contacts/staff/:staff_id/tasks/create',
  EDIT: '/crm/contacts/staff/:staff_id/tasks/:id/edit',
  VIEW: '/crm/contacts/staff/:staff_id/tasks/:id/view',
};

export const CRM_VOLUNTEER_TASKS_PATH = {
  LIST: '/crm/contacts/volunteers/:volunteerId/view/tasks',
  VIEW: '/crm/contacts/volunteers/:volunteerId/view/tasks/:id/view',
  CREATE: '/crm/contacts/volunteers/:volunteerId/view/tasks/create',
  EDIT: '/crm/contacts/volunteers/:volunteerId/view/tasks/:id/edit',
};

export const CRM_NON_COLLECTION_PROFILES_TASKS_PATH = {
  LIST: '/crm/non-collection-profiles/view/:nonCollectionProfileId/tasks',
  CREATE:
    '/crm/non-collection-profiles/view/:nonCollectionProfileId/tasks/create',
  EDIT: '/crm/non-collection-profiles/view/:nonCollectionProfileId/tasks/:id/edit',
  VIEW: '/crm/non-collection-profiles/view/:nonCollectionProfileId/tasks/:id/view',
};

export const LOCATIONS_TASKS_PATH = {
  LIST: '/crm/locations/about/:crm_location_id/tasks',
  CREATE: '/crm/locations/about/:crm_location_id/tasks/create',
  EDIT: '/crm/locations/about/:crm_location_id/tasks/:id/edit',
  VIEW: '/crm/locations/about/:crm_location_id/tasks/:id/view',
};

export const DONOR_CENTERS_TASKS_PATH = {
  LIST: '/crm/donor-centers/:donor_center_id/tasks',
  CREATE: '/crm/donor-centers/:donor_center_id/tasks/create',
  EDIT: '/crm/donor-centers/:donor_center_id/tasks/:id/edit',
  VIEW: '/crm/donor-centers/:donor_center_id/tasks/:id/view',
};

export const DONOR_CENTERS_SESSION_HISTORY_PATH = {
  LIST: '/crm/donor-centers/:donor_center_id/session-history',
};

export const SESSION_TASKS_PATH = {
  LIST: '/operations-center/operations/sessions/:session_id/tasks',
  CREATE: '/operations-center/operations/sessions/:session_id/tasks/create',
  EDIT: '/operations-center/operations/sessions/:session_id/tasks/:id/edit',
  VIEW: '/operations-center/operations/sessions/:session_id/tasks/:id/view',
};

export const SESSION_STAFFING_PATH = {
  LIST: '/operations-center/operations/sessions/:session_id/staffing',
};
export const DRIVES_TASKS_PATH = {
  LIST: '/operations-center/operations/drives/:drive_id/tasks',
  CREATE: '/operations-center/operations/drives/:drive_id/tasks/create',
  EDIT: '/operations-center/operations/drives/:drive_id/tasks/:id/edit',
  VIEW: '/operations-center/operations/drives/:drive_id/tasks/:id/view',
};

export const DRIVES_STAFFING_PATH = {
  LIST: '/operations-center/operations/drives/:drive_id/staffing',
};

export const OPERATIONS_CENTER_APPROVALS_PATH = {
  BEGINAPPROVAL: '/operations-center/approvals/BeginApprovals',
};
export const OPERATIONS_CENTER_CALENDAR_PATH = {
  VIEWCALENDAR: '/operations-center/calendar/ViewCalendar',
};

export const CRM_NON_COLLECTION_PROFILES_PATH = {
  VIEW: '/crm/non-collection-profiles/:id/about',
  CREATE: '/crm/non-collection-profiles/create',
  EDIT: '/crm/non-collection-profiles/:id/edit',
  LIST: '/crm/non-collection-profiles',
};

export const CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH = {
  CREATE: '/crm/non-collection-profiles/:id/blueprints/create',
  LIST: '/crm/non-collection-profiles/:id/blueprints',
  VIEW: '/crm/non-collection-profiles/:nonCollectionProfileId/blueprints/:id/view-blueprint',
  EDIT: '/crm/non-collection-profiles/:nonCollectionProfileId/blueprints/:id/edit',
  SHIFT_DETAILS:
    '/crm/non-collection-profiles/:nonCollectionProfileId/blueprints/:id/shift-details',
};
export const CRM_NON_COLLECTION_PROFILES_EVENT_HISTORY_PATH = {
  LIST: '/crm/non-collection-profiles/:id/events',
};
export const OPERATIONS_CENTER_DRIVES_PATH = {
  CREATE: '/operations-center/operations/drives/create',
  LIST: '/operations-center/operations/drives',
  EDIT: '/operations-center/operations/drives/:id/edit',
  VIEW: '/operations-center/operations/drives/:id/view/:slug',
  SHIFT_DETAILS: '/operations-center/operations/drives/:id/view/shift-details',
};

export const OPERATIONS_CENTER_DRIVES_DONOR_SCHEDULES = {
  LIST: '/operations-center/operations/drives/:id/view/donor-schedules',
};

export const OPERATIONS_CENTER_SESSIONS_PATH = {
  CREATE: '/operations-center/operations/sessions/create',
  LIST: '/operations-center/operations/sessions',
  EDIT: '/operations-center/operations/sessions/:id/edit',
  VIEW: '/operations-center/operations/sessions/:id/view/:slug',
  SHIFT_DETAILS:
    '/operations-center/operations/sessions/:id/view/shift-details',
};

export const OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS = {
  LIST: '/operations-center/operations/non-collection-events/:id/view/tasks',
  CREATE:
    '/operations-center/operations/non-collection-events/:id/view/tasks/create',
  EDIT: '/operations-center/operations/non-collection-events/:id/view/tasks/:taskId/edit',
  VIEW: '/operations-center/operations/non-collection-events/:id/view/tasks/:taskId/view',
};

export const OPERATIONS_CENTER_NON_COLLECTION_EVENTS_STAFFING = {
  LIST: '/operations-center/operations/non-collection-events/:id/staffing',
};

export const OPERATIONS_CENTER_DRIVES_DOCUMENT_ATTACHMENT_PATH = {
  CREATE:
    '/operations-center/operations/drives/:id/view/documents/attachments/create',
  LIST: '/operations-center/operations/drives/:id/view/documents/attachments',
  EDIT: '/operations-center/operations/drives/:id/view/documents/attachments/:attachId/edit',
  VIEW: '/operations-center/operations/drives/:id/view/documents/attachments/:attachId/view',
};

export const OPERATIONS_CENTER_DRIVES_DOCUMENT_NOTE_PATH = {
  CREATE:
    '/operations-center/operations/drives/:id/view/documents/notes/create',
  LIST: '/operations-center/operations/drives/:id/view/documents/notes',
  EDIT: '/operations-center/operations/drives/:id/view/documents/notes/:noteId/edit',
  VIEW: '/operations-center/operations/drives/:id/view/documents/notes/:noteId/view',
};

export const OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH = {
  CREATE:
    '/operations-center/operations/sessions/:id/view/documents/attachments/create',
  LIST: '/operations-center/operations/sessions/:id/view/documents/attachments',
  EDIT: '/operations-center/operations/sessions/:id/view/documents/attachments/:attachId/edit',
  VIEW: '/operations-center/operations/sessions/:id/view/documents/attachments/:attachId/view',
};

export const OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH = {
  CREATE:
    '/operations-center/operations/sessions/:id/view/documents/notes/create',
  LIST: '/operations-center/operations/sessions/:id/view/documents/notes',
  EDIT: '/operations-center/operations/sessions/:id/view/documents/notes/:noteId/edit',
  VIEW: '/operations-center/operations/sessions/:id/view/documents/notes/:noteId/view',
};

export const OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH = {
  CREATE:
    '/operations-center/operations/non-collection-events/:id/view/documents/attachments/create',
  LIST: '/operations-center/operations/non-collection-events/:id/view/documents/attachments',
  EDIT: '/operations-center/operations/non-collection-events/:id/view/documents/attachments/:attachId/edit',
  VIEW: '/operations-center/operations/non-collection-events/:id/view/documents/attachments/:attachId/view',
};

export const OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH = {
  CREATE:
    '/operations-center/operations/non-collection-events/:id/view/documents/notes/create',
  LIST: '/operations-center/operations/non-collection-events/:id/view/documents/notes',
  EDIT: '/operations-center/operations/non-collection-events/:id/view/documents/notes/:noteId/edit',
  VIEW: '/operations-center/operations/non-collection-events/:id/view/documents/notes/:noteId/view',
};
export const SYSTEM_CONFIGURATION_PATH =
  '/system-configuration/organizational-levels';
export const SC_ORGANIZATIONAL_ADMINISTRATION_PATH =
  '/system-configuration/organizational-levels';
export const SC_GEO_ADMINISTRATION_PATH =
  '/system-configuration/tenant-admin/geo-admin/territories/list';
export const SC_CALL_CENTER_ADMINISTRATION_PATH = '';
export const SC_CRM_ADMINISTRATION_PATH =
  '/system-configuration/tenant-admin/crm-admin/accounts/affiliations';
export const SC_OPERATIONS_ADMINISTRATION_PATH =
  '/system-configuration/operations-admin/booking-drives/booking-rule';
export const SC_STAFF_ADMINISTRATION_PATH = STAFF_SETUP.LIST;
export const SC_USER_ADMINISTRATION_PATH =
  '/system-configuration/tenant-administration/users-administration/user-roles';

export const CRM_PATH = '/crm/accounts';
export const CRM_ACCOUNTS_PATH = '/crm/accounts';
export const CRM_CONTACTS_PATH = '/crm/contacts/volunteers';
export const CRM_LOCATIONS_PATH = '/crm/locations';
export const CRM_DONOR_CENTERS_PATH = '/crm/donor_center';
export const CRM_NON_COLLECTION_PROFILES_MAIN_PATH =
  '/crm/non-collection-profiles';

export const OPERATIONS_CENTER_MANAGE_FAVORITES_PATH = {
  CREATE: '/operations-center/manage-favorites/create',
  EDIT: '/operations-center/manage-favorites/:id/edit',
  LIST: '/operations-center/manage-favorites',
  DUPLICATE: '/operations-center/manage-favorites/:id/duplicate',
  VIEW: '/operations-center/manage-favorites/:id',
};

export const OPERATIONS_CENTER_NCE = {
  CREATE: '/operations-center/operations/nce/create',
  LIST: '/operations-center/operations/non-collection-events',
  EDIT: '/operations-center/operations/non-collection-events/:id/edit',
  VIEW: '/operations-center/operations/non-collection-events/:id/view/about',
  SHIFT_DETAILS:
    '/operations-center/operations/non-collection-events/:id/view/shift-details',
};

export const OPERATIONS_CENTER = {
  DASHBOARD: '/operations-center',
};

export const SYSTEM_CONFIGURATION = {
  DASHBOARD: '/system-configuration',
};

export const CRM_STAFF_SCHEDULE_PATH = {
  LIST: '/crm/contacts/staff/:staff_id/view/schedule',
  VIEW: '/crm/contacts/staff/:staff_id/view/schedule/:schedule_id/view',
};

export const CRM_DONOR_SCHEDULE_PATH = {
  CREATE: '/crm/contacts/donor/:donorId/view/schedule-create-list',
  LIST: '/crm/contacts/donor/:donorId/view/schedule',
  CREATE_FORM: '/crm/contacts/donor/:donorId/view/create-schedule',
  EDIT: '/crm/contacts/donor/:donorId/view/update-schedule/:schedule',
  VIEW: '/crm/contacts/donor/:donorId/view/schedule/:schedule',
};

export const OPERATIONS_CENTER_NCE_CHANGE_AUDIT_PATH = {
  LIST: '/operations-center/operations/non-collection-events/:id/view/change-audit',
};

export const OPERATIONS_CENTER_SESSIONS_CHANGE_AUDIT_PATH = {
  LIST: '/operations-center/operations/sessions/:id/view/change-audit',
};
export const OS_PROSPECTS_PATH = {
  CREATE: '/operations-center/prospects/create',
  CREATE_MESSAGE: '/operations-center/prospects/create/create-message',
  BUILD_SEGMENTS: '/operations-center/prospects/create/build-segments',
  LIST: '/operations-center/prospects',
  ABOUT: '/operations-center/prospects/:id/about',
  CONTACTS: '/operations-center/prospects/:id/contacts',
};

export const CRM_ACCOUNT_BLUEPRINT_PATH = {
  ABOUT: '/crm/accounts/:account_id/blueprints/:id/about',
  MARKETING_DETAILS:
    '/crm/accounts/:account_id/blueprint/:id/marketing-details',
};

export const DRIVES_CHANGE_AUDIT_PATH = {
  LIST: '/operations-center/operations/drives/:drive_id/change-audit',
};

export const STAFFING_MANAGEMENT_DASHBOARD = '/staffing-management/dashboard';
export const STAFFING_MANAGEMENT_STAFF_LIST = '/staffing-management/staff-list';

export const OPERATIONS_CENTER_RESOURCE_SHARING = {
  CREATE: '/operations-center/resource-sharing/create',
  LIST: '/operations-center/resource-sharing',
  EDIT: '/operations-center/resource-sharing/:id/edit',
  VIEW: '/operations-center/resource-sharing/:id/view',
};
export const STAFFING_MANAGEMENT_VIEW_SCHEDULE =
  '/staffing-management/view-schedules/staff-schedule';
export const STAFFING_MANAGEMENT_BUILD_SCHEDULE = {
  LIST: '/staffing-management/build-schedule',
  CREATE: '/staffing-management/build-schedule/create',
};
