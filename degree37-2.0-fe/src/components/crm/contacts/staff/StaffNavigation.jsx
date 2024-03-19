import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import StaffMember from './StaffMember';
import SvgComponent from '../../../common/SvgComponent';
import {
  CRM_STAFF_SCHEDULE_PATH,
  STAFF_TASKS_PATH,
} from '../../../../routes/path';

function StaffNavigation({
  children,
  editUrl = null,
  editLabel = null,
  fromView,
  refreshData = false,
}) {
  const { staffId, staff_id, id, noteId, attachId, schedule_id } = useParams();
  const params = useParams();
  const location = useLocation();

  const tabs = [
    {
      name: 'About',
      paths: [`/crm/contacts/staff/${staff_id ?? staffId ?? id}/view`],
    },
    {
      name: 'Availability',
      paths: [
        `/crm/contacts/staff/${staff_id ?? staffId ?? id}/view/availability`,
      ],
    },
    {
      name: 'Communication',
      paths: [
        `/crm/contacts/staff/${staff_id ?? staffId ?? id}/view/communication`,
        `/crm/contacts/staff/${staff_id ?? staffId ?? id}/view/communication/${
          params?.secondID
        }/view`,
      ],
    },
    {
      name: 'Tasks',
      paths: [
        STAFF_TASKS_PATH.LIST.replace(`:staff_id`, staff_id ?? staffId ?? id),
        STAFF_TASKS_PATH.VIEW.replace(`:staff_id`, staff_id).replace(':id', id),
      ],
    },
    {
      name: 'Documents',
      paths: [
        `/crm/contacts/staff/${staff_id ?? staffId ?? id}/view/documents/notes`,
        `/crm/contacts/staff/${
          staff_id ?? staffId ?? id
        }/view/documents/attachments`,
        `/crm/contacts/staff/${id}/view/documents/attachments/${attachId}/view`,
        `/crm/contacts/staff/${id}/view/documents/notes/${noteId}/view`,
      ],
    },
    {
      name: 'Schedule',
      paths: [
        CRM_STAFF_SCHEDULE_PATH.LIST.replace(
          ':staff_id',
          staff_id ?? staffId ?? id
        ),
        CRM_STAFF_SCHEDULE_PATH.VIEW.replace(
          ':staff_id',
          staff_id ?? staffId ?? id
        ).replace(':schedule_id', schedule_id ?? schedule_id ?? id),
      ],
    },
    {
      name: 'Leave',
      paths: [
        `/crm/contacts/staff/${staff_id ?? staffId ?? id}/view/leave`,
        `/crm/contacts/staff/${
          staff_id ?? staffId ?? id
        }/view/leave/${id}/view`,
      ],
    },
    // --- DISABLED DUE TO TICKET D37PD-3460 ---
    {
      name: 'Duplicates',
      paths: [
        `/crm/contacts/staff/${staff_id ?? staffId ?? id}/view/duplicates`,
      ],
    },
  ];

  const currentTab = tabs.find((tab) => tab.paths.includes(location.pathname));

  return (
    <div>
      <div className="filterBar bg-white pb-0 mb-3">
        <StaffMember refreshData={refreshData} />
        <div className="tabs border-0 mb-0 d-flex justify-between">
          <ul>
            {tabs.map((tab, index) => (
              <li key={`Tab-${index}`}>
                <Link
                  to={!tab.disabled ? tab.paths[0] : '#'}
                  className={`${currentTab?.name === tab.name ? 'active' : ''}`}
                >
                  {tab.name}
                </Link>
              </li>
            ))}
          </ul>
          {editUrl && (
            <div className="editAnchor">
              <Link to={editUrl} state={{ fromView }} className="text-sm">
                <SvgComponent name={'EditIcon'} /> Edit{' '}
                {editLabel || currentTab?.name}
              </Link>
            </div>
          )}
        </div>
      </div>
      {children && (
        <div className="filterBar">
          <div className="filterInner">
            <h2>Filters</h2>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(StaffNavigation);
