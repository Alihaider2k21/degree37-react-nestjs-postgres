import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../common/topbar/index';
import Pagination from '../../common/pagination/index';
import ScheduleTable from './staff-schedule/ScheduleTable';
import { ViewScheduleBreadCrumbsData } from './ViewScheduleBreadCrumbsData';
import ViewScheduleFilters from './viewScheduleFilters/viewScheduleFilters';
import NavTabs from '../../common/navTabs';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';

let inputTimer = null;

function ViewSchedule() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(25);
  // const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState();
  const [filtersApplied, setFiltersApplied] = useState({});
  const [tableHeaders] = useState([
    {
      id: 1,
      name: 'name',
      label: 'Name',
      sortable: true,
      splitlabel: false,
    },
    {
      id: 2,
      name: 'total_hours',
      label: 'Total Hours',
      sortable: true,
      splitlabel: false,
    },
  ]);

  const Tabs = [
    {
      label: 'Staff Schedule',
      link: '/staffing-management/view-schedules/staff-schedule',
    },
    {
      label: 'Depart Schedule',
      link: '/staffing-management/view-schedules/depart-schedule',
    },
  ];
  const location = useLocation();
  const currentLocation = location.pathname;

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading) {
      fetchAllData();
    }
  };

  useEffect(() => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setIsLoading(true);
      fetchAllData(filtersApplied);
    }, 500);
    if (tableHeaders.length <= 2) {
      setupDates();
    }
  }, [searchText, limit, currentPage, refresh]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const setupDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today.setDate(diff + i));
      const formattedDate = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });
      const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' }); // Getting the weekday name
      tableHeaders.push({
        id: i + 3, // i = 0, at start there are 2 headers, so (i + 1 + 2) = i + 3
        name: weekdayName,
        date: formattedDate,
        label: weekdayName + ' ' + formattedDate,
        splitlabel: true,
      });
    }
  };

  const formatResponse = (data) => {
    const formattedData = [];
    // 1. Map trough the entire response, get all staff ids without duplicates
    const uniqueStaffIds = Array.from(new Set(data.data.map((obj) => obj.id)));
    // 2. For every unique staff_id, find all schedules and push to schedules array
    uniqueStaffIds.forEach((staff_id) => {
      const schedules = data.data.filter(
        (schedule) => schedule.id === staff_id
      );
      const schedulesArr = [];
      /* 3. Loop trough schedules, and create a new JSON object 
      with fields which are different for every schedule of the same staff */
      schedules.forEach((element) => {
        schedulesArr.push({
          date:
            element.date === null
              ? '2023-12-13'
              : element.date.substring(0, 10), // this will be removed after backend part is configured correctly
          role_name: element.role_name,
          shift_start_time: element.shift_start_time,
          shift_end_time: element.shift_end_time,
          depart_time: element.depart_time.substring(0, 10), // configure to show time only
          return_time: element.return_time.substring(0, 10), // configure to show time only
          account_name: element.account_name,
          location_address: element.location_address,
          vehicle_name: element.vehicle_name,
          is_on_leave: element.is_on_leave,
          created_at: element.created_at,
          created_by: element.created_by,
        });
      });
      /* formattedData objects contain fields which are equal for every schedule of the same staff,
      plus the newly created schedules array, containing all schedules for that one staff.
      */
      formattedData.push({
        id: staff_id,
        staff_name: schedules?.[0].staff_name,
        total_hours: schedules?.[0].total_hours,
        schedules: schedulesArr,
      });
    });
    return formattedData;
  };

  const fetchAllData = async (filters) => {
    /* Search functionality should be implemented with API request, 
    because the user searches all data, not just the currently fetched data (ex. first 25 rows) */
    try {
      setFiltersApplied(filters);

      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/view-schedules/staff-schedules?sortOrder=${sortOrder}&sortBy=${sortBy}&page=${currentPage}&limit=${limit}${
          searchText && searchText.length ? '&name=' + searchText : ''
        }`
      );

      const data = await response.json();
      const formattedResponse = formatResponse(data);
      setRows(formattedResponse);
      setTotalRecords(formattedResponse?.count);
      setIsLoading(false);
      // setRecords((prevRecords) => [...prevRecords, ...data]);
      // setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setFiltersApplied(filters);
  };

  const handleSort = (column) => {
    if (column === 'name') {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else {
        setSortOrder('ASC');
      }
    } else if (column === 'total_hours') {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else {
        setSortOrder('ASC');
      }
    }
    setSortBy(column);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={ViewScheduleBreadCrumbsData}
        BreadCrumbsTitle={'View Schedule'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="mainContentInner">
        <ViewScheduleFilters
          fetchAllFilters={fetchAllData}
          setIsLoading={setIsLoading}
          setSelectedOptions={setSelectedOptions}
          selectedOptions={selectedOptions}
        />
        <div className="filterBar px-0 py-0">
          <NavTabs tabs={Tabs} currentLocation={currentLocation} />
        </div>
        <ScheduleTable
          isLoading={isLoading}
          data={rows}
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
    </div>
  );
}

export default ViewSchedule;
