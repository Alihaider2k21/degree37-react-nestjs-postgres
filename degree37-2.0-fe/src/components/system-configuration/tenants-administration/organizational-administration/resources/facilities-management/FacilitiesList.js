import React, { useEffect, useState, useMemo, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import { debounce } from 'lodash';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import SvgComponent from '../../../../../common/SvgComponent';
import TopBar from '../../../../../common/topbar/index';
import Pagination from '../../../../../common/pagination';
import ResourceNavigationTabs from '../navigationTabs';
import { FACILITIES_PATH } from '../../../../../../routes/path';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const FacilitiesList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [Facilities, setFacilities] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [status, setStatus] = useState({ label: 'Active', value: 'true' });
  const [collection_operation, setCollection_operation] = useState([]);
  const [archivePopup, setArchivePopup] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [facilitityId, setFacilitityId] = useState('');
  const [facilitityIndex, setFacilitityIndex] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  const fetchCollectionOperations = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/business_units/collection_operations/list?status=true`
      );
      let data;
      if (result) {
        data = await result.json();
      }
      if (data?.response === 'success') {
        setCollectionOperationData(data?.data);
      } else {
        toast.error('Error Fetching Collection Operations', {
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchCollectionOperations();
  }, []);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  }, [userId]);

  const debounceFetch = debounce((value) => {
    filterFacility(value);
  }, 500);

  const searchFieldChange = (e) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };
  useEffect(() => {
    debounceFetch(searchText);
  }, [searchText]);

  const handleArcheive = async () => {
    try {
      const bearerToken = localStorage.getItem('token');
      const address = {
        ...Facilities[facilitityIndex].address,
        latitude: Facilities[facilitityIndex].address?.coordinates?.x,
        longitude: Facilities[facilitityIndex].address?.coordinates?.y,
      };
      const body = {
        ...Facilities[facilitityIndex],
        address: address,
        is_archived: true,
        created_by: parseInt(userId),
      };
      const _URL = `${BASE_URL}/system-configuration/facilities/${facilitityId}`;
      const response = await fetch(_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          ...body,
          industry_category: Facilities[facilitityIndex].industry_category?.id,
          industry_sub_category:
            Facilities[facilitityIndex].industry_sub_category?.id,
          collection_operation:
            Facilities[facilitityIndex].collection_operation.id,
        }),
      });
      const result = await response.json();
      if (result?.status === 'success') {
        filterFacility('');
        setArchivePopup(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${result?.message?.[0] ?? result?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${result?.message?.[0] ?? result?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleAddClick = () => {
    navigate(FACILITIES_PATH.CREATE);
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

  const sortedFacilities = useMemo(() => {
    const sorted = Facilities ? [...Facilities] : [];
    if (sortBy === 'collection_operation.name') {
      if (sortBy && sortOrder) {
        sorted.sort((a, b) => {
          const aValue =
            sortBy === 'collection_operation.name'
              ? a.collection_operation.name
              : a[sortBy];
          const bValue =
            sortBy === 'collection_operation.name'
              ? b.collection_operation.name
              : b[sortBy];

          if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
    } else if (sortBy === 'city') {
      if (sortBy && sortOrder) {
        sorted.sort((a, b) => {
          const aValue = sortBy === 'city' ? a.address.city : a[sortBy];
          const bValue = sortBy === 'city' ? b.address.city : b[sortBy];

          if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
    } else if (sortBy === 'state') {
      if (sortBy && sortOrder) {
        sorted.sort((a, b) => {
          const aValue = sortBy === 'state' ? a.address.state : a[sortBy];
          const bValue = sortBy === 'state' ? b.address.state : b[sortBy];

          if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
    } else {
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
    }
    return sorted;
  }, [Facilities, sortBy, sortOrder]);

  const filterFacility = async (searchvalue, signal = null) => {
    setIsLoading(true);
    let collectionOperationValues = '';
    if (collection_operation?.length > 0)
      collectionOperationValues = collection_operation
        ?.map((op) => op?.id)
        .join(',');
    const bearerToken = localStorage.getItem('token');
    try {
      let q = '';
      if (status) {
        q += `&status=${status?.value ?? ''}`;
      }
      if (collection_operation) {
        q += `&collection_operation=${collectionOperationValues}`;
      }
      if (searchvalue) {
        q += `&search=${searchvalue}`;
      }
      const result = await fetch(
        `${BASE_URL}/system-configuration/facilities?limit=${limit}&page=${currentPage}${q}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        },
        { signal }
      );
      const data = await result.json();
      setFacilities(data.data);
      setTotalRecords(data.total_records);
    } catch (error) {
      console.error('Error filtering data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectionOperation = (data) => {
    setCollection_operation((prevSelected) =>
      prevSelected.some((item) => item.id === data.id)
        ? prevSelected.filter((item) => item.id !== data.id)
        : [...prevSelected, data]
    );
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    filterFacility('', signal);
    return () => {
      abortController.abort();
    };
  }, [status, collection_operation, currentPage, limit, BASE_URL]);

  const BreadCrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Facilities',
      class: 'active-label',
      link: FACILITIES_PATH.LIST,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadCrumbsData}
        BreadCrumbsTitle={'Facilities'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <ResourceNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter ">
            <form className="d-flex gap-3">
              <GlobalMultiSelect
                label="Collection Operation"
                data={collectionOperationData.map((item) => {
                  return {
                    name: item.name,
                    id: item.id,
                  };
                })}
                selectedOptions={collection_operation}
                onChange={handleCollectionOperation}
                onSelectAll={(data) => setCollection_operation(data)}
              />
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={status}
                selectedValue={status}
                removeDivider
                showLabel
                onChange={(value) => {
                  setCurrentPage(1);
                  setStatus(value);
                }}
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
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.FACILITIES.WRITE,
        ]) && (
          <div className="buttons gap-2">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Facility
            </button>
          </div>
        )}
        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-head">
                    BECS Code
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('code')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    City
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('city')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    State
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('state')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    {'Donor Center'.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />} {word}
                      </React.Fragment>
                    ))}
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('donor_center')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    {'Staging Site'.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />} {word}
                      </React.Fragment>
                    ))}
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('staging_site')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    {'Collection Operation'.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />} {word}
                      </React.Fragment>
                    ))}
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('collection_operation.name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
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

                  <th className="table-head" align="center">
                    <div className="inliner justify-content-center">
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
                ) : sortedFacilities.length > 0 ? (
                  sortedFacilities?.length ? (
                    sortedFacilities?.map((facility, index) => (
                      <Fragment key={facility.id}>
                        <tr>
                          <td>{facility?.code}</td>
                          <td>{facility?.name}</td>
                          <td>{facility?.address?.city}</td>
                          <td>{facility?.address?.state}</td>
                          <td>{facility?.donor_center ? 'True' : 'False'}</td>
                          <td>{facility?.staging_site ? 'True' : 'False'}</td>
                          <td>{facility?.collection_operation?.name}</td>
                          <td>
                            {facility?.status ? (
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
                              >
                                <SvgComponent name={'ThreeDots'} />
                              </div>
                              <ul className="dropdown-menu ">
                                {CheckPermission([
                                  Permissions.ORGANIZATIONAL_ADMINISTRATION
                                    .RESOURCES.FACILITIES.READ,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/resource-management/facilities/view/${facility.id}`}
                                    >
                                      View
                                    </Link>
                                  </li>
                                )}
                                {CheckPermission([
                                  Permissions.ORGANIZATIONAL_ADMINISTRATION
                                    .RESOURCES.FACILITIES.WRITE,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/resource-management/facilities/${facility.id}`}
                                    >
                                      Edit
                                    </Link>
                                  </li>
                                )}
                                {CheckPermission([
                                  Permissions.ORGANIZATIONAL_ADMINISTRATION
                                    .RESOURCES.FACILITIES.ARCHIVE,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      onClick={() => {
                                        setFacilitityId(facility.id);
                                        setFacilitityIndex(index);
                                        setArchivePopup(true);
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
                      </Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        style={{ width: '100vw', height: '100vh' }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <Spinner
                          animation="border"
                          role="status"
                          variant="primary"
                          size="lg"
                        />
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
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
        <SuccessPopUpModal
          title="Success!"
          message="Facility is archived."
          modalPopUp={archivedStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={'/system-configuration/resource-management/facilities'}
        />
        <section
          className={`popup full-section ${archivePopup ? 'active' : ''}`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={ConfirmArchiveIcon} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Are you sure you want to archive?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setArchivePopup(false);
                  }}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleArcheive()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FacilitiesList;
