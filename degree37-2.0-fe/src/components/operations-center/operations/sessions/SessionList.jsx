/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import TableList from './tableList';
import Pagination from '../../../common/pagination';
import SessionFilter from './filter/SessionFilter';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import ConfirmModal from '../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { OPERATIONS_CENTER_SESSIONS_PATH } from '../../../../routes/path';
import { API } from '../../../../api/api-routes';

const initialSearchParams = {
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'id',
};

function SessionList() {
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [sessions, setSessions] = React.useState([]);
  const [total, setTotal] = React.useState(-1);
  const [archiveSession, setArchiveSession] = React.useState(null);
  const [operationStatus, setOperationStatus] = React.useState([]);
  const [promotions, setPromotions] = React.useState([]);
  const [page, setPage] = React.useState(searchParams.get('page'));
  const [limit, setLimit] = React.useState(searchParams.get('limit'));
  const [sortOrder, setSortOrder] = React.useState(
    searchParams.get('sortOrder')
  );
  const [sortName, setSortName] = React.useState(searchParams.get('sortName'));
  const [keyword, setKeyword] = useState(searchParams.get('keyword'));
  const [isLoading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [filterApplied, setFilterApplied] = useState({});
  const navigate = useNavigate();

  const optionsConfig = [
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.READ,
    ]) && {
      label: 'View',
      path: (rowData) => `${rowData.id}/view/about`,
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.SESSIONS,
    ]) && {
      label: 'Copy Session',
      path: (rowData) => `#`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => setArchiveSession(rowData),
    },
  ].filter(Boolean);

  const breadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Sessions',
      class: 'disable-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
    },
  ];

  const tableHeaders = [
    {
      name: 'date',
      label: 'Session Date',
      sortable: true,
    },
    {
      name: 'donor_center',
      label: 'Donor Center',
      sortable: true,
    },
    {
      name: 'projection',
      label: 'Projection',
      sortable: true,
    },
    {
      name: 'hours',
      label: 'Session Hours',
      sortable: true,
    },
    {
      name: 'oef',
      label: 'OEF',
      sortable: true,
    },
    {
      name: 'status',
      label: 'Status',
      sortable: true,
    },
    {
      name: 'collection_operation',
      label: 'Collection Operation',
      sortable: true,
      hidden: true,
    },
    {
      name: 'promotions',
      label: 'Promotions',
      sortable: true,
      hidden: true,
    },
  ];

  const checkboxTableItems = [
    'Session Date',
    'Donor Center',
    'Projection',
    'Session Hours',
    'OEF',
    'Status',
    'Collection Operation',
    'Promotions',
  ];

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

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const {
        data: { data = {} },
      } = await API.operationCenter.sessions.list({
        ...Object.fromEntries(searchParams),
        ...filterApplied,
      });
      setSessions(data?.records || []);
      setTotal(data?.count || 0);
      setOperationStatus(data?.operationStatus || []);
      setPromotions(data?.promotions || []);
      setLoading(false);
    };

    if (!archiveSession) fetchSessions();
  }, [searchParams, filterApplied, archiveSession]);

  const handleSearch = (e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value.length > 1 || value.length < searchParams.get('keyword').length) {
      const searchObj = { ...Object.fromEntries(searchParams), keyword: value };
      if (value.length > 1 && searchParams.get('keyword') !== value) {
        setPage(1);
        setSearchParams(searchObj);
      } else setSearchParams(searchObj);
    }
    setKeyword(value);
  };

  const handleSort = (column) => {
    setSortName(column === 'hours' ? 'start_time' : column);
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
  };

  const handleFilters = (filters) => {
    Object.keys(filters).forEach((key) => {
      if (!filters[key]) delete filters[key];
      else if (key.includes('date')) filters[key] = filters[key].toISOString();
    });
    setFilterApplied(filters);
  };

  const handleArchive = async () => {
    await API.operationCenter.sessions.delete(archiveSession?.id);
    setArchiveSession(null);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={breadcrumbsData}
        BreadCrumbsTitle={'Sessions'}
        SearchPlaceholder={'Search'}
        SearchValue={keyword}
        SearchOnChange={handleSearch}
      />
      <div className="mainContentInner">
        <SessionFilter
          setLoading={setLoading}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          fetchAllFilters={handleFilters}
          status={operationStatus}
          promotions={promotions}
        />
        {CheckPermission([
          Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.WRITE,
        ]) && (
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate('create')}
            >
              Create Session
            </button>
          </div>
        )}
        <div>
          <TableList
            isLoading={isLoading}
            data={sessions}
            hideActionTitle={true}
            headers={tableHeaders}
            handleSort={handleSort}
            optionsConfig={optionsConfig}
            checkboxTableItems={checkboxTableItems}
          />
        </div>
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={page}
          setCurrentPage={setPage}
          totalRecords={total}
        />
      </div>
      <ConfirmModal
        showConfirmation={archiveSession !== null}
        onCancel={() => setArchiveSession(null)}
        onConfirm={handleArchive}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
    </div>
  );
}

export default SessionList;
