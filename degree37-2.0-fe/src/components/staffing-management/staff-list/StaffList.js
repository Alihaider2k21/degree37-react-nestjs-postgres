import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../common/topbar/index';
import Pagination from '../../common/pagination/index';
import { toast } from 'react-toastify';
import TableList from './tableListingStaffList';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import ConfirmModal from '../../common/confirmModal';
import ConfirmArchiveIcon from '../../../assets/images/ConfirmArchiveIcon.png';
import SuccessPopUpModal from '../../common/successModal';
import CheckPermission from '../../../helpers/CheckPermissions';
import { StaffListBreadCrumbsData } from './StaffListBreadCrumbsData';
import StaffingPermissions from '../../../enums/StaffingPermissionsEnum';
import StaffListFilters from './staffListFilters/staffListFilter';

let inputTimer = null;

function StaffList() {
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('staff_id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState();
  const [filtersApplied, setFiltersApplied] = useState({});
  const [tableHeaders] = useState([
    {
      name: 'name',
      label: 'Name',
      minWidth: '12rem',
      width: '12rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'primary_roles',
      label: 'Primary Role',
      minWidth: '12rem',
      width: '12rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'other_roles',
      label: 'Other Roles',
      minWidth: '12rem',
      width: '12rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'teams',
      label: 'Team',
      width: '120px',
      sortable: true,
      checked: true,
    },
    {
      name: 'collection_operation_name',
      label: 'Collection Op',
      width: '12rem',
      sortable: true,
      checked: true,
      splitlabel: true,
    },
    {
      name: 'classification_name',
      label: 'Classification',
      width: '120px',
      sortable: true,
      checked: true,
    },
    {
      name: 'status',
      label: 'Status',
      width: '120px',
      sortable: true,
      checked: true,
    },
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setIsLoading(true);
      fetchAllData(filtersApplied);
    }, 500);
  }, [searchText, limit, currentPage, sortBy, sortOrder, refresh]);

  const fetchAllData = async (filters) => {
    try {
      setFiltersApplied(filters);
      const getStatusValue = (status) => {
        if (typeof status === 'string') {
          return status === 'active'
            ? true
            : status === 'inactive'
            ? false
            : '';
        } else if (typeof status === 'object' && 'value' in status) {
          return status.value === 'active'
            ? true
            : status.value === 'inactive'
            ? false
            : '';
        } else {
          return '';
        }
      };
      const getFilterValue = (filter, propertyName) => {
        if (typeof filter === 'object' && 'value' in filter) {
          return propertyName + '=' + filter.value;
        } else if (Array.isArray(filter)) {
          if (typeof filter[0] === 'object' && 'id' in filter[0]) {
            return filter.map((e) => propertyName + '=' + e.id).join('&');
          } else {
            return filter.map((id) => propertyName + '=' + id).join('&');
          }
        } else {
          return propertyName + '=' + (filter ?? '');
        }
      };
      const filterProperties = [
        'collection_operation_ids',
        'city',
        'state',
        'role_ids',
        'team_ids',
        'certification_ids',
        'donor_center_ids',
        'classification_ids',
      ];
      const queryParams = filterProperties
        .map((property) => {
          const filterValue = getFilterValue(filters[property], property);
          return filterValue ? filterValue : '';
        })
        .filter((param) => param !== '')
        .join('&');

      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contact-staff/filtered?sortOrder=${sortOrder}&sortBy=${sortBy}&page=${currentPage}&limit=${limit}${
          searchText && searchText.length ? '&name=' + searchText : ''
        }&status=${getStatusValue(filters?.status)}&${queryParams}`
      );
      const data = await response.json();
      setRows(data.data);
      setTotalRecords(data?.count);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setIsLoading(false);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else if (sortOrder === 'DESC') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  const optionsConfig = [
    CheckPermission([
      StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.WRITE,
      StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.READ,
    ])
      ? {
          label: 'View',
          path: (rowData) => `/crm/contacts/staff/${rowData.staff_id}/view`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.WRITE])
      ? {
          label: 'Edit',
          path: (rowData) => `/crm/contacts/staff/${rowData.staff_id}/edit`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([
      StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.CURRENT_SCHEDULE,
    ])
      ? {
          label: 'Current Schedule',
          path: (rowData) => `#`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([
      StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.COMMUNICATE,
    ])
      ? {
          label: 'Communicate',
          path: (rowData) => `#`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([
      StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.ARCHIVE,
    ])
      ? {
          label: 'Archive',
          action: (rowData) => {
            handleArchive(rowData);
          },
        }
      : null,
  ];

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setItemToArchive(rowData);
    setRefresh(false);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const staffId = itemToArchive.staff_id;
        const response = await makeAuthorizedApiRequest(
          'PATCH',
          `${BASE_URL}/contact-staff/${staffId}`
        );
        const { status } = await response.json();

        if (status === 204) {
          setArchiveModalPopUp(true);
          setRefresh(true);
        } else {
          toast.error('Error Archiving Staff', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error archiving data:', error);
      }

      setShowConfirmation(false);
      setItemToArchive(null);
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={StaffListBreadCrumbsData}
        BreadCrumbsTitle={'Staff List'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="mainContentInner">
        <StaffListFilters
          fetchAllFilters={fetchAllData}
          setIsLoading={setIsLoading}
          setSelectedOptions={setSelectedOptions}
          selectedOptions={selectedOptions}
        />
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
          title={'Success!'}
          message={'Staff is archived.'}
          modalPopUp={archiveModalPopUp}
          setModalPopUp={setArchiveModalPopUp}
          onConfirm={() => {
            setArchiveModalPopUp(false);
          }}
          showActionBtns={true}
        />
        <ConfirmModal
          showConfirmation={showConfirmation}
          onCancel={cancelArchive}
          onConfirm={confirmArchive}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to archive?'}
        />
      </div>
    </div>
  );
}

export default StaffList;
