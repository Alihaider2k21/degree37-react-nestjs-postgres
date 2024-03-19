import React, { useEffect, useState } from 'react';
import { OPERATIONS_CENTER_NCE } from '../../../../routes/path';
// import { Link, useParams, useNavigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import TableList from './TableListing/index';
import SuccessPopUpModal from '../../../common/successModal';
import Pagination from '../../../common/pagination';
import { API } from '../../../../api/api-routes.js';
import { toast } from 'react-toastify';
import JsPDF from 'jspdf';
import exportImage from '../../../../assets/images/exportImage.svg';
import { CSVLink } from 'react-csv';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { formatUser } from '../../../../helpers/formatUser';
import moment from 'moment';
import TopBar from '../../../common/topbar/index';
import NceFilters from './NCEFilters';
import SvgComponent from '../../../common/SvgComponent';
import { Col, Row } from 'react-bootstrap';
import CheckPermission from '../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../enums/OcPermissionsEnum.js';

const NceEventList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [, setShowModalText] = useState(null);
  const [getData, setGetData] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('id');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveID, setArchiveID] = useState('');
  const [showExportDialogue, setShowExportDialogue] = useState(false);
  const [exportType, setExportType] = useState('filtered');
  const [filterApplied, setFilterApplied] = useState({});
  const [selectedOptions, setSelectedOptions] = useState();
  const [rows, setRows] = useState([]);
  const [downloadType, setDownloadType] = useState('PDF');
  const [csvData, setCsvData] = useState([]);
  const [csvPDFData, setCsvPDFData] = useState([
    'Date,Event Name,Location,Total Staff,Hours,Owner,Collection Operation,Status',
  ]);
  const [, setCollectionOperationOption] = useState([]);
  const [eventCategoryData] = useState('');
  const [, setEventCategoryOption] = useState([]);
  const [, setEventSubCategoryOption] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

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

  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '#' },
    {
      label: 'Operations',
      class: 'active-label',
      link: '#',
    },
    {
      label: 'Non-Collection Events',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE.LIST,
    },
  ];

  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'date',
      label: 'Date',
      sortable: true,
      checked: true,
    },
    {
      name: 'event_name',
      label: 'Event Name',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'location_id',
      label: 'Location',
      sortable: true,
      checked: true,
    },
    {
      name: 'total_staff',
      label: 'Total Staff',
      sortable: true,
      icon: false,
      checked: true,
    },
    {
      name: 'event_hours',
      label: 'Hours',
      sortable: false,
      icon: false,
      checked: true,
    },
    {
      name: 'owner',
      label: 'Owner',
      width: '15%',
      sortable: true,
      icon: false,
      checked: false,
    },
    {
      name: 'start_time',
      label: 'Start Time',
      sortable: false,
      icon: false,
      checked: false,
    },
    {
      name: 'end_time',
      label: 'End Time',
      sortable: false,
      icon: false,
      checked: false,
    },
    {
      name: 'collection_operation',
      label: 'Collection Operations',
      sortable: true,
      icon: false,
      checked: true,
    },
    { name: 'status_id', label: 'Status', checked: true, sortable: true },
  ]);

  const optionsConfig = [
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.READ,
    ]) && {
      label: 'View',
      path: (rowData) => OPERATIONS_CENTER_NCE.VIEW.replace(':id', rowData?.id),
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => OPERATIONS_CENTER_NCE.EDIT.replace(':id', rowData.id),
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.COPY_NCE,
    ]) && {
      label: 'Copy NCE',
      path: (rowData) => OPERATIONS_CENTER_NCE?.CREATE,
      state: (rowData) => rowData?.id,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => {
        setArchiveID(rowData?.id);
        setShowModalText('Are you sure you want to archive?');
        setModalPopUp(true);
      },
    },
  ].filter(Boolean);

  const headers = [
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'event_name',
      label: 'Event Name',
    },
    {
      key: 'location_id',
      label: 'Location',
    },
    {
      key: 'total_staff',
      label: 'Total Staff',
    },
    {
      key: 'event_hours',
      label: 'Hours',
    },
    {
      key: 'owner_id',
      label: 'Owner',
    },
    {
      key: 'collection_operation_id',
      label: 'Collection Opertation',
    },
    { key: 'is_active', label: 'Status' },
  ];

  useEffect(() => {
    if (!searchText) {
      fetchAllStages(filterApplied);
    }
    if (searchText.length && searchText.length > 1) {
      fetchAllStages(filterApplied);
    }
  }, [searchText, limit, currentPage, sortBy, sortOrder, getData]);

  const fetchAllStages = async (filters) => {
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
        'date',
        'organizational_levels',
        'filter_id',
        'location_id',
        'event_category_id',
        'event_subcategory_id',
        'status_id',
      ];
      const queryParams = filterProperties
        .map((property) => {
          const filterValue = getFilterValue(filters[property]);
          return filterValue
            ? `${property}=${
                property === 'date'
                  ? moment(filterValue).format('YYYY-MM-DD')
                  : filterValue
              }`
            : '';
        })
        .filter((param) => param !== '')
        .join('&');
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/operations/non-collection-events?page=${
          searchText?.length > 1 ? 1 : currentPage
        }&limit=${limit}${
          sortBy
            ? `&sortBy=${
                sortBy === 'collection_operation'
                  ? 'collection_operation_id'
                  : sortBy === 'owner'
                  ? 'owner_id'
                  : sortBy
              }`
            : ''
        }${sortOrder ? `&sortOrder=${sortOrder}` : ''}${
          searchText?.length >= 2 ? `&keyword=${searchText}` : ''
        }&status=${getStatusValue(filters?.status)}&${queryParams}
        ${exportType ? `&exportType=${exportType}` : ''}${
          downloadType ? `&downloadType=${downloadType}` : ''
        }${exportType === 'all' ? `&fetchAll=${'true'}` : ''}
        ${
          selectedOptions && exportType === 'filtered'
            ? `&selectedOptions=${selectedOptions?.label}`
            : ''
        }&tableHeaders=${JSON.stringify(
          tableHeaders?.map((item) => item?.name)
        )}`
      );
      const data = await response.json();
      if (data) {
        const modifiedData = data?.data?.map((item) => ({
          id: item?.id,
          date: moment(item?.date).format('ddd, MMM D, YYYY'),
          location_id: item?.location_id?.name,
          total_staff: item?.total_staff,
          event_hours: item?.min_start_time
            ? `${moment(item?.min_start_time, 'hh:mm A')
                .utc(item?.min_start_time)
                .local()
                .format('hh:mm A')} - ${moment(item?.max_end_time, 'hh:mm A')
                .utc(item?.max_end_time)
                .local()
                .format('hh:mm A')}`
            : '',
          event_name: item?.event_name,
          event_category_id: item?.event_category_id?.name,
          event_subcategory_id: item?.event_subcategory_id?.name ?? '',
          collection_operation_id: item?.collection_operation_id?.name,
          owner_id: formatUser(item?.owner_id, 1),
          status_id: item?.status_id?.name,
          className: item?.status_id?.chip_color,
        }));
        setDownloadType(null);
        if (data?.url) {
          const urlParts = data?.url.split('/');
          const filenameWithExtension = urlParts[urlParts.length - 1];
          const [filename, fileExtension] = filenameWithExtension.split('.');
          const response = await fetch(data?.url);
          const blob = await response.blob();
          const filenameToUse = `${filename}.${fileExtension}`;
          const a = document.createElement('a');
          a.style.display = 'none';
          document.body.appendChild(a);
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filenameToUse;
          a.click();
          window.URL.revokeObjectURL(url);
        }
        setRows(modifiedData);
        setTotalRecords(data?.count);
        setGetData(false);
      }
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setIsLoading(false);
  };

  const generatePDF = async () => {
    // Initialize jsPDF
    const doc = new JsPDF();
    const tableData = csvPDFData.map((row) => row.split(','));
    // Add content to the PDF
    await doc.text('CSV to PDF Conversion', 10, 10);

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

  useEffect(() => {
    setCsvData([]);
    setCsvPDFData([
      'Date,Event Name,Location,Total Staff,Hours,Owner,Collection Operation,Status',
    ]);
    const allPdf = async () => {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/operations/non-collection-events?exportType=all`
      );
      const data = await response.json();
      data?.data?.map((item) => {
        setCsvPDFData((prev) => [
          ...prev,
          `${moment(item?.date).format('YYYY-MM-DD')},${item?.event_name},${
            item?.location_id?.name
          },${item?.total_staff},${moment(item?.min_start_time, 'hh:mm A')
            .utc(item?.min_start_time)
            .local()
            .format('hh:mm A')} - ${moment(item?.max_end_time, 'hh:mm A')
            .utc(item?.max_end_time)
            .local()
            .format('hh:mm A')},${formatUser(item?.owner_id, 1)},${
            item?.collection_operation_id?.name
          },${item?.status_id?.name}`,
        ]);
        return item;
      });
    };
    const allCsv = async () => {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/operations/non-collection-events?exportType=all`
      );
      const data = await response.json();
      if (data?.status === 200) {
        data?.data?.map((item) => {
          setCsvData((prev) => [
            ...prev,
            {
              date: moment(item?.date).format('YYYY-MM-DD'),
              event_name: item?.event_name,
              location_id: item?.location_id?.name,
              total_staff: item?.total_staff,
              event_hours: `${moment(item?.min_start_time, 'hh:mm A')
                .utc(item?.min_start_time)
                .local()
                .format('hh:mm A')} - ${moment(item?.max_end_time, 'hh:mm A')
                .utc(item?.max_end_time)
                .local()
                .format('hh:mm A')}`,
              collection_operation_id: item?.collection_operation_id?.name,
              owner_id: formatUser(item?.owner_id, 1),
              is_active: item?.status_id?.name,
            },
          ]);
          return item;
        });
      }
    };
    if (exportType === 'all' && downloadType === 'PDF') {
      allPdf();
    }
    if (exportType === 'all' && downloadType === 'CSV') {
      allCsv();
    }
    if (exportType === 'filtered' && downloadType === 'PDF') {
      rows?.map((item) => {
        setCsvPDFData((prev) => [
          ...prev,
          `${item?.date},${item?.event_name},${item?.location_id},${item?.total_staff},${item?.event_hours},${item?.owner_id},${item?.collection_operation_id},${item?.status_id}`,
        ]);
        return item;
      });
    }
    if (exportType === 'filtered' && downloadType === 'CSV') {
      rows?.map((item) => {
        setCsvData((prev) => [
          ...prev,
          {
            date: item?.date,
            event_name: item?.event_name,
            location_id: item?.location_id,
            total_staff: item?.total_staff,
            event_hours: item?.event_hours,
            collection_operation_id: item?.collection_operation_id,
            owner_id: item?.owner_id,
            is_active: item?.status_id,
          },
        ]);
        return item;
      });
    }
  }, [rows, exportType, downloadType]);

  const accessToken = localStorage.getItem('token');
  const getCollectionOperations = async () => {
    try {
      const { data } =
        await API.nonCollectionProfiles.collectionOperation.getAll(accessToken);
      let collections = data?.data?.map((collection) => ({
        label: collection?.name,
        value: collection?.id,
      }));
      setCollectionOperationOption(collections);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const getEventCategory = async () => {
    try {
      const { data } =
        await API.nonCollectionProfiles.eventCategory.getAll(accessToken);
      let categories = data?.data?.map((category) => ({
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

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleArchive = async () => {
    if (archiveID) {
      const accessToken = localStorage.getItem('token');
      const { data } = await API.ocNonCollectionEvents.archiveNceData(
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

  return (
    <div className="mainContent ">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Non-Collection Events'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="mainContentInner">
        <NceFilters
          fetchAllStages={fetchAllStages}
          setSelectedOptions={setSelectedOptions}
          selectedOptions={selectedOptions}
          setIsLoading={setIsLoading}
        />
        <div className="d-flex flex-direction-row justify-content-between my-4">
          <div></div>
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
            {CheckPermission([
              Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS
                .WRITE,
            ]) && (
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate('/operations-center/operations/nce/create')
                }
              >
                Create NCE
              </button>
            )}
          </div>
        </div>
        <TableList
          isLoading={isLoading}
          showVerticalLabel
          data={rows}
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
        {/* </div> */}
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
      </div>
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
          <div className={`content ${styles.hideScroll}`}>
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

export default NceEventList;
