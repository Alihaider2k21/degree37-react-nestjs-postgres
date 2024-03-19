import React, { useEffect, useState } from 'react';
import Topbar from '../../../common/topbar/index';
import { useParams } from 'react-router';
import TopTabsNCP from '../topTabsNCP';
import SelectDropdown from '../../../common/selectDropdown';

import {
  CRM_NON_COLLECTION_PROFILES_EVENT_HISTORY_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';
import TableList from '../../../common/tableListing';
import { toast } from 'react-toastify';
import moment from 'moment';
import { API } from '../../../../api/api-routes';
import Pagination from '../../../common/pagination';
import DatePicker from '../../../common/DatePicker';
// import { formatDate } from '../../../../helpers/formatDate';

function EventHistoryList() {
  const { id } = useParams();
  const [searchText, setSearchText] = useState('');
  const [statusDataText, setStatusDataText] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [ncBluePrintList, setNcBluePrintLis] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState([]);
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
      label: 'Event History',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_EVENT_HISTORY_PATH.LIST.replace(
        ':id',
        id
      ),
    },
  ];
  const handleStatus = (value) => {
    if (value !== null) {
      setStatusDataText(value);
    } else {
      setStatusDataText(value);
    }
  };
  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
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
  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem('token');
      try {
        let dateFormat = null;
        if (!dateRange.includes(null)) {
          dateFormat = dateRange.map((item) => {
            return moment(item).format('YYYY-MM-DD HH:mm:ss');
          });
        }
        const { data } = await API.nonCollectionProfiles.getEventHistory(
          token,
          id,
          currentPage,
          limit,
          sortBy,
          sortOrder,
          statusDataText,
          searchText,
          dateFormat
        );
        console.log(data, 'data');
        setNcBluePrintLis(data?.data);
        setTotalRecords(data?.total_records);
      } catch (e) {
        toast.error(`${e?.message}`, { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    getData();
    return () => {
      setNcBluePrintLis(null);
    };
  }, [
    sortBy,
    sortOrder,
    limit,
    currentPage,
    statusDataText,
    searchText,
    dateRange,
    id,
  ]);

  useEffect(() => {
    getStatusData();
  }, []);

  const getStatusData = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } =
        await API.ocNonCollectionEvents.getAlloperationstatus(token);
      if (data?.data?.length) {
        const statusData = data?.data.map((value) => {
          return {
            label: value.name,
            value: value.name,
          };
        });
        setStatus(statusData);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    }
  };
  const [startDate, endDate] = dateRange;

  const tableHeaders = [
    {
      name: 'date',
      label: 'Date',
      width: '25%',
      sortable: true,
      link: true,
    },
    {
      name: 'event_name',
      label: 'Name',
      width: '25%',
      sortable: true,
    },
    {
      name: 'location',
      label: 'Location',
      width: '25%',
      sortable: true,
    },
    {
      name: 'event_status',
      label: 'Status',
      width: '25%',
      sortable: true,
    },
  ];
  return (
    <div className="mainContent ">
      <Topbar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Non-Collection Events'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <TopTabsNCP NCPID={id} />
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className={`d-flex`}>
              <div className={`me-4`} style={{ width: '280px' }}>
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange={true}
                  className={`custom-datepicker custom-datepicker-placeholder`}
                  placeholderText="Date Range"
                  selected={startDate}
                  onChange={(date) => {
                    setSortBy('date');
                    setSortOrder((prevSortOrder) =>
                      prevSortOrder === 'ASC' ? 'DESC' : 'ASC'
                    );
                    setDateRange(date);
                  }}
                  isClearable={true}
                />
              </div>
              <div>
                <SelectDropdown
                  label="Status"
                  options={status}
                  selectedValue={statusDataText}
                  onChange={(val) => {
                    handleStatus(val);
                  }}
                  removeDivider
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
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
      </div>
      {/* <SuccessPopUpModal
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
      /> */}
    </div>
  );
}

export default EventHistoryList;
