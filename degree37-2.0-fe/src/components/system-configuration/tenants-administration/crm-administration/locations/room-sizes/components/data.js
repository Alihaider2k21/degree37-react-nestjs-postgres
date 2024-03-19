import { LocationBreadCrumbsData } from '../../LocationBreadCrumbsData';

export const BreadcrumbsData = [
  ...LocationBreadCrumbsData,
  {
    label: 'Room Sizes',
    class: 'active-label',
    link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
  },
];

export const CreateBreadCrumbs = [
  ...LocationBreadCrumbsData,
  {
    label: 'Create Room Size',
    class: 'active-label',
    link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
  },
];

export const EditBreadcrumbsData = [
  ...LocationBreadCrumbsData,
  {
    label: 'Edit Room Sizes',
    class: 'active-label',
    link: '#',
  },
];

export const TabNavigation = [
  {
    link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
    title: 'Room Sizes',
  },
  {
    title: 'Attachment Categories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-categories',
  },
  {
    title: 'Attachment Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories',
  },
  {
    title: 'Note Categories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/note-categories',
  },
  {
    title: 'Note Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/note-subcategories/list',
  },
];

export const formValidation = (data) => {
  let errors = {};
  if (Object?.prototype?.hasOwnProperty?.call(data, 'name') && !data?.name) {
    errors.name = 'Name is required';
  }
  if (data?.name && data?.name?.length < 3) {
    errors.name = 'Name should contain at least three characters';
  }
  if (data?.name && data?.name?.length > 50) {
    errors.name = 'Maximum 50 characters are allowed';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(data, 'description') &&
    !data?.description
  ) {
    errors.description = 'Description is required';
  }
  if (data?.description && data?.description?.length > 500) {
    errors.description = 'Description should not be greater than 500';
  }
  return errors;
};
