import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import ContactNavigation from '../ContactNavigation';
import AliasForm from './components/AliasForm';

const GetAlias = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [alias, setAlias] = useState();
  const bearerToken = localStorage.getItem('token');

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
      label: 'Contacts',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Alias',
      class: 'active-label',
      link: '/system-configuration/crm-administration/contacts/alias',
    },
  ];

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const getData = async () => {
    try {
      const result = await fetch(`${BASE_URL}/crm-admin/alias?type=CONTACT`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
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
      <ContactNavigation />
      <div className="mainContentInner">
        <div className="buttons">
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate(
                '/system-configuration/tenant-admin/crm-admin/contacts/alias/edit',
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
