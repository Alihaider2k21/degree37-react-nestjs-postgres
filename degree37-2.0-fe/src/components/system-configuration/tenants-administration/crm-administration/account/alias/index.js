import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import NavTabs from '../../../../../common/navTabs/index';
import { accountTabs } from '../tabs';
import AliasForm from './components/AliasForm';

const GetAlias = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [alias, setAlias] = useState();
  const location = useLocation();
  const currentLocation = location.pathname;

  const BreadcrumbsData = [
    {
      label: 'System Configurations',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'CRM Administration',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Account',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Alias',
      class: 'active-label',
      link: '/system-configuration/crm-administration/accounts/alias',
    },
  ];

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const getData = async () => {
    try {
      const result = await fetch(`${BASE_URL}/crm-admin/alias?type=ACCOUNT`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await result.json();
      setAlias(data?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      console.log(alias);
    }
  };

  if (searchText) {
    console.log(searchText);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Alias'}
        SearchPlaceholder={'Search'}
        SearchValue={null}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs tabs={accountTabs} currentLocation={currentLocation} />
      </div>
      <div className="mainContentInner">
        <div className="buttons">
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate(
                '/system-configuration/tenant-admin/crm-admin/accounts/alias/edit',
                {
                  state: {
                    alias,
                  },
                }
              );
            }}
          >
            Set Alias Name
          </button>
        </div>
      </div>
      <AliasForm isEdit={false} value={alias?.text} />
    </div>
  );
};

export default GetAlias;
