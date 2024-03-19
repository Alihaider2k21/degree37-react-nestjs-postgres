import React from 'react';
import { useParams } from 'react-router-dom';
import SessionTopTabs from './SessionTopTabs';
import ViewForm from '../../../common/ViewForm/index.js';
import { SessionBreadCrumbs } from './SessionBreadCrumbs';
import {
  SESSION_STAFFING_PATH,
  SESSION_TASKS_PATH,
} from '../../../../routes/path.js';
export default function SessionView() {
  const { id: session_id } = useParams();

  const SessionTabs = [
    {
      label: 'About',
      link: `/operations-center/operations/sessions/${session_id}/view/about`,
      className: 'p10',
    },
    {
      label: 'Shift Details',
      link: `/operations-center/operations/sessions/${session_id}/view/shift-details`,
      className: 'p10',
    },
    {
      label: 'Marketing Details',
      link: '#',
      className: 'p10',
    },
    {
      label: 'Tasks',
      link: SESSION_TASKS_PATH.LIST.replace(':session_id', session_id),
      className: 'p10',
    },
    {
      label: 'Documents',
      link: `/operations-center/operations/sessions/${session_id}/view/documents/notes`,
      className: 'p10',
    },
    {
      label: 'Change Audit',
      link: '#',
      className: 'p10',
    },
    {
      label: 'Donor Schedules',
      link: '#',
      className: 'p10',
    },
    {
      label: 'Staffing',
      link: SESSION_STAFFING_PATH.LIST.replace(':session_id', session_id),
      className: 'p10',
    },
    {
      label: 'Results',
      link: '#',
      className: 'p10',
    },
  ];
  const config = [
    {
      section: 'Session Details',
      fields: [
        { label: 'Owner', field: 'owner' },
        { label: 'Non Collection Profile', field: 'Non_Collection_Profile' },
        { label: 'Collection Operation', field: 'collection_operation' },
      ],
    },
    {
      section: 'Attributes',
      fields: [
        { label: 'Owner', field: 'owner' },
        { label: 'Non Collection Profile', field: 'Non_Collection_Profile' },
        { label: 'Collection Operation', field: 'collection_operation' },
      ],
    },
    {
      section: 'Custom Fields',
      fields: [
        { label: 'Lorem Epsem', field: 'Lorem Epsem' },
        { label: 'Lorem Epsem', field: 'Lorem Epsem' },
        { label: 'Lorem Epsem', field: 'Lorem Epsem' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          // field: 'status',
          format: (value) => (value ? 'Confirmed' : 'Not Confirmed'),
        },
        {
          label: 'Created',
          field: 'created_by',
        },

        {
          label: 'Modified',
          field: 'modified_by',
        },
      ],
    },
  ];
  return (
    <div>
      <ViewForm
        breadcrumbsData={SessionBreadCrumbs}
        breadcrumbsTitle={'About'}
        data={null}
        config={config}
        customTopBar={<SessionTopTabs tabs={SessionTabs} />}
      />
    </div>
  );
}
