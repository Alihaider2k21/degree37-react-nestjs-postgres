import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { USER_ROLES } from '../../../../routes/path';
import NavigationTabs from './navigationTabs';
import { UsersBreadCrumbsData } from '../../tenants-administration/user-administration/UsersBreadCrumbsData';
import TopBar from '../../../common/topbar/index';
import Pagination from '../../../common/pagination';
import SelectDropdown from '../../../common/selectDropdown';
import SvgComponent from '../../../common/SvgComponent';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';

const AssignedUsers = ({ roleId }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [userRoles, setUserRoles] = useState([]);
  console.log(setTotalRecords, setIsLoading);
  const BreadcrumbsData = [
    ...UsersBreadCrumbsData,
    {
      label: 'Assigned Users',
      class: 'disable-label',
      link: USER_ROLES.ASSIGN.replace(':id', roleId),
    },
  ];

  const getData = async () => {
    setIsLoading(true);
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/roles/tenant/assigned/${roleId}?search=${searchText}&page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isActive=${
        isActive?.value ?? ''
      }`
    );
    const data = await result.json();
    setUserRoles(data?.data);
    setIsLoading(false);
    setTotalRecords(data?.count);
  };

  useEffect(() => {
    getData();
  }, [currentPage, limit, BASE_URL, isActive, sortBy, sortOrder]);

  useEffect(() => {
    if (searchText.length >= 2 || searchText.length === 0) {
      setCurrentPage(1);
      getData();
    }
  }, [searchText]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else if (sortOrder === 'DESC') {
        setSortOrder('ASC');
      } else {
        setSortOrder('ASC');
        setSortBy('');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Assigned Users'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="mainContentInner">
        <div className="filterBar p-0">
          <NavigationTabs roleId={roleId} />
        </div>
        <div className="filterBar  p-0">
          <div className="filterInner">
            <h2>Filters</h2>
            <div className="filter">
              <form className="d-flex gap-3">
                <SelectDropdown
                  placeholder={'Status'}
                  defaultValue={isActive}
                  selectedValue={isActive}
                  removeDivider
                  showLabel
                  onChange={setIsActive}
                  options={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                  ]}
                />
              </form>
            </div>
          </div>
        </div>
        <div className="table-listing-main">
          <div className="table-responsive" style={{ overflow: 'auto' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th style={{ width: '50%' }} className="table-head">
                    User Name
                  </th>

                  <th className="table-head">
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('status')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="no-data text-center" colSpan="10">
                      Data Loading
                    </td>
                  </tr>
                ) : userRoles?.length > 0 ? (
                  userRoles?.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.first_name}</td>

                        <td>
                          {item.is_active ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">InActive</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="no-data text-center" colSpan="10">
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

export default AssignedUsers;
