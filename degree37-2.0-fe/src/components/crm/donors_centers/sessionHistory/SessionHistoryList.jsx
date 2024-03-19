import React, { useEffect } from 'react';
import TopBar from '../../../common/topbar/index';
import Pagination from '../../../common/pagination';
import { useSearchParams, useParams } from 'react-router-dom';
import { DonorCentersBreadCrumbsData } from '../DonorCentersBreadCrumbsData';
import {
  CRM_DONORS_CENTERS,
  DONOR_CENTERS_SESSION_HISTORY_PATH,
} from '../../../../routes/path';
import TopTabsDonorCenters from '../topTabsDonorCenters';
import SessionHistoryAnalytics from './SessionHistoryAnalytics';
import SessionHistoryFilters from './SessionHistoryFilters';
import TableList from './SessionHistoryTableList';
import { API } from '../../../../api/api-routes';
import SessionHistoryListModal from './SessionHistoryListModal';

const initialSearchParams = {
  page: 1,
  limit: 10,
  sortOrder: 'DESC',
  sortName: 'sessions.id',
};

export default function SessionHistoryList() {
  const { donor_center_id } = useParams();
  const [sessionsHistory, setSessionsHistory] = React.useState([]);
  const [totalSessionsHistory, setTotalSessionsHistory] = React.useState(0);
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [typeFilter, setTypeFilter] = React.useState('Percentage');
  const [kindFilter, setKindFilter] = React.useState('Procedures');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = React.useState(-1);
  const [selectedRowId, setSelectedRowId] = React.useState(null);

  const showRowData = (item) => {
    setSelectedRowId(item.id);
    setModalOpen(true);
  };

  const breadcrumbsData = [
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Centers',
      class: 'active-label',
      link: CRM_DONORS_CENTERS.VIEW.replace(':id', donor_center_id),
    },
    {
      label: 'Session History',
      class: 'active-label',
      link: DONOR_CENTERS_SESSION_HISTORY_PATH.LIST.replace(
        ':donor_center_id',
        donor_center_id
      ),
    },
  ];
  const tableHeaders = [
    { name: 'date', label: 'Date', width: '10%', sortable: true },
    { name: 'appointment', label: 'Appts', width: '5%', sortable: true },
    { name: 'projection', label: 'Proj', width: '5%', sortable: true },
    { name: 'registered', label: 'Reg', width: '5%', sortable: true },
    { name: 'performed', label: 'Perf', width: '5%', sortable: true },
    { name: 'actual', label: 'Actual', width: '5%', sortable: true },
    { name: 'pa', label: 'PA', width: '5%', sortable: true },
    { name: 'deferrals', label: 'Def', width: '5%', sortable: true },
    { name: 'qns', label: 'QNS', width: '5%', sortable: true },
    { name: 'ftd', label: 'FTD', width: '5%', sortable: true },
    { name: 'walkouts', label: 'WO', width: '5%', sortable: true },
    { name: 'void', label: 'Void', width: '5%', sortable: true },
    { name: 'noofshifts', label: 'Shift', width: '10%', sortable: true },
    { name: 'tooltip', label: '', width: '10%', sortable: true },
    { name: 'status', label: 'Status', width: '5%', sortable: true },
  ];

  useEffect(() => {
    const getHistory = async () => {
      const { data: response } =
        await API.systemConfiguration.organizationalAdministrations.facilities.getSessionHistory(
          donor_center_id,
          searchParams
        );
      const {
        data: { result, count },
      } = response;

      setTotalSessionsHistory(count);
      setSessionsHistory(result);
    };

    getHistory();
  }, [donor_center_id, searchParams]);

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

  const handleSort = (columnName) => {
    setSortName(columnName);
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
  };

  const handleFilter = (filterName, value) => {
    let filters = Object.fromEntries(searchParams);
    switch (filterName) {
      case 'date_range': {
        const { startDate, endDate } = value;
        if (startDate)
          filters = {
            ...filters,
            start_date: new Date(startDate).toISOString(),
          };
        else delete filters['start_date'];
        if (endDate)
          filters = {
            ...filters,
            end_date: new Date(endDate).toISOString(),
          };
        else delete filters['end_date'];
        break;
      }
      default:
        if (value) filters = { ...filters, [filterName]: value };
        else delete filters[filterName];
        break;
    }
    setSearchParams(filters);
    setPage(1);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={breadcrumbsData}
        BreadCrumbsTitle="Session History"
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <TopTabsDonorCenters
        donorCenterId={donor_center_id}
        typeFilter={typeFilter}
        kindFilter={kindFilter}
        onTypeFilter={setTypeFilter}
        onKindFilter={setKindFilter}
        hideSessionHistoryOptions={false}
        hideSession
      />
      <SessionHistoryAnalytics
        donorCenterId={donor_center_id}
        kindFilter={kindFilter}
        typeFilter={typeFilter}
      />
      <SessionHistoryFilters
        params={Object.fromEntries(searchParams)}
        handleFilter={handleFilter}
      />
      <div className="mainContentInner">
        <TableList
          isLoading={false}
          data={sessionsHistory}
          headers={tableHeaders}
          handleSort={handleSort}
          onRowClick={showRowData}
        />
        {selectedRowId && (
          <SessionHistoryListModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            setExpandedRow={setExpandedRow}
            expandedRow={expandedRow}
            donorCenterId={donor_center_id}
            selectedRowId={selectedRowId}
          />
        )}
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={page}
          setCurrentPage={setPage}
          totalRecords={totalSessionsHistory}
        />
      </div>
    </div>
  );
}
