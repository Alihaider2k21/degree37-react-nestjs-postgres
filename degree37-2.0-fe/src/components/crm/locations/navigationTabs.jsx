import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../../../styles/Global/Global.scss';
import '../../../styles/Global/Variable.scss';
import { LOCATIONS_TASKS_PATH } from '../../../routes/path';
import SvgComponent from '../../common/SvgComponent';

const AccountViewNavigationTabs = ({ editLink }) => {
  const location = useLocation();
  const { id, crm_location_id, locationId } = useParams();
  const currentLocation = location.pathname;

  return (
    <div className="filterBar p-0 mt-4 mb-3">
      <div className="tabs mb-0 d-flex justify-content-between">
        <ul className="">
          <li>
            <Link
              to={`/crm/locations/${crm_location_id ?? id ?? locationId}/view`}
              className={
                currentLocation ===
                `/crm/locations/${crm_location_id ?? id ?? locationId}/view`
                  ? 'active'
                  : ''
              }
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={LOCATIONS_TASKS_PATH.LIST.replace(
                ':crm_location_id',
                crm_location_id ?? id ?? locationId
              )}
              className={
                currentLocation ===
                  LOCATIONS_TASKS_PATH.LIST.replace(
                    ':crm_location_id',
                    crm_location_id ?? id ?? locationId
                  ) ||
                currentLocation ===
                  LOCATIONS_TASKS_PATH.VIEW.replace(
                    ':crm_location_id',
                    crm_location_id ?? id ?? locationId
                  ).replace(':id', id)
                  ? 'active'
                  : ''
              }
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/locations/${
                crm_location_id ?? id ?? locationId
              }/view/documents/notes`}
              className={currentLocation.includes(`documents`) ? 'active' : ''}
            >
              Documents
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/locations/${
                crm_location_id ?? id ?? locationId
              }/directions`}
              className={currentLocation.includes('directions') ? 'active' : ''}
            >
              Directions
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/locations/${
                crm_location_id ?? id ?? locationId
              }/view/drive-history`}
              className={
                currentLocation ===
                `/crm/locations/${
                  crm_location_id ?? id ?? locationId
                }/view/drive-history`
                  ? 'active'
                  : ''
              }
            >
              Drive History
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/locations/${
                crm_location_id ?? id ?? locationId
              }/view/duplicates`}
              className={
                currentLocation ===
                `/crm/locations/${
                  crm_location_id ?? id ?? locationId
                }/view/duplicates`
                  ? 'active'
                  : ''
              }
            >
              Duplicates
            </Link>
          </li>
        </ul>
        {editLink ? (
          <div className="buttons" style={{ marginBottom: '15px' }}>
            <Link to={editLink}>
              <span className="icon">
                <SvgComponent name="EditIcon" />
              </span>
              <span className="text edit_location">Edit</span>
            </Link>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default AccountViewNavigationTabs;
