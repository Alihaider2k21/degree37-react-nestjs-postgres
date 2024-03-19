import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavTabs from '../../../../../common/navTabs/index.js';
import Pagination from '../../../../../common/pagination/index.js';
import SuccessPopUpModal from '../../../../../common/successModal/index.js';
import TableList from '../../../../../common/tableListing/index.js';
import TopBar from '../../../../../common/topbar/index';
import { NotesAttachmentsTabs } from '../tabs.js';
import {
  archiveAttachmentSubcategoryApi,
  getAttachmentSubcategoriesApi,
} from './api.js';
import SelectDropdown from '../../../../../common/selectDropdown/index.js';
import { NotesAttachmentBreadCrumbsData } from '../NotesAttachmentBreadCrumbsData.js';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
let inputTimer = null;

const AttachmentSubCategoriesListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({
    label: 'Active',
    value: 'true',
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveID, setArchiveID] = useState();
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [isLoading, setIsLoading] = useState(true);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveStatus, setArchivedStatus] = useState(false);

  const BreadcrumbsData = [
    ...NotesAttachmentBreadCrumbsData,
    {
      label: 'Attachments Subcategories',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories',
    },
  ];

  const handleConfirmArchive = async () => {
    try {
      setArchiveLoading(true);
      const result = await archiveAttachmentSubcategoryApi({ id: archiveID });
      const { status, status_code, response } = result.data;
      if (status === 'success' || status_code === 204) {
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        });
        fetchAllAttachmentCategoryApi();
      } else {
        toast.error(response, { autoClose: 3000 });
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
    setIsLoading(true);
    fetchAllAttachmentCategoryApi();
  }, [currentPage, sortBy, sortOrder]);

  useEffect(() => {
    // Adding debouncer just so we won't call api on every search click
    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setCurrentPage(1);
      fetchAllAttachmentCategoryApi(1);
    }, 500);
  }, [searchText, selectedStatus, limit]);
  const fetchAllAttachmentCategoryApi = async (myPage) => {
    const params = new URLSearchParams();

    if (searchText) {
      if (searchText.length > 1) {
        params.append('name', searchText);
      } else {
        return;
      }
    }
    if (selectedStatus) {
      params.append('is_active', selectedStatus?.value ?? '');
    }

    if (limit) {
      params.append('limit', limit);
    }
    if (currentPage) {
      params.append('page', myPage || currentPage);
    }

    if (sortBy) {
      params.append('sortName', sortBy);
    }
    if (sortOrder) {
      params.append('sortOrder', sortOrder);
    }
    try {
      setIsLoading(true);
      const { data } = await getAttachmentSubcategoriesApi({ params });
      setRows(data.data?.data || []);
      setTotalRecords(data?.data?.count);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
    setIsLoading(false);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '25%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '25%',
      sortable: true,
    },
    {
      name: 'parent_id',
      label: 'Attachment Category',
      width: '20%',
      sortable: true,
    },
    {
      name: 'is_active',
      label: 'Status',
      width: '15%',
      sortable: true,
    },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
        .ATTACHMENTS_SUBCATEGORY.READ,
    ]) && {
      label: 'View',
      path: (rowData) => `${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
        .ATTACHMENTS_SUBCATEGORY.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
        .ATTACHMENTS_SUBCATEGORY.ARCHIVE,
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
        BreadCrumbsTitle={'Attachments Subcategories'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs
          tabs={NotesAttachmentsTabs}
          currentLocation={location.pathname}
        />
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
                onChange={(value) => {
                  setSelectedStatus(value);
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
          Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
            .ATTACHMENTS_SUBCATEGORY.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate('create')}
            >
              <div>Create Attachment Subcategory</div>
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
          message={`Attachment Subcategory is archived.`}
          modalPopUp={archiveStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories'
          }
        />
      </div>
    </div>
  );
};

export default AttachmentSubCategoriesListing;
