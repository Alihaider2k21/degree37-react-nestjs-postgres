import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  OPERATIONS_CENTER_SESSIONS_CHANGE_AUDIT_PATH,
  SESSION_TASKS_PATH,
} from '../../../../routes/path';
import SvgComponent from '../../../common/SvgComponent';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';

const SessionsNavigationTabs = ({ editLink, editName, fromView }) => {
  const params = useParams();
  const id = params?.id || params?.session_id;
  const slug = params?.slug;
  const session_id = params?.session_id;
  const location = useLocation();
  let activeTab = location ? location?.pathname?.split('view/')[1] : null;

  return (
    <div className="filterBar p-0 mt-4 mb-3">
      <div className="tabs border-0 mb-0 d-flex justify-content-between">
        <ul>
          <li>
            <Link
              to={`/operations-center/operations/sessions/${
                session_id ?? id
              }/view/about`}
              className={slug === `about` ? 'active' : 'fw-medium'}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/sessions/${
                session_id ?? id
              }/view/shift-details`}
              className={
                slug || activeTab === `shift-details` ? 'active' : 'fw-medium'
              }
            >
              Shift Details
            </Link>
          </li>
          <li>
            <Link
              to={`#`}
              className={slug === `marketing_details` ? 'active' : 'fw-medium'}
            >
              Marketing Details
            </Link>
          </li>
          <li>
            <Link
              to={SESSION_TASKS_PATH.LIST.replace(
                ':session_id',
                session_id ?? id
              )}
              className={
                SESSION_TASKS_PATH.LIST.replace(
                  ':session_id',
                  session_id ?? id
                ) === location.pathname ||
                location.pathname ===
                  SESSION_TASKS_PATH.VIEW.replace(
                    ':session_id',
                    session_id
                  ).replace(':id', id)
                  ? 'active'
                  : 'fw-medium'
              }
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/sessions/${
                session_id ?? id
              }/view/documents/notes`}
              className={
                location.pathname.includes('documents') ? 'active' : 'fw-medium'
              }
            >
              Documents
            </Link>
          </li>
          <li>
            <Link
              to={OPERATIONS_CENTER_SESSIONS_CHANGE_AUDIT_PATH.LIST.replace(
                ':id',
                id
              )}
              className={
                location.pathname ===
                OPERATIONS_CENTER_SESSIONS_CHANGE_AUDIT_PATH.LIST.replace(
                  ':id',
                  id
                )
                  ? 'active'
                  : 'fw-medium'
              }
            >
              Change Audit
            </Link>
          </li>
          <li>
            <Link
              to={`#`}
              className={slug === `donor_schedules` ? 'active' : 'fw-medium'}
            >
              Donor Schedules
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/sessions/${id}/staffing`}
              className={
                location.pathname.includes('staffing') ? 'active' : 'fw-medium'
              }
            >
              Staffing
            </Link>
          </li>
          <li>
            <Link
              to={`#`}
              className={slug === `results` ? 'active' : 'fw-medium'}
            >
              Results
            </Link>
          </li>
        </ul>
        {editName &&
          CheckPermission([
            Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.WRITE,
          ]) && (
            <div className="buttons">
              <Link to={editLink} state={{ fromView }}>
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span
                  className="text"
                  style={{
                    fontSize: '14px',
                    color: 'rgb(56, 125, 229)',
                    fontWeight: '400',
                    transition: 'inherit',
                  }}
                >
                  {editName}
                </span>
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default SessionsNavigationTabs;
