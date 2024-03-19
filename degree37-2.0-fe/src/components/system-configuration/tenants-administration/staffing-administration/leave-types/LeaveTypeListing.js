import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../../../../common/pagination/index.js';
import SuccessPopUpModal from '../../../../common/successModal/index.js';
import TableList from '../../../../common/tableListing/index.js';
import TopBar from '../../../../common/topbar/index.js';
import { archiveLeaveTypeApi } from './api.js';

import { API } from '../../../../../api/api-routes.js';
import SelectDropdown from '../../../../common/selectDropdown/index.js';
import styles from './index.module.scss';
import { LeaveTypesBreadCrumbsData } from './LeaveTypesBreadCrumbsData.js';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';
const LeaveTypeListing = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(true);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [archiveID, setArchiveID] = useState();
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [active, setActive] = useState({ label: 'Active', value: 'true' });
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirmArchive = async () => {
    try {
      await archiveLeaveTypeApi({ id: archiveID });
      setArchiveID('');
      fetchAllLeaves();
      setModalPopUp(false);
      setTimeout(() => {
        setArchiveSuccess(true);
      }, 600);
    } catch (error) {
      toast.error(`Failed to archive`, { autoClose: 3000 });
    }
  };
  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    setCurrentPage(1);
    fetchAllLeaves();
  }, [searchText, selectedStatus]);
  useEffect(() => {
    fetchAllLeaves();
  }, [limit, currentPage, sortBy, sortOrder]);

  const fetchAllLeaves = async (page = currentPage) => {
    const params = new URLSearchParams();
    if (searchText && searchText.length > 1) {
      params.append('keyword', searchText);
    }
    if (selectedStatus) {
      params.append('status', selectedStatus);
    }
    if (limit) {
      params.append('limit', limit);
    }
    if (currentPage) {
      params.append('page', currentPage);
    }
    if (sortBy) {
      params.append('sortName', sortBy);
    }
    if (sortOrder) {
      params.append('sortOrder', sortOrder);
    }
    try {
      setIsLoading(true);
      const { data } =
        await API.systemConfiguration.staffAdmininstration.leaveTypes.getAll({
          params,
        });
      setRows(data.data);
      setIsLoading(false);
      setTotalRecords(data.count);
    } catch (error) {
      setIsLoading(false);
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
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

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '10%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '45%',
      sortable: true,
    },
    {
      name: 'short_description',
      label: 'Short Description',
      width: '45%',
      sortable: true,
    },
    {
      name: 'status',
      label: 'Status',
      width: '5%',
      sortable: true,
    },
  ];

  const optionsConfig = [
    CheckPermission([Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.READ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/staffing-admin/leave-types/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.WRITE]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/staffing-admin/leave-types/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.ARCHIVE]) && {
      label: 'Archive',
      action: (rowData) => {
        setModalPopUp(true);
        setArchiveID(rowData.id);
      },
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={LeaveTypesBreadCrumbsData}
        BreadCrumbsTitle={'Leave Type'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <form className="filterInner">
            <div className="d-flex gap-4">
              <div className={` ${styles.filter}`}>
                <SelectDropdown
                  placeholder={'Status'}
                  selectedValue={active}
                  onChange={(option) => {
                    if (option?.value == 'false') {
                      setSelectedStatus('false');
                    } else if (option?.value == 'true') {
                      setSelectedStatus('true');
                    } else {
                      setSelectedStatus('');
                    }
                    setActive(option);
                  }}
                  options={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                  ]}
                  removeDivider
                  showLabel={!!active}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  '/system-configuration/tenant-admin/staffing-admin/leave-types/create'
                )
              }
              style={{ width: '234px', height: '56px' }}
            >
              <div>Create Leave Type</div>
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={rows}
          hideActionTitle={true}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortBy}
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
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={handleConfirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Leave type is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};

export default LeaveTypeListing;
