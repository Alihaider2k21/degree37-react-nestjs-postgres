import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Donor from './Donor';
import SvgComponent from '../../../common/SvgComponent';
import { CRM_DONOR_SCHEDULE_PATH } from '../../../../routes/path';

function DonorNavigation({
  children,
  editUrl = null,
  editLabel = null,
  donor,
}) {
  const location = useLocation();
  const params = useParams();
  const tabs = [
    {
      name: 'About',
      paths: [`/crm/contacts/donor/${params?.donorId}/view`],
    },
    {
      name: 'Communication',
      paths: [
        `/crm/contacts/donor/${params?.donorId}/view/communication`,
        `/crm/contacts/donor/${params?.donorId}/view/communication/${params?.id}/view`,
      ],
    },
    {
      name: 'Tasks',
      paths: [
        `/crm/contacts/donor/${params?.donorId}/tasks`,
        `/crm/contacts/donor/${params?.donorId}/tasks/${params?.id}/view`,
      ],
    },
    {
      name: 'Documents',
      paths: [
        `/crm/contacts/donor/${params?.donorId}/view/documents/notes`,
        `/crm/contacts/donor/${params?.donorId}/view/documents/notes/${params.noteId}/view`,
        `/crm/contacts/donor/${params?.donorId}/view/documents/attachments`,
        `/crm/contacts/donor/${params?.donorId}/view/documents/attachments/${params.attachId}/view`,
      ],
    },
    {
      name: 'Recent Activity',
      paths: [`/crm/contacts/donor/${params?.donorId}/view/recent-activity`],
    },
    {
      name: 'Donation History',
      paths: [`/crm/contacts/donor/${params?.donorId}/donation-history`],
    },
    {
      name: 'Duplicates',
      paths: [`/crm/contacts/donor/${params?.donorId}/view/duplicates`],
    },
    {
      name: 'Schedule',
      paths: [
        CRM_DONOR_SCHEDULE_PATH.LIST.replace(':donorId', params?.donorId),
        CRM_DONOR_SCHEDULE_PATH.VIEW.replace(
          ':donorId',
          params?.donorId
        ).replace(':schedule', params?.schedule),
      ],
    },
  ];

  const currentTab = tabs.find((tab) => tab.paths.includes(location.pathname));
  console.log(location.pathname);
  return (
    <div>
      <div className="filterBar bg-white pb-0">
        <Donor donor={donor} />
        <div className="tabs border-0 mb-0 d-flex justify-between">
          <ul>
            {tabs.map((tab, index) => (
              <li key={`Tab-${index}`}>
                <Link
                  to={tab.paths[0]}
                  className={`${
                    currentTab?.name === tab?.name ? 'active' : ''
                  }`}
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

export default React.memo(DonorNavigation);
