import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { DRIVES_CHANGE_AUDIT_PATH } from '../../../../routes/path';

const DriveNavigationTabs = () => {
  const params = useParams();
  const id = params?.id || params?.drive_id;
  const slug = params?.slug;
  const location = useLocation();
  const currentLocation = location.pathname;

  return (
    <div className="filterBar p-0 mt-4 mb-3">
      <div className="tabs border-0 mb-0">
        <ul>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/view/about`}
              className={slug === `about` ? 'active' : 'fw-medium'}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/view/shift-details`}
              className={
                currentLocation ===
                `/operations-center/operations/drives/${id}/view/shift-details`
                  ? 'active'
                  : 'fw-medium'
              }
            >
              Shift Details
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/view/marketing-details`}
              className={
                currentLocation ===
                `/operations-center/operations/drives/${id}/view/marketing-details`
                  ? 'active'
                  : 'fw-medium'
              }
            >
              Marketing Details
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/tasks`}
              className={
                location.pathname.includes('tasks') ? 'active' : 'fw-medium'
              }
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/view/documents/notes`}
              className={
                location.pathname.includes('documents') ? 'active' : 'fw-medium'
              }
            >
              Documents
            </Link>
          </li>
          <li>
            <Link
              to={DRIVES_CHANGE_AUDIT_PATH.LIST.replace(':drive_id', id)}
              className={
                DRIVES_CHANGE_AUDIT_PATH.LIST.replace(':drive_id', id) ===
                location.pathname
                  ? 'active'
                  : 'fw-medium'
              }
            >
              Change Audit
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/view/donor-schedules`}
              className={
                location.pathname.includes('donor-schedules')
                  ? 'active'
                  : 'fw-medium'
              }
            >
              Donor Schedules
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/staffing`}
              className={
                location.pathname.includes('staffing') ? 'active' : 'fw-medium'
              }
            >
              Staffing
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/drives/${id}/view/${
                slug ?? ''
              }`}
              className={slug === `results` ? 'active' : 'fw-medium'}
            >
              Results
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DriveNavigationTabs;
