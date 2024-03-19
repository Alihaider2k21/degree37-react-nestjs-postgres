import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import { useNavigate } from 'react-router';
import { API } from '../../../../api/api-routes.js';
import { toast } from 'react-toastify';
import SvgComponent from '../../../common/SvgComponent';
import exportImage from '../../../../assets/images/exportImage.svg';
import styles from './index.module.scss';
import { Col, Row } from 'react-bootstrap';
import ProfileTableListing from './ProfileTableListing';
import Pagination from '../../../common/pagination';
import SuccessPopUpModal from '../../../common/successModal';
import { Link } from 'react-router-dom';
import JsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import { formatUser } from '../../../../helpers/formatUser';
import SelectDropdown from '../../../common/selectDropdown';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import { NonCollectionProfilesBreadCrumbsData } from '../NonCollectionProfilesBreadCrumbsData';
import OrganizationalDropdown from '../../../common/Organization/DropDown.jsx';
import OrganizationalPopup from '../../../common/Organization/Popup.jsx';
import GlobalMultiSelect from '../../../common/GlobalMultiSelect/index.jsx';

const ProfileList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showExportDialogue, setShowExportDialogue] = useState(false);
  const [exportType, setExportType] = useState('filtered');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [getData, setGetData] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveID, setArchiveID] = useState('');
  const [profileListData, setProfileListData] = useState([]);
  const [statusText, setStatusText] = useState({
    label: 'Active',
    value: true,
  });
  const [isActive, setIsActive] = useState(true);
  const [downloadType, setDownloadType] = useState('PDF');
  const [csvData, setCsvData] = useState([]);
  const [csvPDFData, setCsvPDFData] = useState([
    'Profile Name,Event Category,Event Subcategory,Collection Operation,Owner,status',
  ]);
  const [organizationalLevel, setOrganizationalLevel] = useState('');
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [eventCategoryData, setEventCategoryData] = useState('');
  const [eventCategoryDataText, setEventCategoryDataText] = useState(null);
  const [eventCategoryOption, setEventCategoryOption] = useState([]);
  const [eventSubCategoryData, setEventSubCategoryData] = useState('');
  const [eventSubCategoryDataText, setEventSubCategoryDataText] =
    useState(null);
  const [eventSubCategoryOption, setEventSubCategoryOption] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isPopupVisible, setPopupVisible] = React.useState();
  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'profile_name',
      label: 'Profile Name',
      width: '15%',
      sortable: true,
      checked: true,
    },
    {
      name: 'alternate_name',
      label: 'Alternate Name',
      width: '13%',
      sortable: true,
      checked: false,
    },
    {
      name: 'event_category_id',
      label: 'Event Category',
      width: '13%',
      sortable: true,
      checked: true,
    },
    {
      name: 'event_subcategory_id',
      label: 'Event Subcategory',
      width: '13%',
      sortable: true,
      checked: true,
    },
    {
      name: 'collection_operation_id',
      label: 'Collection Operation',
      width: '13%',
      sortable: true,
      checked: true,
    },
    {
      name: 'owner_id',
      label: 'Owner',
      width: '10%',
      sortable: true,
      icon: false,
      checked: true,
    },
    {
      name: 'is_active',
      label: 'Status',
      width: '10%',
      sortable: true,
      checked: true,
    },
  ]);

  const headers = [
    {
      key: 'profile_name',
      label: 'Profile Name',
    },
    {
      key: 'event_category_id',
      label: 'Event Category',
    },
    {
      key: 'event_subcategory_id',
      label: 'Event Subcategory',
    },
    {
      key: 'collection_operation_id',
      label: 'Collection Operation',
    },
    {
      key: 'owner_id',
      label: 'Owner',
    },
    { key: 'is_active', label: 'Status' },
  ];

  const handleIsActive = (value) => {
    if (value !== null) {
      setIsActive(value?.value);
      setStatusText(value);
    } else {
      setIsActive('');
      setStatusText(value);
    }
  };

  const handleCollectionOperation = (data) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === data.id)
        ? prevSelected.filter((item) => item.id !== data.id)
        : [...prevSelected, data]
    );
  };

  const handleEventCategory = (value) => {
    if (value !== null) {
      setEventCategoryData(value?.value);
      setEventCategoryDataText(value);
      if (eventCategoryData) {
        if (eventCategoryData !== +value?.value) {
          setEventSubCategoryData(null);
          setEventSubCategoryDataText(null);
        }
      } else {
        const subCategoryId = eventSubCategoryOption.find(
          (item) => +item?.id === +eventSubCategoryData
        );
        if (subCategoryId && +value?.value !== +subCategoryId?.parent_id?.id) {
          setEventSubCategoryData(null);
          setEventSubCategoryDataText(null);
        }
      }
    } else {
      setEventCategoryData('');
      setEventSubCategoryData(null);
      setEventSubCategoryDataText(null);
      setEventCategoryDataText(value);
      setEventSubCategoryOption([]);
    }
  };

  const handleEventSubCategory = (value) => {
    if (value !== null) {
      setEventSubCategoryData(value?.value);
      setEventSubCategoryDataText(value);
    } else {
      setEventSubCategoryData('');
      setEventSubCategoryDataText(value);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    setCsvData([]);
    setCsvPDFData([
      'Profile Name,Event Category,Event Subcategory,Collection Operation,Owner,status',
    ]);
    const allPdf = async () => {
      setIsFetching(true);
      const { data } = await API.nonCollectionProfiles.getAll.get(accessToken);
      data?.data?.map((item) => {
        item.collection_operation_id = item.collection_operation_id
          .map((co) => co.name)
          .join('; ');
        setCsvPDFData((prev) => [
          ...prev,
          `${item?.profile_name},${item?.event_category_id?.name},${
            item?.event_subcategory_id?.name ?? ''
          },${item?.collection_operation_id},${formatUser(item?.owner_id, 1)},${
            item?.is_active ? 'Active' : 'Inactive'
          }`,
        ]);
        return item;
      });
      setIsFetching(false);
    };
    const allCsv = async () => {
      setIsFetching(true);
      const { data } = await API.nonCollectionProfiles.getAll.get(accessToken);
      data?.data?.map((item) => {
        item.collection_operation_id = item.collection_operation_id
          .map((co) => co.name)
          .join(', ');
        setCsvData((prev) => [
          ...prev,
          {
            profile_name: item?.profile_name,
            event_category_id: item?.event_category_id?.name,
            event_subcategory_id: item?.event_subcategory_id?.name ?? '',
            collection_operation_id: item?.collection_operation_id,
            owner_id: formatUser(item?.owner_id, 1),
            is_active: item?.is_active ? 'Active' : 'Inactive',
          },
        ]);
        return item;
      });
      setIsFetching(false);
    };
    if (exportType === 'all' && downloadType === 'PDF') {
      allPdf();
    }
    if (exportType === 'all' && downloadType === 'CSV') {
      allCsv();
    }
    if (exportType === 'filtered' && downloadType === 'PDF') {
      profileListData?.map((item) => {
        setCsvPDFData((prev) => [
          ...prev,
          `${item?.profile_name},${item?.event_category_id?.name},${
            item?.event_subcategory_id?.name ?? ''
          },${item.collection_operation_id
            .map((co) => co.name)
            .join('; ')},${formatUser(item?.owner_id, 1)},${
            item?.is_active ? 'Active' : 'Inactive'
          }`,
        ]);
        return item;
      });
    }
    if (exportType === 'filtered' && downloadType === 'CSV') {
      profileListData?.map((item) => {
        setCsvData((prev) => [
          ...prev,
          {
            profile_name: item?.profile_name,
            event_category_id: item?.event_category_id?.name,
            event_subcategory_id: item?.event_subcategory_id?.name ?? '',
            collection_operation_id: item.collection_operation_id
              .map((co) => co.name)
              .join(', '),
            owner_id: formatUser(item?.owner_id, 1),
            is_active: item?.is_active ? 'Active' : 'Inactive',
          },
        ]);
        return item;
      });
    }
  }, [profileListData, exportType, downloadType]);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getData = async () => {
      setIsLoading(true);
      try {
        let collectionOperationValues = '';
        if (collectionOperation?.length > 0)
          collectionOperationValues = collectionOperation
            ?.map((op) => op?.id)
            .join(',');
        const { data } = await API.nonCollectionProfiles.list.getAll(
          accessToken,
          limit,
          currentPage,
          sortBy,
          sortOrder,
          organizationalLevel,
          collectionOperationValues,
          eventCategoryData,
          eventSubCategoryData,
          searchText,
          isActive
        );

        setProfileListData(data?.data);
        setTotalRecords(data?.count);
      } catch (e) {
        toast.error(`${e?.message}`, { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText) {
      getData(limit, currentPage);
    }

    if (searchText.length > 1) {
      getData(searchText);
    }

    if (searchText.length === 1) {
      setCurrentPage(1);
    }
    return () => {
      setGetData(false);
    };
  }, [
    currentPage,
    limit,
    organizationalLevel,
    collectionOperation,
    eventCategoryData,
    eventSubCategoryData,
    searchText,
    getData,
    isActive,
    sortBy,
    sortOrder,
  ]);

  const accessToken = localStorage.getItem('token');
  const getCollectionOperations = async () => {
    try {
      const { data } =
        await API.nonCollectionProfiles.collectionOperation.getAll(accessToken);
      let collections = data?.data?.map((collection) => ({
        name: collection?.name,
        id: collection?.id,
      }));
      setCollectionOperationData(collections);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const getEventCategory = async () => {
    try {
      const { data } =
        await API.nonCollectionProfiles.eventCategory.getAll(accessToken);
      const categories = data?.data
        ?.filter((item) => item?.is_active === true)
        .map((category) => ({
          label: category?.name,
          value: category?.id,
        }));
      setEventCategoryOption(categories);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const getEventSubCategory = async (paramId) => {
    try {
      const { data } = await API.nonCollectionProfiles.eventSubCategory.getAll(
        accessToken,
        paramId
      );
      setEventSubCategoryOption(data?.data);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    if (eventCategoryData) {
      getEventSubCategory(eventCategoryData);
    }
  }, [eventCategoryData]);

  useEffect(() => {
    getEventCategory();
    getCollectionOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionsConfig = [
    CheckPermission([
      CrmPermissions.CRM.NON_COLLECTION_PROFILES.READ,
      CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE,
    ])
      ? {
          label: 'View',
          path: (rowData) => `${rowData.id}/about`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE])
      ? {
          label: 'Edit',
          path: (rowData) => `${rowData.id}/edit`,
          action: (rowData) => {},
        }
      : null,
    CheckPermission([CrmPermissions.CRM.NON_COLLECTION_PROFILES.ARCHIVE])
      ? {
          label: 'Archive',
          action: (rowData) => {
            setModalPopUp(true);
            setArchiveID(rowData.id);
          },
        }
      : null,
  ];

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

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleArchive = async () => {
    if (archiveID) {
      const accessToken = localStorage.getItem('token');
      const { data } = await API.nonCollectionProfiles.archive.patch(
        accessToken,
        archiveID
      );
      if (data.status === 'success') {
        setShowSuccessMessage(true);
        setGetData(true);
      }
      setModalPopUp(false);
    }
  };

  const generatePDF = async () => {
    // Initialize jsPDF
    const doc = new JsPDF('landscape');
    const tableData = csvPDFData.map((row) => row.split(','));
    for (let i = 0; i < tableData.length; i++) {
      // Iterate through columns in each row
      for (let j = 0; j < tableData[i].length; j++) {
        // Check if the element is a string
        if (typeof tableData[i][j] === 'string') {
          // Replace ';' with ','
          tableData[i][j] = tableData[i][j].replace(/;/g, ',');
        }
      }
    }
    // Add content to the PDF
    await doc.text('Non-Collection Profiles', 10, 10);

    // Calculate the maximum column width for each column
    const columnWidths = tableData.reduce((acc, row) => {
      row.forEach(async (cell, columnIndex) => {
        acc[columnIndex] = Math.max(
          acc[columnIndex] || 0,
          (await doc.getStringUnitWidth(cell)) + 10
        );
      });
      return acc;
    }, []);

    // Calculate the total width required for the table
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);

    // Calculate scaling factor based on the page width
    const pageWidth = doc.internal.pageSize.width - 30; // Adjust for margin
    const scaleFactor = pageWidth / totalWidth;

    // Scale the column widths
    const scaledWidths = columnWidths.map((width) => width * scaleFactor);

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      headStyles: {
        fillColor: [100, 100, 100],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
      },
      columnStyles: scaledWidths.map((width) => ({ columnWidth: width })),
      startY: 20,
    });

    // Save the PDF
    setTimeout(() => doc.save('profiles-info.pdf'), 100);

    setShowExportDialogue(false);
  };

  const handleDownloadClick = () => {
    setShowExportDialogue(false);
  };

  const handleOrganizationalLevel = (payload) => {
    setPopupVisible(false);
    setOrganizationalLevel(
      typeof payload === 'string' ? payload : JSON.stringify(payload)
    );
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={NonCollectionProfilesBreadCrumbsData}
        BreadCrumbsTitle={'Non-Collection Profiles'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex justify-content-end flex-wrap">
              <div className="dropdown mt-2 mb-2">
                <OrganizationalDropdown
                  value={organizationalLevel}
                  handleClick={() => setPopupVisible(true)}
                  handleClear={() => handleOrganizationalLevel('')}
                />
              </div>
              <div className="dropdown mt-2 mb-2">
                <SelectDropdown
                  label="Event Category"
                  options={eventCategoryOption}
                  selectedValue={eventCategoryDataText}
                  onChange={(val) => {
                    handleEventCategory(val);
                  }}
                  removeDivider
                  showLabel
                  placeholder="Event Category"
                />
              </div>
              <div className="dropdown mt-2 mb-2">
                <SelectDropdown
                  label="Event Subcategory"
                  options={eventSubCategoryOption?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  disabled={eventSubCategoryOption?.length ? false : true}
                  selectedValue={eventSubCategoryDataText}
                  onChange={(val) => {
                    handleEventSubCategory(val);
                  }}
                  removeDivider
                  showLabel
                  placeholder="Event Subcategory"
                />
              </div>
              <div className="dropdown mt-2 mb-2">
                <GlobalMultiSelect
                  label="Collection Operation"
                  data={collectionOperationData}
                  selectedOptions={collectionOperation}
                  onChange={(data) => handleCollectionOperation(data)}
                  onSelectAll={(data) => setCollectionOperation(data)}
                />
              </div>
              <div className="dropdown mt-2 mb-2">
                <SelectDropdown
                  label="Status"
                  options={[
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                  ]}
                  selectedValue={statusText}
                  onChange={(val) => {
                    handleIsActive(val);
                  }}
                  removeDivider
                  showLabel
                  placeholder="Status"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <div className="button-icon">
          <div className="dropdown-center">
            <div
              className={`optionsIcon ${styles.pointer}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <SvgComponent name={'DownloadIcon'} /> Export Data
            </div>
            <ul className="dropdown-menu">
              <li>
                <Link
                  onClick={() => {
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
          <div className="buttons">
            {CheckPermission([
              CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE,
            ]) && (
              <button
                style={{
                  minHeight: '0px',
                  padding: '12px 32px 12px 32px',
                }}
                className="btn btn-primary"
                onClick={() => navigate('/crm/non-collection-profiles/create')}
              >
                Create Profile
              </button>
            )}
          </div>
        </div>
        <ProfileTableListing
          isLoading={isLoading}
          data={profileListData}
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
      </div>
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure want to Archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={handleArchive}
      />
      <SuccessPopUpModal
        title="Success"
        message={'Non-Collection profile is archived.'}
        modalPopUp={showSuccessMessage}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />

      <OrganizationalPopup
        value={organizationalLevel}
        showConfirmation={isPopupVisible}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleOrganizationalLevel}
        heading={'Organization Level'}
        showRecruiters
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
              Select one of the following option to download the {downloadType}
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
                    <span className={styles.radio}>Filtered Results</span>
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
                    <span className={styles.radio}>All Data</span>
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
                  onClick={generatePDF}
                  disabled={isFetching}
                >
                  Download
                </button>
              )}

              {downloadType === 'CSV' && (
                <CSVLink
                  className="btn btn-primary"
                  style={{ width: '45%' }}
                  filename={'profile_info.csv'}
                  data={csvData}
                  headers={headers}
                  onClick={handleDownloadClick}
                  disabled={isFetching}
                >
                  Download
                </CSVLink>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileList;
