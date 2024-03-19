import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../common/topbar/index';
import Pagination from '../../common/pagination/index';
import { toast } from 'react-toastify';
import ArchivePopUpModal from '../../common/successModal';
import TableList from './accountsTableListing';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import SvgComponent from '../../common/SvgComponent';
import downloadExportIcon from '../../../assets/images/downloadExportIcon.png';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import './accountView.scss';
import * as _ from 'lodash';
import SuccessPopUpModal from '../../common/successModal';
import AccountFilters from './AccountFilters';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
import { downloadFile } from '../../../utils';
import { CRMAccountsBreadCrumbsData } from './AccountsBreadCrumbsData';
import { OPERATIONS_CENTER_DRIVES_PATH } from '../../../routes/path';

let inputTimer = null;

function AccountList() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showArchiveSuccessModal, setShowArchiveSuccessModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveId, setArchiveId] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [allAddresses, setAllAddresses] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [exportModal, setExportModal] = useState(false);
  const [downloadType, setDownloadType] = useState(null);
  const [exportType, setExportType] = useState('filtered');
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterFormData, setFilterFormData] = useState();

  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'BECS_code',
      minWidth: '10rem',
      width: '10rem',
      label: 'BECS Code',
      sortable: true,
      visible: true,
      splitlabel: true,
    },
    {
      name: 'name',
      label: 'Name',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
      visible: true,
    },
    {
      name: 'collection_operation',
      label: 'Collection Operation',
      minWidth: '14rem',
      width: '14rem',
      sortable: true,
      visible: true,
      splitlabel: true,
    },
    {
      name: 'city',
      label: 'City',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
      visible: true,
    },
    {
      name: 'state',
      label: 'State',
      minWidth: '10rem',
      width: '10rem',
      sortable: true,
      visible: false,
    },
    {
      name: 'industry_category',
      label: 'Category',
      sortable: true,
      visible: true,
    },
    {
      name: 'industry_subcategory',
      label: 'Subcategory',
      sortable: true,
      visible: false,
    },
    {
      name: 'recruiter',
      label: 'Recruiter',
      sortable: true,
      visible: true,
    },
    {
      name: 'stage',
      label: 'Stage',
      sortable: true,
      visible: false,
    },
    {
      name: 'source',
      label: 'Source',
      sortable: true,
      visible: false,
    },
    {
      name: 'territory',
      label: 'Territory',
      sortable: true,
      visible: false,
    },
    {
      name: 'population',
      label: 'Population',
      sortable: true,
      visible: false,
    },
    {
      name: 'RSMO',
      label: 'RSMO',
      sortable: true,
      visible: false,
    },
    {
      name: 'is_active',
      label: 'Status',
      sortable: true,
      visible: true,
    },
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    // Adding debouncer just so we won't call api on every search click
    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setIsLoading(true);
      fetchAllAccounts(filterFormData);
    }, 500);
  }, [searchText, limit, currentPage, sortBy, sortOrder]);

  const getStatusValue = (status) => {
    if (typeof status === 'string') {
      return status === 'active' ? true : status === 'inactive' ? false : '';
    } else if (typeof status === 'object' && 'value' in status) {
      return status.value === 'active'
        ? true
        : status.value === 'inactive'
        ? false
        : '';
    } else {
      return '';
    }
  };
  const getFilterValue = (filter) => {
    if (filter && typeof filter === 'object' && 'value' in filter) {
      return filter.value;
    } else if (filter && Array.isArray(filter)) {
      if (filter.length >= 1) {
        return filter.map((item) => (item?.id ? item.id : item)).join(',');
      }
    } else {
      return filter;
    }
  };
  const filterProperties = [
    { label: 'city', value: 'city' },
    { label: 'state', value: 'state' },
    { label: 'industryCategory', value: 'industry_category' },
    { label: 'industrySubCategory', value: 'industry_subcategory' },
    { label: 'stage', value: 'stage' },
    { label: 'source', value: 'source' },
    { label: 'collectionOperation', value: 'collection_operation' },
    { label: 'recruiter', value: 'recruiter' },
    { label: 'territory', value: 'territory' },
    { label: 'organizational_levels', value: 'organizational_levels' },
  ];
  const fetchAllAccounts = async (filters = {}) => {
    setFilterApplied(filters);
    try {
      const queryParams = filterProperties
        .map((property) => {
          const filterValue = getFilterValue(filters[property.value]);
          return filterValue ? `${property?.label}=${filterValue}` : '';
        })
        .filter((param) => param !== '')
        .join('&');

      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/accounts?page=${currentPage}&limit=${limit}${
          sortBy ? `&sortName=${sortBy}` : ''
        }${sortOrder ? `&sortOrder=${sortOrder}` : ''}${
          searchText ? `&keyword=${searchText}` : ''
        }&status=${getStatusValue(filters?.status)}&${queryParams}${
          exportType ? `&exportType=${exportType}` : ''
        }${downloadType ? `&downloadType=${downloadType}` : ''}
        ${exportType === 'all' ? `&fetchAll=${'true'}` : ''}
        ${
          selectedOptions && exportType === 'filtered'
            ? `&selectedOptions=${selectedOptions?.label}`
            : ''
        }
        &tableHeaders=${JSON.stringify(tableHeaders.map((item) => item.name))}`
      );
      const data = await response.json();
      setDownloadType(null);
      if (data?.url) {
        await downloadFile(data?.url);
      }
      setRows(data.data);
      setTotalRecords(data?.count);
      setAllAddresses(_.keyBy(data.addresses, 'addressable_id'));
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setIsLoading(false);
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

  const optionsConfig = [
    CheckPermission([
      CrmPermissions.CRM.ACCOUNTS.READ,
      CrmPermissions.CRM.ACCOUNTS.WRITE,
    ])
      ? {
          label: 'View',
          path: (rowData) => `${rowData.id}/view/about`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.ACCOUNTS.WRITE])
      ? {
          label: 'Edit',
          path: (rowData) => `${rowData.id}/edit`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.ACCOUNTS.SCHEDULE_DRIVE])
      ? {
          label: 'Schedule Drive',
          path: (rowData) =>
            OPERATIONS_CENTER_DRIVES_PATH.CREATE + '?accountId=' + rowData?.id,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.ACCOUNTS.ARCHIVE])
      ? {
          label: 'Archive',
          action: (rowData) => {
            setModalPopUp(true);
            setArchiveId(rowData.id);
          },
        }
      : null,
  ].filter(Boolean);

  const archiveAccount = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'DELETE',
        `${BASE_URL}/accounts/${archiveId}`
      );

      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        fetchAllAccounts(filterFormData);
        setModalPopUp(false);
        setShowArchiveSuccessModal(true);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={CRMAccountsBreadCrumbsData}
        BreadCrumbsTitle={'Accounts'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="mainContentInner">
        <AccountFilters
          setIsLoading={setIsLoading}
          fetchAllAccounts={fetchAllAccounts}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          setFilterFormData={setFilterFormData}
          filterFormData={filterFormData}
        />
        <div className="buttons d-flex align-items-center gap-3 ">
          <div className="dropdown-center cursor-pointer">
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
                  onClick={(e) => {
                    e.preventDefault();
                    setExportModal(true);
                    setDownloadType('PDF');
                  }}
                  className="dropdown-item"
                >
                  PDF
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    setExportModal(true);
                    setDownloadType('CSV');
                  }}
                >
                  CSV
                </Link>
              </li>
            </ul>
          </div>
          {CheckPermission([CrmPermissions.CRM.ACCOUNTS.WRITE]) && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('create')}
            >
              Create Account
            </button>
          )}
        </div>
        <TableList
          isLoading={isLoading}
          data={rows}
          hideActionTitle={true}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortBy}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
          setTableHeaders={setTableHeaders}
          allAddresses={allAddresses}
        />

        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
        <ArchivePopUpModal
          title={'Confirmation'}
          message={'Are you sure want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={modalPopUp}
          archived={archiveAccount}
          isNavigate={false}
        />
        {showArchiveSuccessModal === true ? (
          <SuccessPopUpModal
            title="Success!"
            message="Account is archived."
            modalPopUp={showArchiveSuccessModal}
            isNavigate={false}
            setModalPopUp={setShowArchiveSuccessModal}
            showActionBtns={true}
          />
        ) : null}
      </div>
      <section className={`popup full-section ${exportModal ? 'active' : ''}`}>
        <div className="popup-inner" style={{ maxWidth: '450px' }}>
          <div className="icon">
            <img
              src={downloadExportIcon}
              className="bg-white"
              alt="CancelIcon"
            />
          </div>
          <div className="content">
            <h3>Export Data</h3>
            <p>
              Select one of the following option to <br />
              download the {downloadType}.
            </p>
            <div className=" mt-3">
              <Form.Group
                controlId="kindOfStand"
                className="d-flex align-items-center gap-5"
              >
                <Form.Check
                  value="filtered"
                  type="radio"
                  aria-label="radio 1"
                  label="Filtered Results"
                  onChange={(e) => setExportType(e.target.value)}
                  checked={exportType === 'filtered'}
                  className="radioChecks"
                />
                <Form.Check
                  value="all"
                  type="radio"
                  aria-label="radio 2"
                  label="All Data"
                  onChange={(e) => setExportType(e.target.value)}
                  checked={exportType === 'all'}
                  className="radioChecks ms-5 "
                />
              </Form.Group>
            </div>
            <div className="buttons">
              <button
                className="btn btn-md btn-secondary"
                style={{ color: '#387de5', width: '45%' }}
                onClick={() => setExportModal(false)}
              >
                Cancel
              </button>
              {downloadType === 'PDF' && (
                <button
                  className="btn btn-primary"
                  style={{ width: '45%' }}
                  onClick={() => {
                    setIsLoading(true);
                    if (exportType === 'filtered') {
                      fetchAllAccounts(filterApplied);
                    } else {
                      const isFilterApplied = Object.values(filterApplied)
                        ? filterApplied
                        : {};
                      fetchAllAccounts(isFilterApplied);
                    }
                    setExportModal(false);
                  }}
                >
                  Download
                </button>
              )}

              {downloadType === 'CSV' && (
                <button
                  className="btn btn-primary"
                  style={{ width: '45%' }}
                  onClick={() => {
                    setIsLoading(true);
                    if (exportType === 'filtered') {
                      fetchAllAccounts(filterApplied);
                    } else {
                      const isFilterApplied = Object.values(filterApplied)
                        ? filterApplied
                        : {};
                      fetchAllAccounts(isFilterApplied);
                    }
                    setExportModal(false);
                  }}
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccountList;
