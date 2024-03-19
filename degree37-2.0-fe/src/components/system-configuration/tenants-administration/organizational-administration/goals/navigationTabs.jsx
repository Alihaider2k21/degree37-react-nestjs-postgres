import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DAILY_GOALS_ALLOCATION_PATH,
  DAILY_GOALS_CALENDAR,
  GOALS_PERFORMANCE_RULES,
  MONTHLY_GOALS_PATH,
} from '../../../../../routes/path';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const GoalsNavigationTabs = () => {
  const location = useLocation();
  const currentLocation = location.pathname;

  return (
    <div className="tabs">
      <ul>
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.MONTHLY_GOALS
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={MONTHLY_GOALS_PATH.LIST}
              className={
                currentLocation === MONTHLY_GOALS_PATH.LIST ? 'active' : ''
              }
            >
              Monthly Goals
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_ALLOCATION
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={DAILY_GOALS_ALLOCATION_PATH.LIST}
              className={
                currentLocation === DAILY_GOALS_ALLOCATION_PATH.LIST
                  ? 'active'
                  : ''
              }
            >
              Daily Goals Allocation
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_CALENDAR
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={DAILY_GOALS_CALENDAR.VIEW}
              className={
                currentLocation === DAILY_GOALS_CALENDAR.VIEW ? 'active' : ''
              }
            >
              Daily Goals Calendar
            </Link>
          </li>
        )}
        {CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.PERFORMANCE_RULES
            .MODULE_CODE,
        ]) && (
          <li>
            <Link
              to={GOALS_PERFORMANCE_RULES.VIEW}
              className={
                currentLocation === GOALS_PERFORMANCE_RULES.VIEW ||
                currentLocation === GOALS_PERFORMANCE_RULES.EDIT
                  ? 'active'
                  : ''
              }
            >
              Performance Rules
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default GoalsNavigationTabs;
