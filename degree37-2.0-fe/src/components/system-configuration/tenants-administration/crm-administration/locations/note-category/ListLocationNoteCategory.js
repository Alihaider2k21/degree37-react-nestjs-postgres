import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../../common/pagination/index';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import TableList from '../../../../../common/tableListing';
import { LocationsTabs } from '../tabs';
import NavTabs from '../../../../../common/navTabs';
import { fetchData } from '../../../../../../helpers/Api';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { LocationBreadCrumbsData } from '../LocationBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ListLocationNoteCategories = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [refresh, setRefresh] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [isArchived, setIsArchived] = React.useState(false);
  const BreadcrumbsData = [
    ...LocationBreadCrumbsData,
    {
      label: 'Note Categories',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/crm-admin/locations/note-categories',
    },
  ];

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setItemToArchive(rowData);
  };

  const confirmArchive = async () => {
    console.log('confirmArchive');
    if (itemToArchive) {
      setIsArchived(true);

      try {
        const noteCategoryId = itemToArchive.id;
        const result = await fetchData(
          `/locations/note-category/${noteCategoryId}`,
          'PATCH'
        );
        const { status_code, status, response } = result;

        if (status_code === 204 && status === 'success') {
          setShowConfirmation(false);
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          setRefresh(true);
        } else {
          toast.error(response, { autoClose: 3000 });
        }
      } catch (error) {
        toast.error(error?.response, { autoClose: 3000 });
      }

      setShowConfirmation(false);
      setItemToArchive(null);
      setTimeout(() => {
        setIsArchived(false);
      }, 3000);
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        var url = `/locations/note-category?limit=${limit}&page=${currentPage}&name=${searchText}&is_active=${
          isActive?.value ?? ''
        }`;
        if (sortOrder.length > 0) {
          url += `&sortOrder=${sortOrder}`;
        }

        if (sortName.length > 0) {
          url += `&sortName=${sortName}`;
        }
        const result = await fetchData(url, 'GET');

        let { data } = result;

        setCategories(data?.data);
        setTotalRecords(data?.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSearchChange = async (e) => {
      setIsLoading(true);
      try {
        var url = `/locations/note-category?limit=${limit}&page=${currentPage}&name=${searchText}&is_active=${
          isActive?.value ?? ''
        }`;
        if (sortOrder.length > 0) {
          url += `&sortOrder=${sortOrder}`;
        }

        if (sortName.length > 0) {
          url += `&sortName=${sortName}`;
        }

        const result = await fetchData(url, 'GET');

        let { data } = result;

        setCategories(data?.data);
        setTotalRecords(data?.count);
      } catch (error) {
        console.error('Error searching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText) {
      getData();
    } else if (searchText?.length > 1) {
      handleSearchChange(searchText);
    }

    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    isActive,
    refresh,
    sortOrder,
    sortName,
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/crm-admin/locations/note-categories/create'
    );
  };

  const handleSort = (columnName) => {
    setSortName(columnName);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'ASC' ? 'DESC' : 'ASC'));
  };

  const handleIsActive = (value) => {
    setIsActive(value);
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '30%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '30%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '10%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/crm-admin/locations/note-categories/view/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/crm-admin/locations/note-categories/edit/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Note Categories'}
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
          Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Note Category
            </button>
          </div>
        )}

        <TableList
          isLoading={isLoading}
          data={categories}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortName}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Note Category is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/crm-admin/locations/note-categories'
          }
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
  );
};

export default ListLocationNoteCategories;
