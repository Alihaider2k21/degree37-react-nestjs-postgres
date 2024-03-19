import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../common/pagination';
// import SvgComponent from '../../../../common/SvgComponent';
import TopBar from '../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequestAxios } from '../../../../../helpers/Api';
import ArchivePopUpModal from '../../../../common/successModal';
import TableList from '../../../../common/tableListing';
import { formatUser } from '../../../../../helpers/formatUser';
import SuccessPopUpModal from '../../../../common/successModal';
import SelectDropdown from '../../../../common/selectDropdown';
import { GeoAdministrationBreadCrumbsData } from '../GeoAdministrationBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

const TerritoryManagementList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [territoryManagements, setTerritoryManagements] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [territoryId, setTerritoryId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [recruiterText, setRecruiterText] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
  const [recruiterId, setRecruiterId] = useState('');
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });

  const navigate = useNavigate();

  const fetchRecruiters = async () => {
    try {
      const response = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/tenant-users/recruiters`
      );
      const data = response.data;
      setRecruiters(data?.data);
    } catch (error) {
      console.error('Error Territory Create:', error);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleRecruiter = (value) => {
    setRecruiterId(value?.value || '');
    setRecruiterText(value);
  };

  const handleIsActive = (value) => {
    setIsActive(value);
  };

  const getTerritories = async () => {
    try {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/territories?limit=${limit}&page=${currentPage}${
          isActive ? `&status=${isActive?.value ?? ''}` : ''
        }${recruiterId ? `&recruiter_id=${recruiterId}` : ''}${
          searchText?.length > 1 ? `&name=${searchText}` : ''
        }`
      );
      const data = result.data;
      console.log(data?.data);
      setTerritoryManagements(data?.data || []);
      setIsLoading(false);
      setTotalRecords(data?.total_territories_count);
    } catch (error) {
      toast.error('Failed to fetch Territory Management', {
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTerritories();
  }, [limit, currentPage, isActive, recruiterId, searchText]);

  const handleAddClick = () => {
    navigate('/system-configuration/tenant-admin/geo-admin/territories/create');
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedTerritoryManagements = useMemo(() => {
    const sorted = [...territoryManagements];
    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string') aValue = aValue?.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue?.toLowerCase();

        console.log(aValue);
        console.log(bValue);

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
  }, [territoryManagements, sortBy, sortOrder]);

  const archiveTerritory = async () => {
    try {
      const res = await makeAuthorizedApiRequestAxios(
        'PATCH',
        `${BASE_URL}/territories/${territoryId}`
      );
      let { data, status, response } = res.data;
      if (
        status === 'success' ||
        response?.status === 201 ||
        response?.status === 204 ||
        response?.status === 201
      ) {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
        await getTerritories();
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const tableHeaders = [
    {
      name: 'territory_name',
      label: 'Territory Name',
      width: '20%',
      sortable: true,
    },
    {
      name: 'description',
      label: 'Description',
      width: '30%',
      sortable: true,
    },
    {
      name: 'recruiter',
      label: 'Recruiter',
      width: '20%',
      sortable: true,
    },
    { name: 'status', label: 'Status', width: '20%', sortable: true },
  ];

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const optionsConfig = [
    CheckPermission([
      Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/geo-admin/territories/${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/geo-admin/territories/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => {
        setTerritoryId(rowData.id);
        setModalPopUp(true);
      },
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={GeoAdministrationBreadCrumbsData}
        BreadCrumbsTitle={'Territory Management'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="filterInner pe-3">
          <h2>Filters</h2>

          <div className="filter">
            <form className="d-flex">
              <SelectDropdown
                styles={{ root: 'me-3' }}
                placeholder={'Recruiter'}
                defaultValue={recruiterText}
                selectedValue={recruiterText}
                removeDivider
                showLabel
                onChange={handleRecruiter}
                options={
                  recruiters?.length > 0
                    ? recruiters.map((item) => {
                        return {
                          label: formatUser(item, 1),
                          value: item?.id,
                        };
                      })
                    : []
                }
              />
              {/* <div className="dropdown me-3">
                <button
                  className={`dropdown-toggle ${styles.togglearrow}`}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    className={
                      recruiterText !== 'Recruiter'
                        ? 'text-black'
                        : 'text-secondary'
                    }
                  >
                    {recruiterText}
                  </span>
                </button>
                <ul
                  className={`dropdown-menu ${styles.selectTransparent} mt-2`}
                >
                  {recruiters && recruiters?.length ? (
                    <li>
                      <Link
                        name="default"
                        onClick={handleDefaultRecruiter}
                        className="dropdown-item"
                        href="#"
                      >
                        Select All
                      </Link>
                    </li>
                  ) : (
                    ''
                  )}

                  {recruiters && recruiters?.length ? (
                    recruiters?.map((item) => (
                      <li key={item.id}>
                        <Link
                          onClick={handleRecruiter}
                          id={item.id}
                          name={formatUser(item, 1)}
                          className="dropdown-item"
                          href="#"
                        >
                          {formatUser(item, 1)}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item">No option found</li>
                  )}
                </ul>
              </div> */}
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={isActive}
                selectedValue={isActive}
                removeDivider
                showLabel
                onChange={handleIsActive}
                options={[
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Territory
            </button>
          </div>
        )}

        <TableList
          isLoading={isLoading}
          data={sortedTerritoryManagements}
          headers={tableHeaders}
          handleSort={handleSort}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
        />

        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />

        <ArchivePopUpModal
          title={'Confirmation'}
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={modalPopUp}
          archived={archiveTerritory}
          isNavigate={false}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Territory is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};

export default TerritoryManagementList;
