import Permissions from '../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../helpers/CheckPermissions';

export const accountTabs = [
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.MODULE_CODE,
  ]) && {
    label: 'Affiliations',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/affiliations',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.SOURCES.MODULE_CODE,
  ]) && {
    label: 'Sources',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/sources',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.MODULE_CODE,
  ]) && {
    label: 'Stage',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/stages',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_CATEGORY.MODULE_CODE,
  ]) && {
    label: 'Industry Categories',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/industry-categories',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.MODULE_CODE,
  ]) && {
    label: 'Industry Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.ATTACHMENTS_CATEGORY.MODULE_CODE,
  ]) && {
    label: 'Attachment Categories',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.ATTACHMENTS_SUBCATEGORY.MODULE_CODE,
  ]) && {
    label: 'Attachment Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_CATEGORY.MODULE_CODE,
  ]) && {
    label: 'Note Categories',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/note-categories/list',
    className: 'p10',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_SUBCATEGORY.MODULE_CODE,
  ]) && {
    label: 'Note Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/accounts/note-subcategories/list',
    className: 'p10',
  },
].filter(Boolean);
