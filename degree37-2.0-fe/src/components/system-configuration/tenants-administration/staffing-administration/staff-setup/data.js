import { STAFF_SETUP } from '../../../../../routes/path';
import { StaffSetupBreadCrumbsData } from './StaffSetupBreadCrumbsData';

export const label = 'Staff Setups';
export const BreadcrumbsData = [
  ...StaffSetupBreadCrumbsData,
  {
    label: 'Create Staff Setup.',
    class: 'active-label',
    link: STAFF_SETUP.CREATE,
  },
];

export const BreadcrumbsDataEditStaffSetup = [
  ...StaffSetupBreadCrumbsData,
  {
    label: 'Edit Staff Setup.',
    class: 'active-label',
    link: '#',
  },
];

export const ViewDetailsBreadcrumbsData = [
  ...StaffSetupBreadCrumbsData,
  {
    label: 'View Staff Setup.',
    class: 'active-label',
    link: '#',
  },
];

export const ListViewBreadcrumbsData = StaffSetupBreadCrumbsData;

export const staffSetupFieldError = (staffSetup) => {
  let errors = {};
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'name') &&
    !staffSetup?.name
  ) {
    errors.name = 'Name is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'name') &&
    staffSetup?.name &&
    staffSetup?.name?.length < 3
  ) {
    errors.name = 'Name should contain at least three characters.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'shortName') &&
    !staffSetup?.shortName
  ) {
    errors.shortName = 'Short name is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'shortName') &&
    staffSetup?.shortName &&
    staffSetup?.shortName?.length < 3
  ) {
    errors.shortName = 'Name should contain at least three characters.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'operation') &&
    !staffSetup?.operation
  ) {
    errors.operation = 'Operation type is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'procedure') &&
    !staffSetup?.procedure
  ) {
    errors.procedure = 'Procedure type is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'location') &&
    !staffSetup?.location
  ) {
    errors.location = 'Location type is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'beds') &&
    !staffSetup?.beds
  ) {
    errors.beds = 'Beds is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'beds') &&
    staffSetup?.beds &&
    parseInt(staffSetup?.beds) <= 0
  ) {
    errors.beds = 'Beds count must be greater than 0.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'beds') &&
    staffSetup?.beds &&
    parseInt(staffSetup?.beds) > 99999
  ) {
    errors.beds = 'Beds count must not be greater than 99999.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'concurrentBeds') &&
    !staffSetup?.concurrentBeds
  ) {
    errors.concurrentBeds = 'Concurrent beds is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'concurrentBeds') &&
    staffSetup?.concurrentBeds &&
    parseInt(staffSetup?.concurrentBeds) <= 0
  ) {
    errors.concurrentBeds = 'Concurrent beds count must be greater than 0.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'concurrentBeds') &&
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'beds') &&
    staffSetup?.concurrentBeds &&
    staffSetup?.beds &&
    parseInt(staffSetup?.concurrentBeds) > parseInt(staffSetup?.beds)
  ) {
    errors.concurrentBeds =
      'Concurrent beds count must not be greater than beds.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'concurrentBeds') &&
    staffSetup?.concurrentBeds &&
    parseInt(staffSetup?.concurrentBeds) > 99999
  ) {
    errors.concurrentBeds =
      'Concurrent beds count must not be greater than 99999.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'staggerSlots') &&
    !staffSetup?.staggerSlots
  ) {
    errors.staggerSlots = 'Stagger slots is required.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'staggerSlots') &&
    staffSetup?.staggerSlots &&
    parseInt(staffSetup?.staggerSlots) < 0
  ) {
    errors.staggerSlots = 'Stagger slots must be greater than 0.';
  }
  if (
    Object?.prototype?.hasOwnProperty?.call(staffSetup, 'staggerSlots') &&
    staffSetup?.staggerSlots &&
    parseInt(staffSetup?.staggerSlots) > 99999
  ) {
    errors.staggerSlots = 'Stagger slots count must not be greater than 99999.';
  }
  return errors;
};

export const staffSetupError = (staffSetup) => {
  let errors = {};
  if (!staffSetup?.name) {
    errors.name = 'Name is required.';
  }
  if (!staffSetup?.shortName) {
    errors.shortName = 'Short name is required.';
  }
  if (!staffSetup?.operation) {
    errors.operation = 'Operation type is required.';
  }
  if (!staffSetup?.procedure) {
    errors.procedure = 'Procedure type is required.';
  }
  if (!staffSetup?.location && staffSetup?.operation?.value === 'DRIVE') {
    errors.location = 'Location type is required.';
  }
  if (!staffSetup?.beds) {
    errors.beds = 'Beds is required.';
  }
  if (!staffSetup?.concurrentBeds) {
    errors.concurrentBeds = 'Concurrent bed is required.';
  }
  if (
    staffSetup?.beds &&
    staffSetup?.concurrentBeds &&
    parseInt(staffSetup?.concurrentBeds) > parseInt(staffSetup?.beds)
  ) {
    errors.concurrentBeds =
      'Concurrent beds count must not be greater than beds.';
  }
  if (staffSetup?.staggerSlots === null || staffSetup?.staggerSlots === '') {
    errors.staggerSlots = 'Stagger slots is required.';
  }
  return errors;
};

export const staff_ConfigError = (configuration) => {
  let errors = [];
  let roles = [];
  for (let index = 0; index < configuration.length; index++) {
    let config = configuration[index];
    let obj = {};
    if (!config?.role) {
      obj.role = 'Role is required.';
    }
    if (roles.includes(config?.role?.value)) {
      obj.role =
        'This role has already been assigned to you. Kindly choose another role.';
    } else {
      roles.push(config?.role?.value);
    }
    if (!config?.qty) {
      obj.qty = 'Quantity is required.';
    }
    if (!config?.leadTime && config?.leadTime != 0) {
      obj.leadTime = 'Lead time is required.';
    }
    if (!config?.setupTime) {
      obj.setupTime = 'Setup time is required.';
    }
    if (!config?.breakdownTime) {
      obj.breakdownTime = 'Breakdown time is required.';
    }
    if (!config?.wrapupTime && config?.wrapupTime != 0) {
      obj.wrapupTime = 'Wrapup time is required.';
    }
    // if (config?.wrapupTime && parseInt(config?.wrapupTime) <= 0) {
    //   obj.wrapupTime = 'Wrapup time must be greater than 0.';
    // }
    if (config?.wrapupTime && parseInt(config?.wrapupTime) > 99999) {
      obj.wrapupTime = 'Wrapup time count must not be greater than 99999.';
    }
    if (config?.setupTime && parseInt(config?.setupTime) <= 0) {
      obj.setupTime = 'Setup time must be greater than 0.';
    }
    if (config?.setupTime && parseInt(config?.setupTime) > 99999) {
      obj.setupTime = 'Setup time count must not be greater than 99999.';
    }
    if (config?.breakdownTime && parseInt(config?.breakdownTime) <= 0) {
      obj.breakdownTime = 'Break down time must be greater than 0.';
    }
    if (config?.breakdownTime && parseInt(config?.breakdownTime) > 99999) {
      obj.breakdownTime =
        'Break down time count must not be greater than 99999.';
    }
    // if (config?.leadTime && parseInt(config?.leadTime) <= 0) {
    //   obj.leadTime = 'Lead time must be a greater than 0.';
    // }
    if (config?.leadTime && parseInt(config?.leadTime) > 99999) {
      obj.leadTime = 'Lead time count must not be greater than 99999.';
    }
    if (config?.qty && parseInt(config?.qty) <= 0) {
      obj.qty = 'Qunatity must be a greater than 0.';
    }
    if (config?.qty && parseInt(config?.qty) > 99999) {
      obj.qty = 'Qunatity count must not be greater than 99999.';
    }
    errors = [...errors, obj];
  }
  return errors;
};

export const staffError = (staffSetup, configuration) => {
  const staffSetup_Error = staffSetupError(staffSetup);
  const staffConfig_Error = staff_ConfigError(configuration);
  return {
    staffSetup: staffSetup_Error,
    config: staffConfig_Error,
  };
};

export const opertaionType = [
  {
    label: 'SESSION',
    value: 'SESSION',
  },
  {
    label: 'DRIVE',
    value: 'DRIVE',
  },
];

export const LocationType = [
  {
    label: 'INSIDE',
    value: 'INSIDE',
  },
  {
    label: 'OUTSIDE',
    value: 'OUTSIDE',
  },
  {
    label: 'COMBINATION',
    value: 'COMBINATION',
  },
];
