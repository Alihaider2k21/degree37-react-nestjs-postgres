import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../common/topbar/index';
import SvgComponent from '../../common/SvgComponent';
import Pagination from '../../common/pagination';
import axios from 'axios';
// import { formatCustomDate } from '../../../helpers/formatDate';

// Custom function to format the date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month} ${ordinalSuffix(day)}, ${year} ${hours}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

// Function to get the ordinal suffix (e.g., 1st, 2nd, 3rd, etc.)
const ordinalSuffix = (day) => {
  if (day === 1 || day === 21 || day === 31) {
    return `${day}st`;
  } else if (day === 2 || day === 22) {
    return `${day}nd`;
  } else if (day === 3 || day === 23) {
    return `${day}rd`;
  } else {
    return `${day}th`;
  }
};

const Reports = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [records, setRecords] = useState([]);
  const [type, setType] = useState('LOGIN');
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    // Reset for new report type
    setLimit(process.env.REACT_APP_PAGE_LIMIT ?? 10);
    setSearchText('');
    setCurrentPage(1);
    setRecords('');
    setSortBy('');
    setSortOrder('');
    fetchData();

    fetchData();
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, searchText]);

  const fetchData = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    };
    try {
      let url = `${BASE_URL}/reports/${type}?limit=${limit}&page=${currentPage}`;

      if (searchText) {
        url += `&keyword=${searchText}`;
      }

      const result = await axios.get(url, config);
      const data = await result?.data;
      setRecords(data?.data);
      setTotalRecords(data?.total_records);
    } catch (error) {
      toast.error(`Failed to fetch ${type} report.`, { autoClose: 3000 });
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    const sorted = [...records];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy]?.toLowerCase();
        const bValue = b[sortBy]?.toLowerCase();

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [records, sortBy, sortOrder]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const BreadcrumbsData = [
    { label: 'System Configurations', class: 'disable-label', link: '/' },
    {
      label: 'Log and Event Management',
      class: 'active-label',
      link: '/system-configuration/reports',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Log and Event Management'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="tabs">
          <ul>
            <li>
              <Link
                to={'#'}
                onClick={() => setType('LOGIN')}
                className={type === 'LOGIN' ? 'active' : ''}
              >
                User Login Report
              </Link>
            </li>
            <li>
              <Link
                to={'#'}
                onClick={() => setType('LOGIN_FAILURE')}
                className={type === 'LOGIN_FAILURE' ? 'active' : ''}
              >
                Login Fails Report
              </Link>
            </li>
            <li>
              <Link
                to={'#'}
                onClick={() => setType('USER_ACTIVITY')}
                className={type === 'USER_ACTIVITY' ? 'active' : ''}
              >
                User Activity Report
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mainContentInner">
        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="10%" align="center">
                    <div className="inliner">
                      <span className="title">Page Name</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('page_name')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="7%" align="center">
                    <div className="inliner">
                      <span className="title">Activity</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('activity')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner">
                      <span className="title">Email</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('email')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner">
                      <span className="title">Name</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('name')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="10%" align="center">
                    <div className="inliner">
                      <span className="title">Application</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('browser')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>

                  <th width="20%" align="center">
                    <div className="inliner">
                      <span className="title">Location</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('location')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>

                  <th className="title" width="15%">
                    <div className="inliner">
                      <span className="title">Date Time</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('date_time')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>

                  <th className="title" width="8%">
                    <div className="inliner">
                      <span className="title">Status</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('status')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords?.length ? (
                  sortedRecords?.map((record) => {
                    return (
                      <tr key={record.date_time}>
                        <td>{record.page_name}</td>
                        <td>{record.activity}</td>
                        <td>{record.email}</td>
                        <td>{record.name}</td>
                        <td>{record.browser}</td>
                        <td>{record.location}</td>
                        <td>{formatDate(record.date_time)}</td>
                        <td>
                          {record.status === 'Success' ? (
                            <span className="badge active">Success</span>
                          ) : (
                            <span className="badge inactive">Failure</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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

export default Reports;
