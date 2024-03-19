import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import Pagination from '../../../../../common/pagination';
import TableListing from './components/TableListing';
import { BreadcrumbsData } from './components/data';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { LocationsTabs } from '../tabs';
import NavTabs from '../../../../../common/navTabs';
import ConfirmModal from '../../../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ListAllRoomSizes = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const bearerToken = localStorage.getItem('token');
  /* states */
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(null);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [createdBy, setCreatedBy] = useState();
  const [sort, setSort] = useState({
    name: 'id',
    order: 'DESC',
  });
  const [status, setStatus] = useState({ label: 'Active', value: 'true' });
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 5);
  const [totalRecords, setTotalRecords] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState([]);
  const [arvhiveId, setArchiveId] = useState();
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchFieldChange = (e) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };

  const handleSort = (item) => {
    setSort({
      name: item?.name,
      order: sort.order === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '20%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '35%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '20%', sortable: true },
  ];

  const getData = async () => {
    try {
      setIsLoading(true);
      let url = `${BASE_URL}/room-size?page=${currentPage}&limit=${limit}`;
      if (searchText) {
        url = `${url}&search=${searchText}`;
      }
      if (status?.value !== undefined && status?.value !== null) {
        url = `${url}&status=${status?.value ?? ''}`;
      }
      if (sort?.name && sort?.order) {
        url = `${url}&sortName=${sort.name}&sortOrder=${sort.order}`;
      }
      const result = await fetch(url, {
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
      });
      const data = await result.json();
      setTotalRecords(data?.total_records);
      setListData(data?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data:', error);
      toast.error(`Error fetching data: ${error}`);
    }
  };
  const archiveRoom = async () => {
    try {
      const result = await fetch(`${BASE_URL}/room-size/archive/${arvhiveId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ created_by: +createdBy }),
      });
      const data = await result.json();
      if (data?.status_code === 204) {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      } else {
        toast.error(`Error while archiving`, data?.message);
      }
    } catch (error) {
      toast.error(`Error while archiving: ${error}`);
    } finally {
      setModalPopUp(false);
      getData();
    }
  };
  useEffect(() => {
    getData();
  }, [currentPage, status, sort, limit]);

  useEffect(() => {
    if (searchText?.length !== 1) getData();
  }, [searchText]);

  const handleIsActive = (value) => {
    setStatus(value);
  };

  return (
    <>
      {' '}
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Room Sizes'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
        {/* filter bar */}
        <div className="filterBar">
          <NavTabs tabs={LocationsTabs} currentLocation={currentLocation} />
          <div className="filterInner">
            <h2>Filters</h2>
            <div className="filter">
              <form className="d-flex">
                <SelectDropdown
                  placeholder={'Status'}
                  defaultValue={status}
                  selectedValue={status}
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
        {/* create button */}
        <div className="mainContentInner">
          {CheckPermission([
            Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES.WRITE,
          ]) && (
            <div className="buttons">
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate(
                    '/system-configuration/tenant-admin/crm-admin/locations/room-size/create'
                  );
                }}
              >
                Create Room Size
              </button>
            </div>
          )}
          {/*  {isLoading ? (
            <Loader />
          ) : ( */}
          <>
            <TableListing
              isLoading={isLoading}
              headers={tableHeaders}
              listData={listData}
              setModalState={setModalPopUp}
              setArchiveId={setArchiveId}
              handleSort={handleSort}
              setCreatedBy={setCreatedBy}
            />
            <Pagination
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalRecords={totalRecords}
            />
          </>
          {/*  )} */}
        </div>

        <ConfirmModal
          showConfirmation={modalPopUp}
          onCancel={() => setModalPopUp(false)}
          onConfirm={() => archiveRoom()}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to archive?'}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Room Size is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/crm-admin/locations/room-size'
          }
        />
      </div>
    </>
  );
};

export default ListAllRoomSizes;
