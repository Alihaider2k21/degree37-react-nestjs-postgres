import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../../common/pagination/index';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import ArchivePopUpModal from '../../../../../common/successModal';
import ResourceNavigationTabs from '../navigationTabs';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const VehicleTypesList = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [locationType, setLocationType] = useState(null);
  const [isLinkable, setIsLinkable] = useState(null);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [vehicleTypeId, setVehicleTypeId] = useState(null);
  const navigate = useNavigate();
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Vehicle Type',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types',
    },
  ];

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await fetch(
        `${BASE_URL}/vehicle-types?limit=${limit}&page=${currentPage}&name=${searchText}&status=${
          isActive?.value ?? ''
        }&location_type=${locationType?.value || ''}&linkable=${
          isLinkable?.value || ''
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await result.json();
      setVehicleTypes(data?.data);
      setTotalRecords(data?.count);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    isActive,
    locationType,
    isLinkable,
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/create'
    );
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

  const handleIsLinkable = (value) => {
    setCurrentPage(1);
    setIsLinkable(value);
  };

  const handleLocationType = (value) => {
    setCurrentPage(1);
    setLocationType(value);
  };

  const handleIsActive = (value) => {
    setCurrentPage(1);
    setIsActive(value);
  };

  const sortedVehicleTypes = useMemo(() => {
    const sorted = [...vehicleTypes];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

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
  }, [vehicleTypes, sortBy, sortOrder]);

  const archiveVehicleType = async () => {
    // console.log({vehicleTypeId})

    try {
      const bearerToken = localStorage.getItem('token');
      const res = await fetch(
        `${BASE_URL}/vehicle-types/${parseInt(vehicleTypeId)}`,
        {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
        await getData();
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

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Vehicle Type'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <ResourceNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex">
              <SelectDropdown
                styles={{ root: 'me-3' }}
                placeholder={'Linkable'}
                defaultValue={isLinkable}
                selectedValue={isLinkable}
                removeDivider
                showLabel
                onChange={handleIsLinkable}
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
              />
              <SelectDropdown
                styles={{ root: 'me-3' }}
                placeholder={'Location Type'}
                defaultValue={locationType}
                selectedValue={locationType}
                removeDivider
                showLabel
                onChange={handleLocationType}
                options={[
                  { value: '1', label: 'Outside' },
                  { value: '2', label: 'Inside' },
                  { value: '3', label: 'Combination' },
                ]}
              />

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
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLE_TYPE
            .WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Vehicle Type
            </button>
          </div>
        )}

        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="15%">
                    Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="35%">
                    Description
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('description')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%">
                    Location Type
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('location_type_id')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%">
                    Linkable
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('linkable')}
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
                  <th width="10%" align="center">
                    <div className="d-flex justify-content-center">
                      <span className="title">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="no-data" colSpan="10">
                      Data Loading
                    </td>
                  </tr>
                ) : sortedVehicleTypes?.length ? (
                  sortedVehicleTypes?.map((vehicleType) => {
                    return (
                      <tr key={vehicleType.id}>
                        <td>{vehicleType.name}</td>
                        <td>{vehicleType.description}</td>
                        <td>{`${
                          vehicleType?.location_type_id === '1'
                            ? 'Outside'
                            : vehicleType?.location_type_id === '2'
                            ? 'Inside'
                            : vehicleType?.location_type_id === '3'
                            ? 'Combination'
                            : ''
                        }`}</td>
                        <td>{vehicleType.linkable ? 'Yes' : 'No'}</td>
                        <td>
                          {vehicleType.is_active ? (
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
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .RESOURCES.VEHICLE_TYPE.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${vehicleType.id}/view`}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .RESOURCES.VEHICLE_TYPE.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${vehicleType.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .RESOURCES.VEHICLE_TYPE.ARCHIVE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      setVehicleTypeId(vehicleType.id);
                                      setModalPopUp(true);
                                    }}
                                  >
                                    Archive
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
                    <td colSpan="6" className="text-center">
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
        <ArchivePopUpModal
          title={'Confirmation'}
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={modalPopUp}
          archived={archiveVehicleType}
          isNavigate={false}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Vehicle Type is archived."
          modalPopUp={archivedStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
          }
        />
      </div>
    </div>
  );
};

export default VehicleTypesList;
