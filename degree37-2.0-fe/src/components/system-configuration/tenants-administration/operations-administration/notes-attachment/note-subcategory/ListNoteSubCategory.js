import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../../common/pagination/index';
import TopBar from '../../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../../common/successModal';
import { toast } from 'react-toastify';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import TableList from '../../../../../common/tableListing';
import { fetchData } from '../../../../../../helpers/Api';
import { NotesAttachmentsTabs } from '../tabs';
import NavTabs from '../../../../../common/navTabs';
import SelectDropdown from '../../../../../common/selectDropdown';
import { NotesAttachmentBreadCrumbsData } from '../NotesAttachmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const BreadcrumbsData = [
  ...NotesAttachmentBreadCrumbsData,
  {
    label: 'Note Subcategories',
    class: 'active-label',
    link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/list',
  },
];

const ListNoteSubCategory = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [noteSubCategory, setNoteSubCategory] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const result = await fetchData(
          `/note-attachment/note-subcategory/${itemToArchive}`,
          'PATCH'
        );
        const { status_code, reponse } = result;
        if (status_code === 204) {
          setModalPopUp(false);
          setShowSuccessMessage(true);
          getData(limit, currentPage);
          return;
        } else toast.error(reponse, { autoClose: 3000 });
      } catch (error) {
        toast.error(error?.reponse, { autoClose: 3000 });
      }
    }
    setModalPopUp(false);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/create'
    );
  };
  const getData = async () => {
    setIsLoading(true);
    const result = await fetchData(
      `/note-attachment/note-subcategory?limit=${limit}&page=${currentPage}&is_active=${
        isActive?.value ?? ''
      }&sortName=${sortBy}&sortOrder=${sortOrder}`
    );
    const { data, status_code } = result;
    if (status_code === 200) {
      setNoteSubCategory(data.data);
      setTotalRecords(data.count);
      setIsLoading(false);
    } else {
      toast.error('Error Note Category ', { autoClose: 3000 });
    }
  };
  useEffect(() => {
    const handleSearchChange = async (e) => {
      try {
        setIsLoading(true);
        const result = await fetchData(
          `/note-attachment/note-subcategory?is_active=${
            isActive?.value ?? ''
          }&name=${e}`
        );

        const { data, status_code } = result;
        if (status_code === 200) {
          setNoteSubCategory(data?.data);
          setCurrentPage(1);
          setTotalRecords(data?.count);
          setIsLoading(false);
        } else {
          toast.error('Error Note Category ', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error searching data:', error);
      }
    };

    if (!searchText) {
      getData(limit, currentPage);
    }
    if (searchText?.length > 1) {
      handleSearchChange(searchText);
    }
  }, [currentPage, limit, searchText, BASE_URL, sortBy, sortOrder]);

  useEffect(() => {
    const getWithStatus = async () => {
      setIsLoading(true);
      const result = await fetchData(
        `/note-attachment/note-subcategory?limit=${limit}&page=${1}&is_active=${
          isActive?.value ?? ''
        }&name=${searchText}`
      );
      const { data, status_code } = result;
      if (status_code === 200) {
        setNoteSubCategory(data?.data);
        setCurrentPage(1);
        setTotalRecords(data?.count);
        setIsLoading(false);
      } else {
        toast.error('Error Note SubCategory ', { autoClose: 3000 });
      }
    };
    getWithStatus();
  }, [isActive]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
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

  const handleOpenConfirmation = (data) => {
    setItemToArchive(data?.id);
    setModalPopUp(true);
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  const handleIsActive = (value) => {
    setIsActive(value);
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
      label: 'Note Category',
      width: '20%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];
  const optionsConfig = [
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
        .NOTES_SUBCATEGORY.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
        .NOTES_SUBCATEGORY.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
        .NOTES_SUBCATEGORY.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleOpenConfirmation(rowData),
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Note Subcategories'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs
          tabs={NotesAttachmentsTabs}
          currentLocation={currentLocation}
        />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex">
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
          Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
            .NOTES_SUBCATEGORY.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Note Subcategory
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={noteSubCategory}
          headers={tableHeaders}
          handleSort={handleSort}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={confirmArchive}
        />

        <SuccessPopUpModal
          title="Success"
          message={'Note SubCategory archived.'}
          modalPopUp={showSuccessMessage}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />

        {/* Confirmation Dialog */}
        <section
          className={`popup full-section ${showConfirmation ? 'active' : ''}`}
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
                  onClick={() => cancelArchive()}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => confirmArchive()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
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

export default ListNoteSubCategory;
