import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import AliasForm from './components/AliasForm';
import { LocationsTabs } from '../tabs';
import NavTabs from '../../../../../common/navTabs';

const GetAlias = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  /* states */
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [alias, setAlias] = useState();
  const location = useLocation();
  const currentLocation = location.pathname;
  const bearerToken = localStorage.getItem('token');
  //const [isLoading, setIsLoading] = useState(true);

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
      label: 'Location',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Alias',
      class: 'active-label',
      link: '/system-configuration/crm-administration/location/alias',
    },
  ];

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const getData = async () => {
    //setIsLoading(true);
    try {
      const result = await fetch(`${BASE_URL}/crm-admin/alias?type=LOCATION`, {
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
      //setIsLoading(false);
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
      {/* filter bar */}
      <div className="filterBar">
        <NavTabs tabs={LocationsTabs} currentLocation={currentLocation} />
      </div>
      {/* set alias button */}
      <div className="mainContentInner form-container">
        <div className="buttons position-btn right-btn">
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate(
                '/system-configuration/tenant-admin/crm-admin/locations/alias/edit',
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

        {/* Alias Form */}
        <AliasForm isEdit={false} value={alias?.text} />
      </div>
    </div>
  );
};

export default GetAlias;
