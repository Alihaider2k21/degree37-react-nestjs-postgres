import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS } from '../../../../routes/path';
import SvgComponent from '../../../common/SvgComponent';

const NCENavigationTabs = ({ editName, editLink, fromView }) => {
  const { non_collection_events_id, id, slug } = useParams();
  const location = useLocation();
  return (
    <div className="filterBar p-0 mt-4 mb-3">
      <div className="tabs border-0 mb-0 d-flex justify-content-between">
        <ul>
          <li>
            <Link
              to={`/operations-center/operations/non-collection-events/${id}/view`}
              className={slug === `about` ? 'active' : 'fw-medium'}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={`/operations-center/operations/non-collection-events/${id}/view/${slug}`}
              className={slug === `shift_details` ? 'active' : 'fw-medium'}
            >
              Shift Details
            </Link>
          </li>
          {/* <li>
            <Link
              to={`/operations-center/operations/non-collection-events/${
                non_collection_events_id ?? id
              }/view/${slug}`}
              className={slug === `marketing_details` ? 'active' : 'fw-medium'}
            >
              Marketing Details
            </Link>
          </li> */}
          <li>
            <Link
              to={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.LIST.replace(
                ':non_collection_events_id',
                non_collection_events_id ?? id
              )}
              className={
                location.pathname ===
                  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.LIST.replace(
                    ':non_collection_events_id',
                    non_collection_events_id ?? id
                  ) ||
                location.pathname ===
                  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.VIEW.replace(
                    ':non_collection_events_id',
                    non_collection_events_id
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
              to={`/operations-center/operations/non-collection-events/${
                non_collection_events_id ?? id
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
              to={`/operations-center/operations/non-collection-events/${
                non_collection_events_id ?? id
              }/view/${slug}`}
              className={slug === `change_audit` ? 'active' : 'fw-medium'}
            >
              Change Audit
            </Link>
          </li>
          {/* <li>
            <Link
              to={`/operations-center/operations/non-collection-events/${id}/view/${slug}`}
              className={slug === `donor_schedules` ? 'active' : 'fw-medium'}
            >
              Donor Schedules
            </Link>
          </li> */}
          <li>
            <Link
              to={`/operations-center/operations/non-collection-events/${id}/view/${slug}`}
              className={slug === `staffing` ? 'active' : 'fw-medium'}
            >
              Staffing
            </Link>
          </li>
          {/* <li>
            <Link
              to={`/operations-center/operations/non-collection-events/${id}/view/${slug}`}
              className={slug === `results` ? 'active' : 'fw-medium'}
            >
              Results
            </Link>
          </li> */}
        </ul>
        {editName && (
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

export default NCENavigationTabs;
