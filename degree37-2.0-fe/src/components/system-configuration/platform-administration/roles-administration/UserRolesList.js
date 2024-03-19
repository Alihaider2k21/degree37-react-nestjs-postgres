import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../common/topbar/index';

const UsersRolesList = () => {
  const [searchText, setSearchText] = useState('Search Here...');
  const navigate = useNavigate();
  const BreadcrumbsData = [
    { label: 'System Configurations', class: 'disable-label', link: '/' },
    {
      label: 'User Administration',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/roles',
    },
  ];

  const handleAddClick = () => {
    navigate('/system-configuration/tenant-admin/roles/create');
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'User Roles'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="mainContentInner">
        <div className="buttons">
          <button className="btn btn-primary" onClick={handleAddClick}>
            Create User Role
          </button>
        </div>
        <div className="table-listing-main"></div>
      </div>
    </div>
  );
};

export default UsersRolesList;
