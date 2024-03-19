import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../common/pagination/index';
import TopBar from '../../../../common/topbar/index';
import SvgComponent from '../../../../common/SvgComponent';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import axios from 'axios';

const TenantsList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [tenants, setTenants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('token');

  const currentUrl = window.location.href;

  const BreadcrumbsData = [
    { label: 'Dashboard', class: 'disable-label', link: '/dashboard' },
    {
      label: 'Tenant Management',
      class: 'active-label',
      link: '/system-configuration/platform-admin/tenant-management',
    },
  ];

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${BASE_URL}/tenants`, {
        params: {
          limit: limit,
          page: currentPage,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.data;
      setTenants(data?.data);
      setTotalRecords(data?.count);
    };

    const handleSearchChange = async (e) => {
      try {
        const response = await axios.get(`${BASE_URL}/tenants`, {
          params: {
            limit: limit,
            page: currentPage,
            tenantName: searchText,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.data;
        setTenants(data.data);
        setTotalRecords(data?.count);
      } catch (error) {
        console.error('Error searching data:', error);
      }
    };

    if (!searchText) {
      getData(limit, currentPage);
    }
    if (searchText) {
      handleSearchChange(searchText);
    }
    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [currentPage, limit, searchText, BASE_URL]);

  const impersonateTenantAdminUser = async (tenantId) => {
    const response = await axios.post(
      `${BASE_URL}/tenants/user/impersonate/${tenantId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.data;
    const { realm, keycloakIdentity, username } = data.data;

    if (realm && keycloakIdentity && username) {
      const url = new URL(currentUrl);
      const protocol = url?.protocol;
      const parts = url?.hostname.split('.');
      const subdomain = realm;
      const domain = parts?.length > 1 ? parts.slice(1).join('.') : 'localhost';
      const port = url?.port ? `:${url?.port}` : '';
      const newTabUrl = `${protocol}//${subdomain}.${domain}${port}/impersonate-login?keycloakIdentity=${keycloakIdentity}&username=${username}`;

      const newTab = window.open(newTabUrl, '_blank');
      if (newTab) {
        newTab.focus();
      } else {
        console.error(
          'Failed to open new tab. Please check your browser settings.'
        );
      }
    }
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate('/system-configuration/platform-admin/tenant-management/create');
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedTenants = useMemo(() => {
    const sorted = [...tenants];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [tenants, sortBy, sortOrder]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Tenants'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Tenant
            </button>
          </div>
        )}
        <div className="table-listing-main">
          {/* <Scripts setActiveIndex={setActiveIndex} setId={setId} /> */}

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="20%">
                    Tenant Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('tenant_name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="20%">
                    Phone
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('phone_number')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="20%">
                    Email
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('email')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="20%">
                    Domain
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('tenant_domain')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="10%">
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('is_active')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner justify-content-center">
                      <span className="title">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTenants?.length ? (
                  sortedTenants?.map((tenant) => {
                    return (
                      <tr key={tenant.id}>
                        <td>{tenant.tenant_name}</td>
                        <td>{tenant.phone_number}</td>
                        <td>{tenant.email}</td>
                        <td>{tenant.tenant_domain}</td>
                        <td>
                          {tenant.is_active ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">InActive</span>
                          )}
                        </td>
                        <td className="options">
                          <div className="dropdown-center">
                            <div
                              className="optionsIcon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              // style={{justifyContent:"start",position:"relative"}}
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu">
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .TENANT_MANAGEMENT.READ,
                                Permissions.SYSTEM_CONFIGURATION
                                  .TENANT_MANAGEMENT.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${tenant.id}/view`}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .TENANT_MANAGEMENT.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${tenant.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .TENANT_MANAGEMENT.LOGIN_AS_TENANT,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`#`}
                                    onClick={() =>
                                      impersonateTenantAdminUser(tenant?.id)
                                    }
                                  >
                                    Login As Tenant
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .TENANT_MANAGEMENT.ADD_CONFIG,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${tenant.id}/configuration`}
                                  >
                                    Add Configuration
                                  </Link>
                                </li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="no-data" colSpan="9">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
      </div>
    </div>
  );
};

export default TenantsList;
