import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavTabs from '../../../../../common/navTabs/index.js';
import Pagination from '../../../../../common/pagination';
import SuccessPopUpModal from '../../../../../common/successModal';
import TableList from '../../../../../common/tableListing/index.js';
import TopBar from '../../../../../common/topbar/index';
import { accountTabs } from '../tabs.js';
import { archiveStageApi, getStagesApi } from './api.js';
import SelectDropdown from '../../../../../common/selectDropdown/index.js';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData.js';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
let inputTimer = null;

const StageListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({
    label: 'Active',
    value: 'true',
  });
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveID, setArchiveID] = useState();
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'Stages',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/stages',
    },
  ];

  const handleConfirmArchive = async () => {
    try {
      setArchiveLoading(true);
      const { data } = await archiveStageApi({ id: archiveID });
      if (data.status === 204) {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
        fetchAllStages();
      } else {
        toast.error(`${data?.message || 'Failed to archive'}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.data?.resopnse || 'Failed to archive'}`, {
        autoClose: 3000,
      });
    }
    setArchiveLoading(false);
    setModalPopUp(false);
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    // Adding debouncer just so we won't call api on every search click
    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setIsLoading(true);
      fetchAllStages();
    }, 500);
  }, [searchText, selectedStatus, limit, currentPage, sortBy, sortOrder]);

  const fetchAllStages = async () => {
    const params = new URLSearchParams();

    if (searchText) {
      params.append('keyword', searchText);
    }
    if (selectedStatus) {
      params.append('is_active', selectedStatus?.value);
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
      const { data } = await getStagesApi({ params });
      setRows(data.data);
      setTotalRecords(data?.count);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
    setIsLoading(false);
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
    { name: 'name', label: 'Name', width: '25%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '45%',
      sortable: true,
    },
    {
      name: 'is_active',
      label: 'Status',
      width: '25%',
      sortable: true,
    },
  ];

  const optionsConfig = [
    CheckPermission([Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.READ]) && {
      label: 'View',
      path: (rowData) => `${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.WRITE]) && {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.ARCHIVE,
    ]) && {
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
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Stages'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs tabs={accountTabs} currentLocation={location.pathname} />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex">
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={selectedStatus}
                selectedValue={selectedStatus}
                removeDivider
                showLabel
                onChange={setSelectedStatus}
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
          Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate('create')}
            >
              <div>Create Stage</div>
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
          loading={archiveLoading}
          isArchived={true}
          archived={handleConfirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Stage is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};

export default StageListing;
