import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../common/topbar/index';
import Pagination from '../../../common/pagination/index';
import { toast } from 'react-toastify';
import TableList from '../../../donorsTableListing';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import NavTabs from '../../../common/navTabs';
// import { Tabs } from '../ContactTabs';
import ConfirmModal from '../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import CommunicationModal from '../../../common/CommunicationModal';
import SuccessPopUpModal from '../../../common/successModal';
import { dateFormat } from '../../../../helpers/formatDate';
import ContactDonorsFilters from './donorsFilters/donorsFilter';
import { Row, Col } from 'react-bootstrap';
import SvgComponent from '../../../common/SvgComponent';
import exportImage from '../../../../assets/images/exportImage.svg';
import { downloadFile } from '../../../../utils';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import { DonorBreadCrumbsData } from './DonorBreadCrumbsData';
import styles from './donor.module.scss';
import faFileLinesAlt from '../../../../assets/faFileLinesAlt.svg';

let inputTimer = null;

function AccountList() {
  const Tabs = [
    CheckPermission([
      CrmPermissions.CRM.CONTACTS.VOLUNTEERS.WRITE,
      CrmPermissions.CRM.CONTACTS.VOLUNTEERS.READ,
    ])
      ? {
          label: 'Volunteers',
          link: '/crm/contacts/volunteers',
        }
      : null,
    CheckPermission([
      CrmPermissions.CRM.CONTACTS.DONOR.WRITE,
      CrmPermissions.CRM.CONTACTS.DONOR.READ,
    ])
      ? {
          label: 'Donor',
          link: '/crm/contacts/donor',
        }
      : null,
    CheckPermission([
      CrmPermissions.CRM.CONTACTS.STAFF.WRITE,
      CrmPermissions.CRM.CONTACTS.STAFF.READ,
    ])
      ? {
          label: 'Staff',
          link: '/crm/contacts/staff',
        }
      : null,
  ];
  const location = useLocation();
  const currentLocation = location.pathname;
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('donor_id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [openCommunication, setOpenCommunication] = useState(false);
  // const [messageType, setMessageType] = useState('sms');
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const [showExportDialogue, setShowExportDialogue] = useState(false);
  const [exportType, setExportType] = useState('filtered');
  const [downloadType, setDownloadType] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState();
  const [filterApplied, setFilterApplied] = useState({});
  const [defaultMessageType, setDefaultMessageType] = useState('sms');
  const [refreshData, setRefreshData] = useState(false);
  const [communicationable_id, setCommunicationableId] = useState(null);

  const communicationable_type = 'donors';
  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'external_id',
      label: 'Donor ID',
      minWidth: '5rem',
      width: '5rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'name',
      label: 'Donor Name',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'address_city',
      label: 'City',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'address_state',
      label: 'State',
      minWidth: '10rem',
      width: '10rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'primary_phone',
      label: 'Primary Phone',
      minWidth: '12rem',
      width: '12rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'primary_email',
      label: 'Primary Email',
      minWidth: '14rem',
      width: '14rem',
      sortable: true,
      checked: false,
    },
    {
      name: 'blood_type',
      label: 'Blood Type',
      width: '5rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'last_donation',
      label: 'Last Donation',
      width: '10rem',
      sortable: true,
      checked: true,
    },
  ]);
  const token = localStorage.getItem('token');

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    // Adding debouncer just so we won't call api on every search click
    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setIsLoading(true);
      if (filterApplied) {
        fetchAllData(filterApplied);
      } else {
        fetchAllData({});
      }
    }, 500);
  }, [searchText, limit, currentPage, sortBy, sortOrder, refresh, refreshData]);
  function isFilterApplied(filters) {
    return Object.values(filters)?.every((x) => x === null || x === '');
  }
  const fetchAllData = async (filters) => {
    let isFiltersCheck = Object.keys(filters)?.length > 0;
    if (isFiltersCheck && isFilterApplied(filters)) {
      setFilterApplied({});
      setRows([]);
      return;
    }
    setFilterApplied(filters);
    try {
      const getStatusValue = (status) => {
        if (typeof status === 'string') {
          return status === 'active'
            ? true
            : status === 'inactive'
            ? false
            : '';
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
        if (typeof filter === 'object' && 'value' in filter) {
          return filter.value;
        } else if (Array.isArray(filter)) {
          return filter[0];
        } else {
          return filter;
        }
      };

      const filterProperties = [
        'city',
        'state',
        'country',
        'name',
        'blood_type',
        'last_donation',
      ];

      const queryParams = filterProperties
        .map((property) => {
          const filterValue = getFilterValue(filters[property]);
          return filterValue ? `${property}=${filterValue}` : '';
        })
        .filter((param) => param !== '')
        .join('&');

      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contact-donors?sortOrder=${sortOrder}&sortBy=${sortBy}&page=${currentPage}&limit=${limit}${
          searchText && searchText.length ? '&name=' + searchText : ''
        }&status=${getStatusValue(filters?.status)}&${queryParams}${
          exportType ? `&exportType=${exportType}` : ''
        }${downloadType ? `&downloadType=${downloadType}` : ''}
        ${exportType === 'all' ? `&fetchAll=${'true'}` : ''}
        ${
          selectedOptions && exportType === 'filtered'
            ? `&selectedOptions=${selectedOptions?.label}`
            : ''
        }
        &tableHeaders=${tableHeaders
          .filter((item) => item.checked === true)
          .map((item) => item.name)}`
      );
      const data = await response.json();
      data?.data?.forEach((item) => {
        item.last_donation = dateFormat(item.last_donation, 2);
      });
      setRows(data.data);
      setTotalRecords(data?.count);
      if (data?.url) {
        await downloadFile(data.url);
      }
      setDownloadType(null);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setIsLoading(false);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  const optionsConfig = [
    CheckPermission([
      CrmPermissions.CRM.CONTACTS.DONOR.WRITE,
      CrmPermissions.CRM.CONTACTS.DONOR.READ,
    ])
      ? {
          label: 'View',
          // path: (rowData) => `${rowData.id}`,
          path: (rowData) => `${rowData.id}/view`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.CONTACTS.DONOR.WRITE])
      ? {
          label: 'Edit',
          path: (rowData) => `${rowData.id}/edit`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.CONTACTS.DONOR.ARCHIVE])
      ? {
          label: 'Archive',
          action: (rowData) => {
            // setModalPopUp(true);
            handleArchive(rowData);
          },
        }
      : null,
    CheckPermission([CrmPermissions.CRM.CONTACTS.DONOR.SEND_EMAIL_OR_SMS])
      ? {
          label: 'Send Email/SMS',
          // path: (rowData) => `#`,
          action: (rowData) => {
            setCommunicationableId(rowData?.id);
            setOpenCommunication(true);
          },
        }
      : null,
  ];

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setItemToArchive(rowData);
    setRefresh(false);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const contactVolunteerID = itemToArchive.id;
        const response = await fetch(
          `${BASE_URL}/contact-donors/${contactVolunteerID}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { status } = await response.json();

        if (status === 204) {
          setArchiveModalPopUp(true);
          // toast.success(message, { autoClose: 3000 });
          setRefresh(true);
        } else {
          toast.error('Error Archiving Donor', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error archiving data:', error);
      }

      setShowConfirmation(false);
      setItemToArchive(null);
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  const handleCommunicationButtons = (confirmed) => {
    setOpenCommunication(confirmed);
  };

  const transformData = (data) => {
    return data?.map((item) => {
      let id = item.donor_id;

      return {
        ...item,
        id: id,
      };
    });
  };

  function MediaCard() {
    return (
      <div className={styles.donorFilterCard}>
        <img
          src={faFileLinesAlt}
          alt="faFileLinesAlt"
          className={styles.faFileLinesAlt}
        />

        <h2 className={styles.donorFilterHeader}>
          Apply Search or Filter to view Donor Records.{' '}
        </h2>
        <p className={styles.donorFilterPara}>
          Please apply search or filter(s) to view Donor <br /> Records.
        </p>
      </div>
    );
  }
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={DonorBreadCrumbsData}
        BreadCrumbsTitle={'Contacts'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="filterBar">
        <NavTabs tabs={Tabs} currentLocation={currentLocation} />
      </div>
      <div className="mainContentInner">
        <ContactDonorsFilters
          fetchAllFilters={fetchAllData}
          setIsLoading={setIsLoading}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />

        <div className="button-icon">
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
                    setShowExportDialogue(true);
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
                    setShowExportDialogue(true);
                    setDownloadType('CSV');
                  }}
                >
                  CSV
                </Link>
              </li>
            </ul>
          </div>
          {CheckPermission([CrmPermissions.CRM.CONTACTS.DONOR.WRITE]) && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('create')}
            >
              Create Donor
            </button>
          )}
        </div>
        {searchText || Object.keys(filterApplied)?.length > 0 ? (
          <>
            <TableList
              isLoading={isLoading}
              data={transformData(rows)}
              hideActionTitle={true}
              headers={tableHeaders}
              handleSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              optionsConfig={optionsConfig}
              setTableHeaders={setTableHeaders}
            />
            <Pagination
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalRecords={totalRecords}
            />
          </>
        ) : (
          MediaCard()
        )}
        <ConfirmModal
          showConfirmation={showConfirmation}
          onCancel={cancelArchive}
          onConfirm={confirmArchive}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to archive?'}
        />
        <CommunicationModal
          openModal={openCommunication}
          setOpenModal={setOpenCommunication}
          defaultMessageType={defaultMessageType}
          setDefaultMessageType={setDefaultMessageType}
          communicationable_id={communicationable_id}
          communicationable_type={communicationable_type}
          handleModalButtons={handleCommunicationButtons}
          refreshData={refreshData} // Pass the state as a prop
          setRefreshData={setRefreshData}
        />
        <section
          className={`popup full-section ${showExportDialogue ? 'active' : ''}`}
        >
          <div
            className="popup-inner"
            style={{ maxWidth: '475px', width: '475px' }}
          >
            <div className="icon">
              <img src={exportImage} className="bg-white" alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Export Data</h3>
              <p>
                Select one of the following option to download the{' '}
                {downloadType}
              </p>
              <Row>
                <Col>
                  <div className="form-field checkbox cc">
                    <input
                      type="radio"
                      name="exportType"
                      checked={exportType === 'filtered'}
                      value={'filtered'}
                      onChange={(e) => {
                        setExportType(e.target.value);
                      }}
                    />
                    <label
                      className="form-check-label"
                      style={{ marginLeft: '4px' }}
                    >
                      <span className="radio">Filtered Results</span>
                    </label>
                  </div>
                </Col>
                <Col>
                  <div className="form-field checkbox cc">
                    <input
                      type="radio"
                      name="exportType"
                      checked={exportType === 'all'}
                      value={'all'}
                      onChange={(e) => {
                        setExportType(e.target.value);
                      }}
                    />
                    <label
                      className="form-check-label"
                      style={{ marginLeft: '4px' }}
                    >
                      <span className="radio">All Data</span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  style={{ width: '45%', color: '#387de5' }}
                  onClick={() => setShowExportDialogue(false)}
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
                        fetchAllData(filterApplied);
                      } else {
                        const isFilterApplied = Object.values(filterApplied)
                          ? filterApplied
                          : {};
                        fetchAllData(isFilterApplied);
                      }
                      setShowExportDialogue(false);
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
                        console.log('filterApplied', filterApplied);
                        fetchAllData(filterApplied);
                      } else {
                        const isFilterApplied = Object.values(filterApplied)
                          ? filterApplied
                          : {};
                        console.log(isFilterApplied, 'isFilterApplied');
                        fetchAllData(isFilterApplied);
                      }
                      setShowExportDialogue(false);
                    }}
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
        <SuccessPopUpModal
          title={'Success!'}
          message={'Donor is archived.'}
          modalPopUp={archiveModalPopUp}
          setModalPopUp={setArchiveModalPopUp}
          onConfirm={() => {
            setArchiveModalPopUp(false);
          }}
          showActionBtns={true}
        />
      </div>
    </div>
  );
}

export default AccountList;
