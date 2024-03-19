import React from 'react';
import ViewForm from '../../common/ViewForm';
import { OPERATIONS_CENTER, OS_PROSPECTS_PATH } from '../../../routes/path';
import TopBar from '../../common/topbar/index';
import NavTabs from '../../common/navTabs';
import { useLocation } from 'react-router-dom';

const ProspectsAbout = () => {
  const location = useLocation();
  const currentLocation = location.pathname;

  const Tabs = [
    {
      label: 'About',
      link: '/operations-center/prospects/1/about',
    },
    {
      label: 'Contacts',
      link: '/operations-center/prospects/1/contacts',
    },
  ];

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Prospect',
      class: 'disable-label',
      link: OS_PROSPECTS_PATH.LIST,
    },
    {
      label: 'View Prospect',
      class: 'disable-label',
      link: OS_PROSPECTS_PATH.ABOUT,
    },
    {
      label: 'About',
      class: 'disable-label',
      link: OS_PROSPECTS_PATH.ABOUT,
    },
  ];

  const data = {
    template: 'Summer Drives Needed',
    message_type: 'Email',
    target_date: '06-27-2023',
    projection: '50-70',
    location_type: 'inside',
    eligibility: '>56 Days Before, After',
    distance: '0-50 Miles',
    organizational_level: 'Metro Mobile',
    schedule_send: '06-27-2023',
    created_by: 'John Doe | Dec 21, 2022 | 18:10',
    modified_by: 'John Doe | May 3rd, 2023 | 17:52',
  };

  const additionalMessage = {
    section: 'Email Message',
    message: '<h1>Hello User!</h1>',
  };

  const config = [
    {
      section: 'Email Details',
      fields: [
        { label: 'Template', field: 'template' },
        { label: 'Message Type', field: 'message_type' },
      ],
    },
    {
      section: 'Filters',
      fields: [
        { label: 'Target Date', field: 'target_date' },
        { label: 'Projection', field: 'projection' },
        { label: 'Location Type', field: 'location_type' },
        { label: 'Eligibility', field: 'eligibility' },
        { label: 'Distance', field: 'distance' },
        { label: 'Organizational Level', field: 'organizational_level' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Schedule Send',
          field: 'schedule_send',
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
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Prospect'}
        />
        <div className="filterBar">
          <NavTabs tabs={Tabs} currentLocation={currentLocation} />
        </div>
        <ViewForm
          className="contact-view"
          data={data}
          config={config}
          // additional={additionalItems}
          additionalMessage={additionalMessage}
        />
      </div>
    </>
  );
};

export default ProspectsAbout;
