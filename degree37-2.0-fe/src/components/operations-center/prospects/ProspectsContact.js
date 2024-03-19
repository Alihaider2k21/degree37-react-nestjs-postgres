import React, { useEffect, useState } from 'react';
import { OPERATIONS_CENTER, OS_PROSPECTS_PATH } from '../../../routes/path';
import TopBar from '../../common/topbar/index';
import NavTabs from '../../common/navTabs';
import { useLocation } from 'react-router-dom';
import TableList from '../../common/tableListing';

const ProspectsContact = () => {
  const location = useLocation();
  const currentLocation = location.pathname;
  //   const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [prospectsData, setProspectsData] = useState([]);

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
      label: 'Contacts',
      class: 'disable-label',
      link: OS_PROSPECTS_PATH.CONTACTS,
    },
  ];

  const tableHeaders = [
    {
      name: 'contact_name',
      label: 'Contact Name',
      width: '25%',
      sortable: true,
    },
    {
      name: 'account',
      label: 'Account',
      sortable: true,
      width: '25%',
    },
    {
      name: 'email_status',
      label: 'Email Status',
      sortable: true,
      width: '25%',
      innerClassName: 'badge active',
    },
    {
      name: 'date',
      label: 'Updated',
      sortable: true,
      width: '25%',
      className: 'text-left',
    },
  ];

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  useEffect(() => {
    setProspectsData(() => [
      {
        contact_name: 'Pam Beesly',
        account: 'The Office',
        email_status: 'Read',
        date: '2023-07-15 09:00:00',
      },
      {
        contact_name: 'Pam Beesly',
        account: 'The Office',
        email_status: 'Read',
        date: '2023-07-15 09:00:00',
      },
      {
        contact_name: 'Pam Beesly',
        account: 'The Office',
        email_status: 'Read',
        date: '2023-07-15 09:00:00',
      },
      {
        contact_name: 'Pam Beesly',
        account: 'The Office',
        email_status: 'Read',
        date: '2023-07-15 09:00:00',
      },
      {
        contact_name: 'Pam Beesly',
        account: 'The Office',
        email_status: 'Read',
        date: '2023-07-15 09:00:00',
      },
      {
        contact_name: 'Pam Beesly',
        account: 'The Office',
        email_status: 'Read',
        date: '2023-07-15 09:00:00',
      },
      {
        contact_name: 'Pam Beesly',
        account: 'The Office',
        email_status: 'Read',
        date: '2023-07-15 09:00:00',
      },
    ]);
  }, []);

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Prospect'}
          SearchPlaceholder={'Search'}
        />
        <div className="filterBar">
          <NavTabs tabs={Tabs} currentLocation={currentLocation} />
        </div>
        <div className="mainContentInner">
          <TableList
            //   isLoading={isLoading}
            data={prospectsData}
            headers={tableHeaders}
            handleSort={handleSort}
            sortOrder={sortOrder}
            optionsConfig={null}
            showVerticalLabel={null}
          />
        </div>
      </div>
    </>
  );
};

export default ProspectsContact;
