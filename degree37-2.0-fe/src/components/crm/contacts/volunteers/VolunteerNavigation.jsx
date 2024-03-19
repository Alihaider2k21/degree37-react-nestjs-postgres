import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Volunteer from './Volunteer';
import SvgComponent from '../../../common/SvgComponent';

function VolunteerNavigation({
  children,
  editUrl = null,
  editLabel = null,
  volunteer = null,
}) {
  const params = useParams();
  const location = useLocation();

  const tabs = [
    {
      name: 'About',
      paths: [`/crm/contacts/volunteers/${params?.volunteerId}/view`],
    },
    {
      name: 'Communication',
      paths: [
        `/crm/contacts/volunteers/${params?.volunteerId}/view/communication`,
        `/crm/contacts/volunteers/${params?.volunteerId}/view/communication/${params?.id}/view`,
      ],
    },
    {
      name: 'Tasks',
      paths: [
        `/crm/contacts/volunteers/${params?.volunteerId}/view/tasks`,
        `/crm/contacts/volunteers/${params?.volunteerId}/view/tasks/${params?.id}/view`,
      ],
    },
    {
      name: 'Documents',
      paths: [
        `/crm/contacts/volunteer/${params?.volunteerId}/view/documents/notes`,
        `/crm/contacts/volunteer/${params?.volunteerId}/view/documents/notes/${params?.noteId}/view`,
        `/crm/contacts/volunteer/${params?.volunteerId}/view/documents/attachments/${params?.attachId}/view`,
        `/crm/contacts/volunteer/${params?.volunteerId}/view/documents/attachments`,
      ],
    },
    {
      name: 'Service History',
      paths: [`/crm/contacts/volunteers/${params?.volunteerId}/view/service`],
    },
    {
      name: 'Activity Log',
      paths: [`/crm/contacts/volunteers/${params?.volunteerId}/view/activity`],
    },
    {
      name: 'Duplicates',
      paths: [
        `/crm/contacts/volunteers/${params?.volunteerId}/view/duplicates`,
      ],
    },
  ];

  const currentTab = tabs.find((tab) => tab.paths.includes(location.pathname));

  return (
    <div>
      <div className="filterBar bg-white pb-0 mb-3">
        <Volunteer volunteer={volunteer} />
        <div className="tabs border-0 mb-0 d-flex justify-between">
          <ul>
            {tabs.map((tab, index) => (
              <li key={`Tab-${index}`}>
                <Link
                  to={tab.paths[0]}
                  className={`${currentTab?.name === tab.name ? 'active' : ''}`}
                >
                  {tab.name}
                </Link>
              </li>
            ))}
          </ul>
          {editUrl && (
            <div className="editAnchor">
              <a href={editUrl} className="text-sm">
                <SvgComponent name={'EditIcon'} /> Edit{' '}
                {editLabel || currentTab?.name}
              </a>
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

export default React.memo(VolunteerNavigation);
