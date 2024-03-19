import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const CalendarNavigationTabs = () => {
  const location = useLocation();
  const currentLocation = location.pathname;

  return (
    <div className="tabs">
      <ul>
        {CheckPermission(null, [
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.BANNER.MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/operations-admin/calendar/banners'
              }
              className={
                currentLocation ===
                '/system-configuration/tenant-admin/operations-admin/calendar/banners'
                  ? 'active'
                  : ''
              }
            >
              Banners
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.LOCK_DATES.MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
              }
              className={
                currentLocation ===
                '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
                  ? 'active'
                  : ''
              }
            >
              Lock Dates
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.CLOSE_DATES
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/operations-admin/calendar/close-dates'
              }
              className={
                currentLocation ===
                '/system-configuration/tenant-admin/operations-admin/calendar/close-dates'
                  ? 'active'
                  : ''
              }
            >
              Close Dates
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.GOAL_VARIANCE
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={
                '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance'
              }
              className={
                currentLocation ===
                  '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance' ||
                currentLocation ===
                  '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance/create' ||
                currentLocation ===
                  '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance/edit'
                  ? 'active'
                  : ''
              }
            >
              Goal Variance
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CalendarNavigationTabs;
