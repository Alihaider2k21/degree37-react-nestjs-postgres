import React from 'react';
import TopBar from '../../../../../common/topbar/index';
import TableList from '../../../../../common/tableListing';
import Pagination from '../../../../../common/pagination/index';
import ConfirmModal from '../../../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import { fetchData } from '../../../../../../helpers/Api';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import NavTabs from '../../../../../common/navTabs';
import { LocationsTabs } from '../tabs';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { LocationBreadCrumbsData } from '../LocationBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const initialSearchParams = {
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'created_at',
};

const LocationsAttachmentCategoryList = () => {
  const location = useLocation();
  const currentLocation = location.pathname;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [categories, setCategories] = React.useState([]);
  const [totalCategories, setTotalCategories] = React.useState(-1);
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [isActive, setIsActive] = React.useState({
    label: 'Active',
    value: 'true',
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isArchived, setIsArchived] = React.useState(false);
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [showConfirmation, setConfirmation] = React.useState(null);
  const [archiveSuccess, setArchiveSuccess] = React.useState(false);

  const BreadcrumbsData = [
    ...LocationBreadCrumbsData,
    {
      label: 'Attachment Categories',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-categories',
    },
  ];

  const TableHeaders = [
    { name: 'name', label: 'Name', width: '25%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '35%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '25%', sortable: true },
  ];

  const OptionsConfig = [
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.READ,
    ]) && {
      label: 'View',
      path: (rowData) => location.pathname + `/${rowData.id}/view`,
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => location.pathname + `/${rowData.id}/edit`,
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => setConfirmation(rowData.id),
    },
  ].filter(Boolean);

  React.useEffect(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      sortName,
      sortOrder,
      page,
      limit,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortName, sortOrder, page, limit]);

  React.useEffect(() => {
    fetchAttachmentCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  React.useEffect(() => {
    const searchText = Object.fromEntries(searchParams);
    if (searchText?.name?.length !== 1) fetchAttachmentCategories();
  }, [searchParams]);

  const fetchAttachmentCategories = () => {
    setIsLoading(true);
    fetchData(`/locations/attachment-category`, 'GET', {
      ...Object.fromEntries(searchParams),
      is_active: isActive?.value ?? '',
    })
      .then((res) => {
        setTimeout(() => {
          setCategories(res?.data?.data || []);
          setTotalCategories(res?.data?.count);
          setIsLoading(false);
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchParams({
      ...Object.fromEntries(searchParams),
      name: value,
    });
  };

  const handleIsActive = (value) => {
    setIsActive(value);
  };

  const handleSort = (columnName) => {
    setTimeout(() => {
      setSortName(columnName);
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    navigate(location.pathname + '/create');
  };

  const handleArchive = (attachmentId) => {
    setIsArchived(true);
    fetchData(`/locations/attachment-category/${attachmentId}`, 'PATCH')
      .then((res) => {
        if (res?.status_code === 204) {
          fetchAttachmentCategories();
          setConfirmation(null);
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
        } else {
          setConfirmation(null);
          toast.error(res?.response, { autoClose: 3000 });
        }
      })
      .catch((err) => {
        console.error(err);
        setConfirmation(null);
      });
    setTimeout(() => {
      setIsArchived(false);
    }, 3000);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachment Categories'}
        SearchPlaceholder={'Search'}
        SearchValue={searchParams.name}
        SearchOnChange={handleSearch}
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
          Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Attachment Category
            </button>
          </div>
        )}

        <TableList
          isLoading={isLoading}
          data={categories}
          headers={TableHeaders}
          handleSort={handleSort}
          optionsConfig={OptionsConfig}
        />

        <Pagination
          limit={limit}
          setLimit={(value) => setLimit(value)}
          currentPage={page}
          setCurrentPage={(value) => setPage(value)}
          totalRecords={totalCategories}
        />
      </div>

      <ConfirmModal
        showConfirmation={showConfirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => handleArchive(showConfirmation)}
        disabled={isArchived}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Attachment Category is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
      />
    </div>
  );
};

export default LocationsAttachmentCategoryList;
