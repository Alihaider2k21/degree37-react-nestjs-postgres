import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../../../components/common/pagination/index';
import TopBar from '../../../../../../components/common/topbar/index';
import SuccessPopUpModal from '../../../../../../components/common/successModal';
import { toast } from 'react-toastify';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import TableList from '../../../../../../components/common/tableListing';
import { fetchData } from '../../../../../../helpers/Api';
import { LocationsTabs } from '../tabs';
import NavTabs from '../../../../../../components/common/navTabs';
import SelectDropdown from '../../../../../common/selectDropdown';
import { LocationBreadCrumbsData } from '../LocationBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const BreadcrumbsData = [
  ...LocationBreadCrumbsData,
  {
    label: 'Attachment Subcategories',
    class: 'active-label',
    link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories',
  },
];

const LocationsAttachmentSubCategoryList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [attachmentSubCategory, setAttachmentSubCategory] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const navigate = useNavigate();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isActive, setIsActive] = React.useState({
    label: 'Active',
    value: 'true',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isArchived, setIsArchived] = React.useState(false);

  const confirmArchive = async () => {
    if (itemToArchive) {
      setIsArchived(true);
      const result = await fetchData(
        `/locations/attachment-subcategory/${itemToArchive}`,
        'PATCH'
      );
      const { status } = result;
      if (status === 'success') {
        setModalPopUp(false);
        setShowSuccessMessage(true);
        getData();
        return;
      } else toast.error('Something went wrong.');
      setTimeout(() => {
        setIsArchived(false);
      }, 3000);
    }
    setModalPopUp(false);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/create'
    );
  };
  const getData = async () => {
    setIsLoading(true);
    const result = await fetchData(
      `/locations/attachment-subcategory?limit=${limit}&page=${currentPage}&is_active=${
        isActive?.value ?? ''
      }&sortName=${sortBy}&sortOrder=${sortOrder}`
    );
    const { data, status_code } = result;
    if (status_code === 200) {
      setAttachmentSubCategory(data.data);
      setTotalRecords(data.count);
      setIsLoading(false);
    } else {
      toast.error('Error Attachment Subcategory ', { autoClose: 3000 });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handleSearchChange = async (e) => {
      try {
        setIsLoading(true);
        const result = await fetchData(
          `/locations/attachment-subcategory?is_active=${
            isActive?.value ?? ''
          }&name=${e}`
        );
        const { data, status_code } = result;
        if (status_code === 200) {
          setAttachmentSubCategory(data?.data);
          setTotalRecords(data?.count);
          setIsLoading(false);
        } else {
          toast.error('Error Attachment Subcategory ', { autoClose: 3000 });
          setIsLoading(false);
        }
      } catch (error) {
        toast.error('Error searching data', { autoClose: 3000 });
        setIsLoading(false);
      }
    };
    if (!searchText) {
      getData(limit, currentPage);
    }
    if (searchText?.length > 1) {
      handleSearchChange(searchText);
    }
  }, [currentPage, limit, searchText, BASE_URL, sortBy, sortOrder, isActive]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSort = (column) => {
    setTimeout(() => {
      setSortBy(column);
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    });
  };

  const handleOpenConfirmation = (data) => {
    setItemToArchive(data.id);
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
      label: 'Attachment Category',
      width: '20%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleOpenConfirmation(rowData),
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Attachment Subcategories'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
        <div className="filterBar">
          <NavTabs tabs={LocationsTabs} currentLocation={currentLocation} />
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
            Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY
              .WRITE,
          ]) && (
            <div className="buttons">
              <button className="btn btn-primary" onClick={handleAddClick}>
                Create Attachment Subcategory
              </button>
            </div>
          )}
          <TableList
            isLoading={isLoading}
            data={attachmentSubCategory}
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
            disabled={isArchived}
            archived={confirmArchive}
          />
          <SuccessPopUpModal
            title="Success"
            message={'Attachment Subcategories is archived.'}
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
                    disabled={isArchived}
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
    </div>
  );
};
export default LocationsAttachmentSubCategoryList;
