import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fliters from './Fliters';
import TableView from './TableView';
import { ListViewBreadcrumbsData, label } from '../data';
import TopBar from '../../../../../common/topbar/index';
import Pagination from '../../../../../common/pagination';
import { STAFF_SETUP } from '../../../../../../routes/path';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmModal from '../../../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewAllStaffSetup = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  /* states */
  const [isLoading, setIsLoading] = useState(false);
  const [arvhiveId, setArchiveId] = useState();
  const [createdby, setCreatedBy] = useState();
  const [searchText, setSearchText] = useState();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [staffSetupList, setStaffSetupList] = useState([]);
  const [queryParams, setQueryParams] = useState({
    status: { label: 'Active', value: 'true' },
    operationType: null,
    locationType: null,
  });
  const [sort, setSort] = useState({
    name: 'id',
    order: 'DESC',
  });
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [totalRecords, setTotalRecords] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const tableHeaders = [
    { name: 'name', label: 'Name', width: '15%', sortable: true },
    { name: 'short_name', label: 'Short Name', width: '15%', sortable: true },
    {
      name: 'opeartion_type_id',
      label: 'Operation Type',
      width: '15%',
      sortable: true,
    },
    {
      name: 'location_type_id',
      label: 'Location Type',
      width: '15%',
      sortable: true,
    },
    { name: 'beds', label: 'Beds', width: '10%', sortable: true },
    {
      name: 'concurrent_beds',
      label: 'Concurrent Beds',
      width: '15%',
      splitlabel: true,
      sortable: true,
    },
    {
      name: 'stagger_slots',
      label: 'Stagger Slots',
      width: '15%',
      splitlabel: true,
      sortable: true,
    },
    {
      name: 'procedure_type_id',
      label: 'Procedure Type',
      width: '20%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: 'auto', sortable: true },
  ];

  const searchFieldChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
    if (e.target.value?.length > 1 || e.target.value === '') {
      getStaffSetups(e.target.value);
    }
  };
  const handleSort = (item) => {
    setSort({
      name: item?.name,
      order: sort.order === 'ASC' ? 'DESC' : 'ASC',
    });
  };
  const getStaffSetups = async (search) => {
    setIsLoading(true);
    try {
      let url = `${BASE_URL}/staffing-admin/staff-setup?page=${currentPage}&limit=${limit}`;
      if (search && search !== '') {
        url = `${url}&name=${search}`;
      }
      if (queryParams?.operationType) {
        url = `${url}&operation_type=${queryParams?.operationType?.value}`;
      }
      if (queryParams?.locationType) {
        url = `${url}&location_type=${queryParams?.locationType?.value}`;
      }
      if (queryParams?.status && queryParams?.status !== 'Status') {
        url = `${url}&status=${queryParams?.status?.value ?? ''}`;
      }
      if (sort?.name && sort?.order) {
        url = `${url}&sortName=${sort.name}&sortOrder=${sort.order}`;
      }
      const result = await fetch(url, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
      });
      const data = await result.json();
      setTotalRecords(data?.total_records);
      setStaffSetupList(data?.data);
      if (data?.data?.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const archieveStaffSetup = async () => {
    setModalPopUp(false);
    try {
      const result = await fetch(
        `${BASE_URL}/staffing-admin/staff-setup/${arvhiveId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            created_by: +createdby,
          }),
        }
      );
      const data = await result.json();
      if (data?.status_code === 204) {
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      }
      if (data?.status_code === 401) {
        toast.error(`Error while archiving`);
      }
    } catch (error) {
      toast.error(`Error while archiving: ${error}`);
    } finally {
      getStaffSetups();
    }
  };

  const clearFilter = () => {
    setQueryParams({
      status: null,
      operationType: null,
      locationType: null,
    });
    setSearchText();
    setSort({
      name: null,
      order: null,
    });
  };

  useEffect(() => {
    getStaffSetups();
  }, [queryParams, currentPage, sort, currentPage, limit]);

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={ListViewBreadcrumbsData}
          BreadCrumbsTitle={label}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
        <Fliters
          setQueryParams={setQueryParams}
          queryParams={queryParams}
          clearFilter={clearFilter}
        />

        <div className="mainContentInner">
          {CheckPermission([
            Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.WRITE,
          ]) && (
            <div className="buttons">
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate(STAFF_SETUP.CREATE);
                }}
              >
                Create Staff Setup
              </button>
            </div>
          )}
          <TableView
            headers={tableHeaders}
            listData={staffSetupList}
            setModalState={setModalPopUp}
            setArchiveId={setArchiveId}
            setCreatedBy={setCreatedBy}
            handleSort={handleSort}
            isLoading={isLoading}
          />
          <Pagination
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
          />
        </div>
      </div>
      <ConfirmModal
        showConfirmation={modalPopUp}
        onCancel={() => setModalPopUp(false)}
        onConfirm={() => archieveStaffSetup()}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Staff Setup is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
      />
    </>
  );
};

export default ViewAllStaffSetup;
