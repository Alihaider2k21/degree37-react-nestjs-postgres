import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FACILITIES_PATH } from '../../../../../routes/path';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const ResourceNavigationTabs = () => {
  const location = useLocation();
  const currentLocation = location.pathname;

  return (
    <div className="tabs">
      <ul>
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/organization-admin/resources/devices'
              }
              className={
                currentLocation ===
                '/system-configuration/tenant-admin/organization-admin/resources/devices'
                  ? 'active'
                  : ''
              }
            >
              Devices
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICE_TYPE
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/organization-admin/resource/device-type'
              }
              className={
                currentLocation ===
                '/system-configuration/tenant-admin/organization-admin/resource/device-type'
                  ? 'active'
                  : ''
              }
            >
              Device Type
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
              }
              className={
                currentLocation ===
                '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
                  ? 'active'
                  : ''
              }
            >
              Vehicles
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICE_TYPE
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
              }
              className={
                currentLocation ===
                '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
                  ? 'active'
                  : ''
              }
            >
              Vehicle Type
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.FACILITIES
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={FACILITIES_PATH.LIST}
              className={
                currentLocation === FACILITIES_PATH.LIST ? 'active' : ''
              }
            >
              Facilities
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ResourceNavigationTabs;
