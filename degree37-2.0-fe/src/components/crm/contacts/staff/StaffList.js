import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../common/topbar/index';
import Pagination from '../../../common/pagination/index';
import { toast } from 'react-toastify';
import TableList from '../../../staffTableListing';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import NavTabs from '../../../common/navTabs';
// import { Tabs } from '../ContactTabs';
import ConfirmModal from '../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import SuccessPopUpModal from '../../../common/successModal';
import ContactStaffFilters from './staffFilters/staffFilter';
import exportImage from '../../../../assets/images/exportImage.svg';
import { Row, Col } from 'react-bootstrap';
import SvgComponent from '../../../common/SvgComponent';
import { downloadFile } from '../../../../utils';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import { StaffBreadCrumbsData } from './StaffBreadCrumbsData';
import CommunicationModal from '../../../common/CommunicationModal';

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
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('staff_id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rows, setRows] = useState([]);
  const [showExportDialogue, setShowExportDialogue] = useState(false);
  const [exportType, setExportType] = useState('filtered');
  const [downloadType, setDownloadType] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterApplied, setFilterApplied] = useState({});
  const [selectedOptions, setSelectedOptions] = useState();
  const [openCommunication, setOpenCommunication] = useState(false);
  const [defaultMessageType, setDefaultMessageType] = useState('sms');
  const [communicationable_id, setCommunicationableId] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  const communicationable_type = 'staff';

  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'name',
      label: 'Name',
      minWidth: '15rem',
      width: '15rem',
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
      minWidth: '12rem',
      width: '12rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'roles',
      label: 'Roles',
      minWidth: '10rem',
      width: '10rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'collection_operation_name',
      label: 'Collection Operation',
      width: '12rem',
      sortable: true,
      checked: true,
      splitlabel: true,
    },
    {
      name: 'teams',
      label: 'Team',
      width: '120px',
      sortable: true,
      checked: true,
    },
    {
      name: 'classification_name',
      label: 'Classification',
      width: '100px',
      sortable: true,
      checked: true,
    },
    {
      name: 'status',
      label: 'Status',
      width: '120px',
      sortable: true,
      checked: true,
    },
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setIsLoading(true);
      fetchAllData({});
    }, 500);
  }, [searchText, limit, currentPage, sortBy, sortOrder, refresh, refreshData]);

  const fetchAllData = async (filters) => {
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
          return true;
        }
      };
      const getFilterValue = (filter, propertyName) => {
        if (typeof filter === 'object' && 'value' in filter) {
          return propertyName + '=' + filter.value;
        } else if (
          Array.isArray(filter) &&
          propertyName !== 'collection_operation_id'
        ) {
          if (typeof filter[0] === 'object' && 'id' in filter[0]) {
            return filter.map((e) => propertyName + '=' + e.id).join('&');
          } else {
            return filter.map((id) => propertyName + '=' + id).join('&');
          }
        } else if (
          Array.isArray(filter) &&
          propertyName === 'collection_operation_id'
        ) {
          if (filter.length >= 1) {
            return (
              propertyName +
              '=' +
              filter.map((item) => (item?.id ? item.id : item)).join(',')
            );
          }
        } else {
          return propertyName + '=' + (filter ?? '');
        }
      };
      const filterProperties = [
        'city',
        'state',
        'role_ids',
        'collection_operation_id',
        'team_ids',
        'email',
        'phone',
      ];
      const queryParams = filterProperties
        .map((property) => {
          const filterValue = getFilterValue(filters[property], property);
          return filterValue ? filterValue : '';
        })
        .filter(
          (param) =>
            param !== '' && !(param.startsWith('email=') && param === 'email=')
        )
        .join('&');

      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contact-staff/filtered?sortOrder=${sortOrder}&sortBy=${sortBy}&page=${currentPage}&limit=${limit}${
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
      CrmPermissions.CRM.CONTACTS.STAFF.WRITE,
      CrmPermissions.CRM.CONTACTS.STAFF.READ,
    ])
      ? {
          label: 'View',
          path: (rowData) => `${rowData.id}/view`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.CONTACTS.STAFF.WRITE])
      ? {
          label: 'Edit',
          path: (rowData) => `${rowData.id}/edit`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.CONTACTS.STAFF.ARCHIVE])
      ? {
          label: 'Archive',
          action: (rowData) => {
            // setModalPopUp(true);
            handleArchive(rowData);
          },
        }
      : null,
    CheckPermission([CrmPermissions.CRM.CONTACTS.STAFF.SEND_EMAIL_OR_SMS])
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

  const transformData = (data) => {
    return data?.map((item) => {
      let id = item.staff_id;
      return {
        ...item,
        id: id,
      };
    });
  };

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
          `${BASE_URL}/contact-staff/${contactVolunteerID}`,
          {
            method: 'PATCH',
          }
        );
        const { status } = await response.json();

        if (status === 204) {
          setArchiveModalPopUp(true);
          // toast.success(message, { autoClose: 3000 });
          setRefresh(true);
        } else {
          toast.error('Error Archiving Staff', { autoClose: 3000 });
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

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={StaffBreadCrumbsData}
        BreadCrumbsTitle={'Contacts'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="filterBar">
        <NavTabs tabs={Tabs} currentLocation={currentLocation} />
      </div>
      <div className="mainContentInner">
        <ContactStaffFilters
          fetchAllFilters={fetchAllData}
          setIsLoading={setIsLoading}
          setSelectedOptions={setSelectedOptions}
          selectedOptions={selectedOptions}
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
          {CheckPermission([CrmPermissions.CRM.CONTACTS.STAFF.WRITE]) && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('create')}
            >
              Create Staff
            </button>
          )}
        </div>
        <TableList
          isLoading={isLoading}
          data={transformData(rows)}
          hideActionTitle={true}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortBy}
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
        <SuccessPopUpModal
          title={'Success!'}
          message={'Staff is archieved.'}
          modalPopUp={archiveModalPopUp}
          setModalPopUp={setArchiveModalPopUp}
          onConfirm={() => {
            setArchiveModalPopUp(false);
          }}
          showActionBtns={true}
        />
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AccountList;
