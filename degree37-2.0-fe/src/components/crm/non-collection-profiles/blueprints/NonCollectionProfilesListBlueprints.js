import React, { useEffect, useState } from 'react';
import Topbar from '../../../common/topbar/index';
import {
  CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';
import { Link, useParams } from 'react-router-dom';
import TopTabsNCP from '../topTabsNCP';
import SelectDropdown from '../../../common/selectDropdown';
import styles from './index.module.scss';
import TableList from '../../../common/tableListing';
import SuccessPopUpModal from '../../../common/successModal';
import Pagination from '../../../common/pagination';
import { API } from '../../../../api/api-routes.js';
import { toast } from 'react-toastify';
import moment from 'moment';

const NonCollectionProfilesListBlueprints = () => {
  const { id } = useParams();
  const [statusFilterData, setStatusFilterData] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [modalPopUpType, setModalPopUpType] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showModalText, setShowModalText] = useState(null);
  const [ncBluePrintList, setNcBluePrintLis] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusDataText, setStatusDataText] = useState({
    label: 'Active',
    value: true,
  });
  const [archiveId, setArchiveID] = useState(null);
  const [defaultId, setdefaultID] = useState(null);

  useEffect(() => {
    getData();
  }, [sortBy, sortOrder, limit, currentPage, statusDataText, searchText]);

  const getData = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.getAllBlueprint(
        token,
        id,
        currentPage,
        limit,
        sortBy,
        sortOrder,
        statusDataText,
        searchText
      );
      if (data) {
        const modified = data?.data
          ?.map((item) => {
            const eventHours = `${moment(item?.min_start_time, 'hh:mm A')
              .utc(item?.min_start_time)
              .local()
              .format('hh:mm A')} - ${moment(item?.max_end_time, 'hh:mm A')
              .utc(item?.max_end_time)
              .local()
              .format('hh:mm A')}`;

            return {
              id: item?.id,
              blueprint_name: item?.blueprint_name,
              location_id: `${item?.location_id?.name} - ${item?.location_id?.room}`,
              event_hours: eventHours,
              additional_info: item?.additional_info,
              is_active: item?.is_active,
              verticalLabel: item?.id_default ? 'Default' : '',
            };
          })
          ?.sort((a, b) => (b.verticalLabel === 'Default' ? -1 : 1));
        setNcBluePrintLis(modified);
        setTotalRecords(data?.count);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.patchArchive(
        archiveId,
        token
      );
      console.log(data, 'data archived');
      if (data?.status === 'success') {
        setModalPopUp(false);
        setShowModalText('Blueprint is archived.');
        setShowSuccessMessage(true);
        getData();
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };
  const handleMakeDefault = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.patchDefault(
        defaultId,
        token
      );
      if (data?.status === 'success') {
        setModalPopUp(false);
        setShowModalText('The blueprint has been set as the default.');
        setShowSuccessMessage(true);
        getData();
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      setSortBy(columnName);
      setSortOrder('ASC');
    }
  };

  const BreadcrumbsData = [
    { label: 'CRM', class: 'disable-label', link: '/crm/accounts' },
    {
      label: 'Non-Collection Profiles',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_PATH.LIST,
    },
    {
      label: 'View Non-Collection Profiles',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_PATH.VIEW.replace(':id', id),
    },
    {
      label: 'Blueprints',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.LIST.replace(':id', id),
    },
  ];
  const statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];
  const handleStatus = (value) => {
    if (value !== null) {
      setStatusFilterData(value?.value);
      setStatusDataText(value);
    } else {
      setStatusFilterData('');
      setStatusDataText(value);
    }
    console.log({ statusFilterData });
    setIsLoading(false);
  };
  const tableHeaders = [
    {
      name: 'blueprint_name',
      label: 'Blueprint Name',
      width: '15%',
      sortable: true,
    },
    {
      name: 'location_id',
      label: 'Location',
      width: '15%',
      sortable: true,
    },
    {
      name: 'event_hours',
      label: 'Event Hours',
      width: '15%',
      sortable: false,
      icon: false,
    },
    {
      name: 'additional_info',
      label: 'Additional Information',
      width: '35%',
      sortable: true,
      icon: false,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];

  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) =>
        CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.VIEW.replace(
          ':nonCollectionProfileId',
          id
        ).replace(':id', rowData.id),
      action: (rowData) => {},
      // /crm/non-collection-profiles/:nonCollectionProfileId/blueprints/:id/view-blueprint
    },
    {
      label: 'Edit',
      path: (rowData) =>
        CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.EDIT.replace(
          ':nonCollectionProfileId',
          id
        ).replace(':id', rowData.id),
      action: (rowData) => {},
      // EDIT: '/crm/non-collection-profiles/:nonCollectionProfileId/blueprints/:id/edit',
    },
    {
      label: 'Schedule Event',
      action: (rowData) => {},
    },
    {
      label: 'Make Default',
      action: (rowData) => {
        setdefaultID(rowData?.id);
        setModalPopUpType('default');
        setShowModalText('Are you sure you want to make this the default?');
        setModalPopUp(true);
      },
    },
    {
      label: 'Archive',
      action: (rowData) => {
        setArchiveID(rowData?.id);
        setModalPopUpType('archive');
        setShowModalText('Are you sure you want to archive?');
        setModalPopUp(true);
      },
    },
  ];

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="mainContent ">
      <Topbar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Blueprints'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <TopTabsNCP
        NCPID={id}
        buttonRight={
          <div
            className="buttons position-absolute"
            style={{ right: 20, bottom: 17 }}
          >
            <Link
              className="btn btn-primary"
              to={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.CREATE.replace(
                ':id',
                id
              )}
            >
              Add Blueprint
            </Link>
          </div>
        }
      />
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className={`d-flex`}>
              <div className={`me-4 ${styles.dropdownWidthMenu}`}>
                <SelectDropdown
                  label="Status"
                  options={statusOptions}
                  selectedValue={statusDataText}
                  removeDivider
                  onChange={(val) => {
                    handleStatus(val);
                  }}
                  showLabel
                  placeholder="Status"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <TableList
          isLoading={isLoading}
          showVerticalLabel
          data={ncBluePrintList}
          hideActionTitle={true}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortBy}
          sortOrder={sortOrder}
          favorite
          optionsConfig={optionsConfig}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
      </div>
      <SuccessPopUpModal
        title="Confirmation"
        message={showModalText}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={() =>
          modalPopUpType === 'archive' ? handleArchive() : handleMakeDefault()
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
    </div>
  );
};

export default NonCollectionProfilesListBlueprints;
