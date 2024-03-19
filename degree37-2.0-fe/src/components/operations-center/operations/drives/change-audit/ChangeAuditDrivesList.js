import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import viewimage from '../../../../../assets/images/viewimage.png';
import {
  DRIVES_CHANGE_AUDIT_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
} from '../../../../../routes/path';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../helpers/Api';
import Pagination from '../../../../common/pagination';
import TableList from '../../../../common/tableListing';
import TopBar from '../../../../common/topbar/index';
import DriveViewNavigationTabs from '../navigationTabs';
import NavigationTopBar from '../../../../common/NavigationTopBar';

const ChangeAuditDrivesList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [auditData, setAuditData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [driveData, setDriveData] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const { drive_id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const getDriveData = async (drive_id) => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/${drive_id}`
      );
      const { data } = await result.json();
      data[0] ? setDriveData(data[0]) : setDriveData(null);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching drive');
    }
  };

  useEffect(() => {
    getDriveData(drive_id);
  }, []);

  const getWithStatus = async () => {
    setIsLoading(true);
    try {
      const result = await fetchData(
        `/drives/${drive_id}/change-audit?limit=${limit}&page=${currentPage}&sortName=${sortBy}&sortOrder=${sortOrder}`
      );
      const { data, status, count } = result;
      if (status === 200) {
        setAuditData(data);
        setTotalRecords(count);
        if (!(data?.length > 0) && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        setIsLoading(false);
      } else {
        toast.error('Error Getting Audit', { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
      toast.error('Error Getting Audit', { autoClose: 3000 });
    } finally {
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
      label: 'Drives',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'View Drive',
      class: 'active-label',
      link: `/operations-center/operations/drives/${drive_id}/view/about`,
    },
    {
      label: 'Change Audit',
      class: 'active-label',
      link: DRIVES_CHANGE_AUDIT_PATH.LIST.replace(
        ':drive_id',
        drive_id
      ).replace(':id', drive_id),
    },
  ];

  const tableHeaders = [
    { name: 'changes_field', label: 'Change What', sortable: true },
    { name: 'changes_from', label: 'Change From', sortable: true },
    {
      name: 'changes_to',
      label: 'Change To',
      sortable: true,
    },
    { name: 'changed_when', label: 'Changed When', sortable: true },
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
        <div className="imageMainContent">
          <NavigationTopBar img={viewimage} data={driveData} />
          <div className="d-flex align-items-center justify-between">
            <DriveViewNavigationTabs />
          </div>
        </div>
        <div className="mainContentInner">
          <TableList
            isLoading={isLoading}
            data={auditData}
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

export default ChangeAuditDrivesList;
