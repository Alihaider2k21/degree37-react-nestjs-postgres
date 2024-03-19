import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import { Link, useNavigate } from 'react-router-dom';
import SvgComponent from '../../../common/SvgComponent';
import TableList from './TableListing';
import Pagination from '../../../common/pagination';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { toast } from 'react-toastify';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
} from '../../../../routes/path';
import Permissions from '../../../../enums/OcPermissionsEnum.js';
import CheckPermission from '../../../../helpers/CheckPermissions';
import moment from 'moment';
import { API } from '../../../../api/api-routes.js';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import SuccessPopUpModal from '../../../common/successModal/index.js';

function DriveList() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [childSortBy, setChildSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [archivePopup, setArchivePopup] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [archiveId, setArchiveId] = useState(false);

  const navigate = useNavigate();

  const archive = async () => {
    try {
      const response = await API.operationCenter.drives.archive(archiveId);
      const { data } = response;
      const { status_code: status } = data;
      console.log({ status });
      if (status === 204) {
        setArchiveSuccess(true);
        setArchivePopup(false);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Operations',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Drive',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
  ];

  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'link_my',
      sortable: false,
    },
    {
      name: 'date',
      label: 'Operation Date',
      sortable: true,
    },
    {
      name: 'account',
      label: 'Account',
      sortable: true,
    },
    {
      name: 'crm_locations',
      label: 'Location',
      sortable: true,
    },
    {
      name: 'projection',
      label: 'Projection',
      sortable: true,
    },
    {
      name: 'hours',
      label: 'Hours',
      sortable: true,
    },
    {
      name: 'primaryCP',
      label: 'Primary CP',
      sortable: true,
    },
    {
      name: 'CPPhone',
      label: 'CP Phone',
      sortable: false,
    },
    {
      name: 'CPEmail',
      label: 'CP Email',
      minWidth: '15rem',
      width: '15rem',
      sortable: false,
    },
    {
      label: 'Status',
      name: 'status',
      sortable: true,
    },
  ]);

  const checkboxTableItems = [
    'Operation Date',
    'Account',
    'Location',
    'Projection',
    'Hours',
    'Primary CP',
    'CP Phone',
    'CP Email',
    'Status',
  ];

  const optionsConfig = [
    CheckPermission([Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.READ]) && {
      label: 'View',
      path: (rowData) => `${rowData?.drive?.id}/view/about`,
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => `${rowData?.drive?.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.COPY_DRIVE,
    ]) && {
      label: 'Copy Drive',
      path: (rowData) => `#`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.LINK_DRIVE,
    ]) && {
      label: 'Link Drive',
      // path: (rowData) => `#`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => {
        setArchiveId(rowData?.drive?.id);
        setArchivePopup(true);
      },
    },
  ].filter(Boolean);

  useEffect(() => {
    fetchAll();
  }, [sortBy, sortOrder, currentPage, limit]);

  const handleSort = (column, child) => {
    console.log({ sortBy }, { column });
    if (column == 'primaryCP') {
      return;
    }
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else if (sortOrder === 'DESC') {
        setSortOrder('ASC');
      } else {
        setSortOrder('ASC');
        setSortBy('');
        setChildSortBy(null);
      }
    } else {
      setSortBy(column);
      child ? setChildSortBy(child) : setChildSortBy(null);
      setSortOrder('ASC');
    }
  };
  const sortDataByPrimaryCp = () => {
    console.log(rows);
    const sortedArray = rows.sort((a, b) =>
      a.primaryCP.localeCompare(b.primaryCP)
    );
    console.log({ sortedArray });
    return sortedArray;
  };
  const fetchAll = async () => {
    try {
      if (sortBy == 'primaryCP') {
        return setRows(sortDataByPrimaryCp);
      }
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives?sortOrder=${sortOrder}&sortBy=${sortBy}&page=${currentPage}&limit=${limit}&keyword=${searchText}&childSortBy=${childSortBy}`
      );
      const data = await response.json();
      const records = data?.data?.map((item) => {
        let primaryCP = '';
        let CPPhone = '';
        let CPEmail = '';
        let status = '';
        let chipColor = '';
        let crm_locations = item?.crm_locations?.name;
        let hours = '';
        let link_my;
        let projection = `${item.oef_procedures ?? '0'}/${
          item.oef_products ?? '0'
        }`;
        let shiftsHours =
          item.shifts_hours && item.shifts_hours.length
            ? item.shifts_hours
            : [];
        let start_time = shiftsHours?.[0]?.start_time;
        let end_time = shiftsHours?.[0]?.end_time;
        for (let time of shiftsHours) {
          start_time =
            time.start_time < start_time ? time.start_time : start_time;
          end_time = time.end_time > end_time ? time.end_time : end_time;
        }
        hours = `${moment(start_time).format('hh:mm a')} - ${moment(
          end_time
        ).format('hh:mm a')}`;
        link_my = item?.drive?.is_linked == true ? 'yes' : 'no';
        for (let contact of item?.account?.account_contacts || []) {
          if (contact?.role_id?.name == 'Primary Chairperson') {
            primaryCP = `${contact?.record_id?.first_name || ''} ${
              contact?.record_id?.last_name || ''
            }`;
            CPPhone = contact?.record_id?.contactable_data?.[0]?.data;
            CPEmail = contact?.record_id?.contactable_data?.[1]?.data;
          }
        }
        if (item?.drive?.operation_status_id?.name) {
          status = item?.drive?.operation_status_id?.name;
          chipColor = `badge ${item?.drive?.operation_status_id?.chip_color}`;
        }
        return {
          ...item,
          link_my,
          crm_locations,
          primaryCP,
          status,
          hours,
          CPPhone,
          projection,
          CPEmail,
          date: item?.drive?.date,
          className: chipColor,
        };
      });
      setRows(records);
      setTotalRecords(data?.count);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setIsLoading(false);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Drives'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="mainContentInner p-0 mt-4">
        <div className="buttons d-flex align-items-center gap-3 ">
          <div className="dropdown-center">
            <div
              className="optionsIcon"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <SvgComponent name={'DownloadIcon'} /> Export Data
            </div>
            <ul className="dropdown-menu">
              <li>
                <Link
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    // setShowExportDialogue(true);
                    // setDownloadType('PDF');
                  }}
                >
                  PDF
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    // setShowExportDialogue(true);
                    // setDownloadType('CSV');
                  }}
                >
                  CSV
                </Link>
              </li>
            </ul>
          </div>
          {CheckPermission([
            Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.WRITE,
          ]) && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('create')}
            >
              Create Drive
            </button>
          )}
        </div>
        <div className="p-2">
          <TableList
            isLoading={isLoading}
            data={rows}
            hideActionTitle={true}
            headers={tableHeaders}
            handleSort={handleSort}
            optionsConfig={optionsConfig}
            setTableHeaders={setTableHeaders}
            checkboxTableItems={checkboxTableItems}
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
      <SuccessPopUpModal
        title="Success!"
        message="Drive archived."
        modalPopUp={archiveSuccess}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        onConfirm={() => {
          setArchiveSuccess(false);
          fetchAll();
        }}
      />
      <section className={`popup full-section ${archivePopup ? 'active' : ''}`}>
        <div className="popup-inner">
          <div className="icon">
            <img src={ConfirmArchiveIcon} alt="CancelIcon" />
          </div>
          <div className="content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to archive?</p>
            <div className="buttons">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setArchivePopup(false);
                }}
              >
                No
              </button>
              <button className="btn btn-primary" onClick={() => archive()}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DriveList;
