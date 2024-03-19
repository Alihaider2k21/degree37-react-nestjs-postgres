import React, { useState, useEffect } from 'react';
import TopBar from '../../common/topbar/index';
import SelectDropdown from '../../common/selectDropdown';
import { useNavigate } from 'react-router-dom';
import TableList from '../../common/tableListing';
import Pagination from '../../common/pagination';
import { fetchData } from '../../../helpers/Api';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../common/successModal';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
} from '../../../routes/path';
import OcPermissions from '../../../enums/OcPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';

const FavoriteList = () => {
  const [searchText, setSearchText] = useState('');
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [favoritesData, setFavoritesData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showModalText, setShowModalText] = useState(null);
  const [modalPopUpType, setModalPopUpType] = useState(null);
  const [actionId, setActionID] = useState(null);

  const handleArchive = async () => {
    if (actionId) {
      setIsActionLoading(true);
      try {
        const result = await fetchData(
          `/operations-center/manage-favorites/archive/${actionId}`,
          'PUT'
        );
        const { status, response } = result;
        if (status === 'success') {
          setModalPopUp(false);
          setShowModalText('Favorite is archived.');
          setShowSuccessMessage(true);
          setIsActionLoading(false);
          getWithStatus();
          return;
        } else {
          toast.error(response, { autoClose: 3000 });
          setIsActionLoading(false);
        }
      } catch (error) {
        setIsActionLoading(false);
        console.log(error);
        toast.error('Error archiving favorite.');
      }
    }
  };

  const handleMakeDefault = async () => {
    if (actionId) {
      setIsActionLoading(true);
      try {
        const result = await fetchData(
          `/operations-center/manage-favorites/set-default/${actionId}`,
          'PATCH',
          { id: Number(actionId), is_default: true }
        );
        const { status, response } = result;
        if (status === 'success') {
          setModalPopUp(false);
          setShowModalText(
            'The favorite has been successfully set as the default.'
          );
          setShowSuccessMessage(true);
          getWithStatus();
          setIsActionLoading(false);

          return;
        } else {
          toast.error(response, { autoClose: 3000 });
          setIsActionLoading(false);
        }
      } catch (error) {
        setIsActionLoading(false);
        console.log(error);
        toast.error('Error making favorite default.', { autoClose: 3000 });
      }
    }
    setModalPopUp(false);
  };
  const getWithStatus = async () => {
    setIsLoading(true);
    let search = searchText?.length > 1 ? searchText : '';
    const result = await fetchData(
      `/operations-center/manage-favorites?limit=${limit}&page=${currentPage}&status=${
        isActive?.value ?? ''
      }&sortName=${sortBy}&sortOrder=${sortOrder}&name=${search}`
    );
    const { data, status, count } = result;
    if (status === 200) {
      setFavoritesData(data);
      setTotalRecords(count);
      if (!(data?.length > 0) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setIsLoading(false);
    } else {
      toast.error('Error Manage Favorite ', { autoClose: 3000 });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getWithStatus();
  }, [isActive, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Manage Favorites',
      class: 'disable-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
    },
  ];
  const tableHeaders = [
    {
      name: 'name',
      label: 'Favorite Name',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
    },
    { name: 'alternate_name', label: 'Alternate Name', sortable: true },
    {
      name: 'organization_level_id',
      label: 'Organization Level',
      sortable: true,
    },
    { name: 'operation_type', label: 'Operation Type', sortable: true },
    { name: 'location_type', label: 'Location Type', sortable: true },
    { name: 'procedure_id', label: 'Procedures', sortable: true },
    { name: 'product_id', label: 'Products', sortable: true },
    { name: 'operations_status_id', label: 'Operation Status', sortable: true },
    { name: 'preview_in_calendar', label: 'Calendar View', sortable: true },
    { name: 'status', label: 'Status', width: '25%', sortable: true },
  ];
  const optionsConfig = [
    CheckPermission([OcPermissions.OPERATIONS_CENTER.MANAGE_FAVORITE.READ]) && {
      label: 'View',
      path: (rowData) =>
        OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.VIEW.replace(':id', rowData.id),
      openNewTab: (rowData) => rowData?.is_open_in_new_tab,
    },
    CheckPermission([
      OcPermissions.OPERATIONS_CENTER.MANAGE_FAVORITE.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.EDIT.replace(':id', rowData.id),
      action: (rowData) => {},
    },
    CheckPermission([
      OcPermissions.OPERATIONS_CENTER.MANAGE_FAVORITE.DUPLICATE,
    ]) && {
      label: 'Duplicate',
      path: (rowData) =>
        OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.DUPLICATE.replace(
          ':id',
          rowData.id
        ),
      action: (rowData) => {},
    },
    CheckPermission([
      OcPermissions.OPERATIONS_CENTER.MANAGE_FAVORITE.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => {
        setActionID(rowData?.id);
        setModalPopUpType('archive');
        setShowModalText('Are you sure you want to archive?');
        setModalPopUp(true);
      },
    },
    CheckPermission([
      OcPermissions.OPERATIONS_CENTER.MANAGE_FAVORITE.SET_AS_DEFAULT,
    ]) && {
      label: 'Set as Default Favorite',
      action: (rowData) => {
        setActionID(rowData?.id);
        setModalPopUpType('default');
        setShowModalText(
          'Are you sure you want to make this the default favorite?'
        );
        setModalPopUp(true);
      },
    },
  ].filter(Boolean);
  useEffect(() => {
    if (searchText?.length > 1) {
      setSearched(true);
      setCurrentPage(1);
      getWithStatus();
    }
    if (searchText?.length === 1 && searched) {
      setCurrentPage(1);
      getWithStatus();
      setSearched(false);
    }
  }, [searchText]);

  const handleAddClick = () => {
    navigate(OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.CREATE);
  };
  const handleIsActive = (value) => {
    setIsActive(value);
  };
  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
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

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Manage Favorites'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
        <div className="filterBar">
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
            OcPermissions.OPERATIONS_CENTER.MANAGE_FAVORITE.WRITE,
          ]) && (
            <div className="buttons">
              <button className="btn btn-primary" onClick={handleAddClick}>
                Create Favorite
              </button>
            </div>
          )}
          <TableList
            isLoading={isLoading}
            data={favoritesData}
            headers={tableHeaders}
            handleSort={handleSort}
            sortOrder={sortOrder}
            favorite
            optionsConfig={optionsConfig}
            showVerticalLabel={true}
          />

          <SuccessPopUpModal
            title="Confirmation"
            message={showModalText}
            modalPopUp={modalPopUp}
            setModalPopUp={setModalPopUp}
            showActionBtns={false}
            loading={isActionLoading}
            isArchived={true}
            archived={() =>
              modalPopUpType === 'archive'
                ? handleArchive()
                : handleMakeDefault()
            }
            customSVGIcon={
              modalPopUpType !== 'archive' && (
                <svg
                  width="91"
                  height="91"
                  viewBox="0 0 91 91"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="46" cy="45" r="44" fill="#387DE5" />
                  <g clipPath="url(#clip0_14481_83571)">
                    <path
                      d="M46 22C33.2879 22 23 32.2867 23 45C23 57.7119 33.2867 68 46 68C58.7121 68 69 57.7132 69 45C69 32.2881 58.7132 22 46 22ZM48.3619 54.13C48.3619 54.8567 47.3023 55.5831 46.0005 55.5831C44.6381 55.5831 43.6694 54.8567 43.6694 54.13V42.5952C43.6694 41.7476 44.6381 41.1722 46.0005 41.1722C47.3023 41.1722 48.3619 41.7476 48.3619 42.5952V54.13ZM46.0005 38.3871C44.6079 38.3871 43.5181 37.3578 43.5181 36.2073C43.5181 35.0568 44.608 34.0577 46.0005 34.0577C47.3629 34.0577 48.4529 35.0568 48.4529 36.2073C48.4529 37.3578 47.3628 38.3871 46.0005 38.3871Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_14481_83571">
                      <rect
                        width="46"
                        height="46"
                        fill="white"
                        transform="translate(23 22)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              )
            }
          />
          <SuccessPopUpModal
            title="Success"
            message={showModalText}
            modalPopUp={showSuccessMessage}
            showActionBtns={true}
            isArchived={false}
            setModalPopUp={setShowSuccessMessage}
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
    </>
  );
};

export default FavoriteList;
