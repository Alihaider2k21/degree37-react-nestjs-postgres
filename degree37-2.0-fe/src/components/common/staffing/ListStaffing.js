import React, { useEffect, useState } from 'react';
import TopBar from '../topbar/index';
import Pagination from '../pagination';
import TableList from '../tableListing';

const ListStaffing = ({
  taskableType = null,
  taskableId = null,
  breadCrumbsData,
  createTaskUrl,
  customTopBar,
  hideAssociatedWith,
  tasksNotGeneric,
  calendarIconShowHeader,
}) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [staffingListData, setStaffingListData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const accessToken = localStorage.getItem('token');

  const formatDate = (dateToFormat) => {
    const date = new Date(dateToFormat);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const formattedTime = `${hours12}:${minutes.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })} ${amPm}`;

    return formattedTime;
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const result = await fetch(
        `${BASE_URL}/operations/${taskableType}/${taskableId}/staffing?shiftable_type=${taskableType}${
          limit ? `&limit=${limit}` : ''
        }${currentPage ? `&page=${currentPage}` : ''}${
          sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      let data = await result.json();
      let count = data?.record_count;
      data = data?.data.map((item) => {
        return {
          ...item,
          begin_day: formatDate(item.begin_day),
          end_day: formatDate(item.end_day),
        };
      });

      setStaffingListData(data);
      setTotalRecords(count);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage, limit, taskableType, taskableId, sortBy, sortOrder]);

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

  const tableHeaders = [
    {
      name: 'role',
      label: 'Role',
      width: '17.5%',
      sortable: true,
    },
    {
      name: 'staff_name',
      label: 'Staff Name',
      width: '17.5%',
      sortable: true,
    },
    { name: 'begin_day', label: 'Begin Day', width: '20%', sortable: true },
    {
      name: 'draw_hours',
      label: 'Draw Hours',
      width: '17.5%',
      sortable: true,
    },
    {
      name: 'end_day',
      label: 'End Day',
      width: '17.5%',
      sortable: true,
    },
    {
      name: 'total_hours',
      label: 'Total Hours',
      width: '17.5%',
      sortable: true,
    },
  ];

  const tableHeadersGeneric = [
    {
      name: 'role',
      label: 'Role',
      width: '17.5%',
      sortable: true,
    },
    {
      name: 'staff_name',
      label: 'Staff Name',
      width: '17.5%',
      sortable: true,
    },
    { name: 'begin_day', label: 'Begin Day', width: '20%', sortable: true },
    {
      name: 'draw_hours',
      label: 'Draw Hours',
      width: '20%',
      sortable: true,
    },
    {
      name: 'end_day',
      label: 'End Day',
      width: '10%',
      sortable: true,
    },
    { name: 'total_hours', label: 'Total Hours', width: '10%', sortable: true },
  ];

  return (
    <div className="mainContent">
      <TopBar BreadCrumbsData={breadCrumbsData} BreadCrumbsTitle={'Staffing'} />
      {customTopBar && customTopBar}
      <div className="mainContentInner">
        <TableList
          isLoading={isLoading}
          data={staffingListData}
          hideActionTitle={true}
          headers={
            (taskableType && taskableId) || tasksNotGeneric
              ? tableHeaders
              : tableHeadersGeneric
          }
          handleSort={handleSort}
          sortName={sortBy}
          sortOrder={sortOrder}
        />

        <Pagination
          limit={limit}
          setLimit={(value) => setLimit(value)}
          currentPage={currentPage}
          setCurrentPage={(value) => setCurrentPage(value)}
          totalRecords={totalRecords}
        />
      </div>
    </div>
  );
};

export default ListStaffing;
