import Permissions from '../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../helpers/CheckPermissions';

export const NotesAttachmentsTabs = [
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_CATEGORY.MODULE_CODE,
  ]) && {
    label: 'Attachment Categories',
    link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_SUBCATEGORY.MODULE_CODE,
  ]) && {
    label: 'Attachment Subcategories',
    link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS.NOTES_CATEGORY
      .MODULE_CODE,
  ]) && {
    label: 'Note Categories',
    link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-categories/list',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .NOTES_SUBCATEGORY.MODULE_CODE,
  ]) && {
    label: 'Note Subcategories',
    link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/list',
  },
].filter(Boolean);
