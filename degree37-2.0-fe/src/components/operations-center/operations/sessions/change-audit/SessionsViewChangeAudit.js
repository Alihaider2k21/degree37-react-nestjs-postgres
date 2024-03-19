import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../../../common/topbar/index';
import TableList from '../../../../common/tableListing';
import Pagination from '../../../../common/pagination';
import { fetchData } from '../../../../../helpers/Api';
import {
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_NCE,
  OPERATIONS_CENTER_NCE_CHANGE_AUDIT_PATH,
} from '../../../../../routes/path';
import SessionsNavigationTabs from '../navigationTabs';
import Session from '../Session';

const statusOptions = [
  { label: 'Scheduled', value: 1, className: 'badge Grey' },
  { label: 'Complete', value: 2, className: 'badge active' },
  { label: 'Incomplete', value: 3, className: 'badge Yellow' },
  { label: 'Cancelled', value: 4, className: 'badge inactive' },
];
const SessionsViewChangeAudit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const { id } = useParams();
  const getWithStatus = async () => {
    setIsLoading(true);
    const result = await fetchData(
      `/oc_non_collection_events/${id}/change-audit?limit=${limit}&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    const { data, status, count } = result;
    if (status === 200) {
      setScheduleData(
        data.map((singleData) => {
          let tempStatus = statusOptions.find(
            (option) =>
              option.value === Number(singleData?.donor_appointment?.status)
          );
          return {
            ...singleData,
            note: singleData?.donor_appointment?.note,
            date: singleData?.date?.date,
            location: singleData?.date?.location?.location,
            slot_start_time: new Date(
              singleData?.shifts_slots?.slot_start_time
            ).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }),
            status: tempStatus?.label,
            className: tempStatus?.className,
            donation_type: singleData?.procedure_types?.donation_type,
          };
        })
      );
      setTotalRecords(count);
      if (!(data?.length > 0) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setIsLoading(false);
    } else {
      toast.error('Error Getting Audit', { autoClose: 3000 });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getWithStatus();
  }, [sortBy, sortOrder, currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);
  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
    },
    {
      label: 'Operations',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Non-Collection Events',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE.LIST.replace(':id', id),
    },
    {
      label: 'View Non-Collection Event',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE.VIEW.replace(':id', id),
    },
    {
      label: 'Change Audit',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE_CHANGE_AUDIT_PATH.LIST.replace(':id', id),
    },
  ];
  const tableHeaders = [
    { name: 'date', label: 'Change What', sortable: true },
    { name: 'location', label: 'Change From', sortable: true },
    {
      name: 'slot_start_time',
      label: 'Change To',
      sortable: true,
    },
    { name: 'donation_type', label: 'Changed When', sortable: true },
    { name: '', label: '', sortable: false },
  ];

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
          BreadCrumbsTitle={'Change Audit'}
        />
        <div className="mainContentInner bg-white pb-0 mb-3">
          <Session />
          <SessionsNavigationTabs />
        </div>
        <div className="mainContentInner">
          <TableList
            isLoading={isLoading}
            data={scheduleData}
            headers={tableHeaders}
            handleSort={handleSort}
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
      </div>
    </>
  );
};

export default SessionsViewChangeAudit;
