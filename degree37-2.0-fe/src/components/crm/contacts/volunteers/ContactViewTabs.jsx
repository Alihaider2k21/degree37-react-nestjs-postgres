import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../../../../styles/Global/Global.scss';
import '../../../../styles/Global/Variable.scss';
import { CRM_VOLUNTEER_TASKS_PATH } from '../../../../routes/path';

const ContactsViewNavigationTabs = () => {
  const location = useLocation();
  const currentLocation = location.pathname;
  const params = useParams();
  const { id, volunteerId } = params;

  return (
    <div className="filterBar p-0 ">
      <div className="tabs">
        <ul>
          <li>
            <Link
              to={`/crm/contacts/volunteers/${volunteerId ?? id}/view`}
              className={
                currentLocation ===
                `/crm/contacts/volunteers/${volunteerId ?? id}/view`
                  ? 'active'
                  : ''
              }
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/contacts/volunteers/${
                volunteerId ?? id
              }/view/communication`}
              className={
                currentLocation ===
                `/crm/contacts/volunteers/${
                  volunteerId ?? id
                }/view/communication`
                  ? 'active'
                  : currentLocation ===
                    `/crm/contacts/volunteers/${
                      volunteerId ?? id
                    }/view/communication/${id}/view`
                  ? 'active'
                  : ''
              }
            >
              Communication
            </Link>
          </li>
          <li>
            <Link
              to={CRM_VOLUNTEER_TASKS_PATH.LIST.replace(
                ':volunteerId',
                volunteerId ?? id
              )}
              className={
                currentLocation ===
                CRM_VOLUNTEER_TASKS_PATH.LIST.replace(
                  ':volunteerId',
                  volunteerId ?? id
                )
                  ? 'active'
                  : ''
              }
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/contacts/volunteer/${
                volunteerId ?? id
              }/view/documents/notes`}
              className={currentLocation.includes('documents') ? 'active' : ''}
            >
              Documents
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/contacts/volunteers/${volunteerId ?? id}/view/service`}
              className={
                currentLocation ===
                `/crm/contacts/volunteers/${volunteerId ?? id}/view/service`
                  ? 'active'
                  : currentLocation ===
                    `/crm/contacts/volunteers/${
                      volunteerId ?? id
                    }/view/service/${id}/view`
                  ? 'active'
                  : ''
              }
            >
              Service History
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/contacts/volunteers/${volunteerId ?? id}/view/activity`}
              className={
                currentLocation ===
                `/crm/contacts/volunteers/${volunteerId ?? id}/view/activity`
                  ? 'active'
                  : currentLocation ===
                    `/crm/contacts/volunteers/${
                      volunteerId ?? id
                    }/view/activity/${id}/view`
                  ? 'active'
                  : ''
              }
            >
              Activity Log
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/contacts/volunteers/${
                volunteerId ?? id
              }/view/duplicates`}
              className={
                currentLocation ===
                `/crm/contacts/volunteers/${volunteerId ?? id}/view/duplicates`
                  ? 'active'
                  : ''
              }
            >
              Duplicates
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactsViewNavigationTabs;
