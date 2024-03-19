import React, { useEffect, useState } from 'react';
import TopBar from '../../common/topbar/index';
import SelectDropdown from '../../common/selectDropdown';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';
import SvgComponent from '../../common/SvgComponent';
import { CSVLink } from 'react-csv';
import { Col, Row } from 'react-bootstrap';
import JsPDF from 'jspdf';
import exportImage from '../../../assets/images/exportImage.svg';
import { useNavigate } from 'react-router';
import { OPERATIONS_CENTER_RESOURCE_SHARING } from '../../../routes/path';
import ProfileTableListing from './ProfileTableListing';
import Pagination from '../../common/pagination';
import DatePicker from 'react-datepicker';
import SuccessPopUpModal from '../../common/successModal/index.js';
import { toast } from 'react-toastify';
import { API } from '../../../api/api-routes.js';
import moment from 'moment';

function ListResourceSharing() {
  const accessToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const [collectionOperation, setCollectionOperation] = useState(null);
  const [shareType, setShareType] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [collectionOperationOptions, setCollectionOperationOptions] =
    useState(null);
  const [startDate, setStartDate] = useState();

  const [endDate, setEndDate] = useState();
  const [dateCrossColor, setDateCrossColor] = useState('#cccccc');
  // const [isLoading, setIsLoading] = useState(false);

  const [profileListData, setProfileListData] = useState([]);
  const [downloadType, setDownloadType] = useState('PDF');
  const [csvData, setCsvData] = useState([]);
  const [csvPDFData, setCsvPDFData] = useState([
    'Start Date,End Date,Share Type,Quantity,From Collection Operation,To Collection Operation,Created,status',
  ]);
  const [showExportDialogue, setShowExportDialogue] = useState(false);
  const [exportType, setExportType] = useState('filtered');
  const [isFetching, setIsFetching] = useState(false);

  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [archiveID, setArchiveID] = useState('');
  // const [setGetData] = useState('');
  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'start_date',
      label: 'Start Date',
      width: '15%',
      sortable: true,
      checked: true,
    },
    {
      name: 'end_date',
      label: 'End Date',
      width: '13%',
      sortable: true,
      checked: true,
    },
    {
      name: 'share_type',
      label: 'Share Type',
      width: '13%',
      sortable: true,
      checked: true,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      width: '13%',
      sortable: true,
      checked: true,
    },
    {
      name: 'description',
      label: 'Description',
      width: '13%',
      sortable: true,
      checked: true,
    },
    {
      name: 'from_collection_operation',
      label: 'From Collection Operation',
      width: '10%',
      sortable: true,
      icon: false,
      checked: true,
    },
    {
      name: 'to_collection_operation',
      label: 'To Collection Operation',
      width: '10%',
      sortable: true,
      checked: true,
    },
    {
      name: 'created_at',
      label: 'Created',
      width: '10%',
      sortable: true,
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
      key: 'start_date',
      label: 'Start Date',
    },
    {
      key: 'end_date',
      label: 'End Date',
    },
    {
      key: 'share_type',
      label: 'Share Type',
    },
    {
      key: 'quantity',
      label: 'Quantity',
    },
    {
      key: 'from_collection_operation',
      label: 'From Collection Operation',
    },
    {
      key: 'to_collection_operation',
      label: 'To Collection Operation',
    },
    {
      key: 'created_at',
      label: 'Created',
    },
    { key: 'is_active', label: 'Status' },
  ];

  const SHARE_TYPE_ENUM = [
    {
      value: 1,
      label: 'Devices',
    },
    {
      value: 2,
      label: 'Staff',
    },
    {
      value: 3,
      label: 'Vehicles',
    },
  ];
  const currentDateTime = moment().format('MM-DD-YYYY-HH-mm-ss');

  useEffect(() => {
    getCollectionOperation();
  }, []);

  const getCollectionOperation = async () => {
    try {
      const { data } =
        await API.operationCenter.resourceSharing.getCollectionOperations(
          accessToken
        );
      const modifiedData = data?.data?.map((item) => {
        return {
          label: item?.name,
          value: +item.id,
        };
      });
      setCollectionOperationOptions(modifiedData);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getData();
  }, [
    limit,
    currentPage,
    sortBy,
    sortOrder,
    searchText,
    collectionOperation,
    shareType,
    startDate,
    endDate,
  ]);

  const getData = async () => {
    try {
      const { data } = await API.operationCenter.resourceSharing.getAll(
        accessToken,
        limit,
        currentPage,
        sortBy,
        sortOrder,
        searchText,
        collectionOperation,
        shareType,
        startDate ? moment(startDate).format('MM-DD-YYYY') : null,
        endDate ? moment(endDate).format('MM-DD-YYYY') : null
      );
      if (data?.status === 200) {
        const modifiedData = data?.data?.map((item) => {
          return {
            ...item,
            start_date: moment(item?.start_date)?.format('MM-DD-YYYY'),
            end_date: moment(item?.end_date)?.format('MM-DD-YYYY'),
            share_type: SHARE_TYPE_ENUM?.filter(
              (option) => option?.value === item?.share_type
            )[0]?.label,
            from_collection_operation: item?.from_collection_operation_id?.name,
            to_collection_operation: item?.to_collection_operation_id?.name,
            created_at: moment(item?.created_at)?.format('MM-DD-YYYY'),
          };
        });
        setProfileListData(modifiedData);
        setTotalRecords(data?.count);
      }
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: '/operations-center',
    },
    {
      label: 'Resource Sharing',
      class: 'active-label',
      link: '/operations-center/resource-sharing',
    },
  ];
  //   ----------------------export data------------

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    setCsvData([]);
    setCsvPDFData([
      'Start Date,End Date,Share Type,Quantity,From Collection Operation,To Collection Operation,Created,status',
    ]);
    const allPdf = async () => {
      setIsFetching(true);
      const { data } =
        await API.operationCenter.resourceSharing.getAllFileData(accessToken);
      data?.data?.map((item) => {
        setCsvPDFData((prev) => [
          ...prev,
          `${moment(item?.start_date)?.format('MM-DD-YYYY')},${moment(
            item?.end_date
          )?.format('MM-DD-YYYY')},${
            SHARE_TYPE_ENUM?.filter(
              (option) => option?.value === item?.share_type
            )[0]?.label ?? ''
          },${item?.quantity},${item?.from_collection_operation_id?.name},${
            item?.to_collection_operation_id?.name
          },${moment(item?.created_at)?.format('MM-DD-YYYY')},${
            item?.is_active ? 'Active' : 'Inactive'
          }`,
        ]);
        return item;
      });
      setIsFetching(false);
    };
    const allCsv = async () => {
      setIsFetching(true);
      const { data } =
        await API.operationCenter.resourceSharing.getAllFileData(accessToken);
      data?.data?.map((item) => {
        setCsvData((prev) => [
          ...prev,
          {
            start_date: moment(item?.start_date)?.format('MM-DD-YYYY'),
            end_date: moment(item?.end_date)?.format('MM-DD-YYYY'),
            share_type:
              SHARE_TYPE_ENUM?.filter(
                (option) => option?.value === item?.share_type
              )[0]?.label ?? '',
            quantity: item?.quantity,
            from_collection_operation: item?.from_collection_operation_id?.name,
            to_collection_operation: item?.to_collection_operation_id?.name,
            created_at: moment(item?.created_at)?.format('MM-DD-YYYY'),
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
          `${item?.start_date},${item?.end_date},${item?.share_type},${
            item?.quantity
          },${item?.from_collection_operation_id?.name},${
            item?.to_collection_operation_id?.name
          },${item?.created_at},${item?.is_active ? 'Active' : 'Inactive'}`,
        ]);
        return item;
      });
    }
    if (exportType === 'filtered' && downloadType === 'CSV') {
      profileListData?.map((item) => {
        setCsvData((prev) => [
          ...prev,
          {
            start_date: item?.start_date,
            end_date: item?.end_date,
            share_type: item?.share_type,
            quantity: item?.quantity,
            from_collection_operation: item?.from_collection_operation_id?.name,
            to_collection_operation: item?.to_collection_operation_id?.name,
            created_at: item?.created_at,
            is_active: item?.is_active ? 'Active' : 'Inactive',
          },
        ]);
        return item;
      });
    }
  }, [profileListData, exportType, downloadType]);

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
    setTimeout(() => doc.save(`Resource_Sharing_${currentDateTime}.pdf`), 100);

    setShowExportDialogue(false);
  };
  const handleDownloadClick = () => {
    setShowExportDialogue(false);
  };

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

  const handleArchive = async () => {
    try {
      if (archiveID) {
        const accessToken = localStorage.getItem('token');
        const { data } = await API.operationCenter.resourceSharing.archiveData(
          accessToken,
          archiveID
        );
        if (data.status === 'success') {
          setShowSuccessMessage(true);
          getData();
        }
        setModalPopUp(false);
      }
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const searchFieldChange = (e) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };

  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) => `${rowData.id}/view`,
      // action: (rowData) => {},
    },
    {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      // action: (rowData) => {},
    },
    {
      label: 'Archive',
      action: (rowData) => {
        setModalPopUp(true);
        setArchiveID(rowData.id);
      },
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Resource Sharing'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex align-items-center gap-4">
              <div style={{ width: '245px' }} className={`${styles.fieldDate}`}>
                <DatePicker
                  dateFormat="MM-dd-yyyy"
                  className={`custom-datepicker ${
                    startDate ? '' : 'effectiveDate'
                  }`}
                  placeholderText={'Start Date'}
                  selected={startDate}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setStartDate(e);
                  }}
                />
                {startDate && (
                  <span
                    className={`position-absolute ${styles.dateCross}`}
                    onClick={() => {
                      setStartDate(null);
                    }}
                  >
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="css-tj5bde-Svg"
                      onMouseEnter={() => setDateCrossColor('#999999')}
                      onMouseLeave={() => setDateCrossColor('#cccccc')}
                    >
                      <path
                        fill={dateCrossColor}
                        d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
                      ></path>
                    </svg>
                  </span>
                )}
                {startDate && <label>Start Date</label>}
              </div>
              <div style={{ width: '245px' }} className={`${styles.fieldDate}`}>
                <DatePicker
                  dateFormat="MM-dd-yyyy"
                  className={`custom-datepicker ${
                    endDate ? '' : 'effectiveDate'
                  }`}
                  placeholderText={'End Date'}
                  selected={endDate}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setEndDate(e);
                  }}
                />
                {endDate && (
                  <span
                    className={`position-absolute ${styles.dateCross}`}
                    onClick={() => {
                      setEndDate(null);
                    }}
                  >
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="css-tj5bde-Svg"
                      onMouseEnter={() => setDateCrossColor('#999999')}
                      onMouseLeave={() => setDateCrossColor('#cccccc')}
                    >
                      <path
                        fill={dateCrossColor}
                        d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
                      ></path>
                    </svg>
                  </span>
                )}
                {endDate && <label>End Date</label>}
              </div>
              <div className="" style={{ width: '245px' }}>
                <SelectDropdown
                  placeholder={'Share Type'}
                  name="share_type"
                  showLabel={true}
                  required
                  removeDivider
                  selectedValue={shareType}
                  onChange={(selectedOption) => {
                    setCurrentPage(1);
                    // Update the selected value in the state
                    setShareType(selectedOption);
                  }}
                  options={SHARE_TYPE_ENUM}
                />
              </div>
              <div className="" style={{ width: '245px' }}>
                <SelectDropdown
                  placeholder={'Collection Operation'}
                  name="collection_operation"
                  showLabel={true}
                  required
                  removeDivider
                  selectedValue={collectionOperation}
                  onChange={(selectedOption) => {
                    setCurrentPage(1);
                    // Update the selected value in the state
                    setCollectionOperation(selectedOption);
                  }}
                  options={collectionOperationOptions}
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
            {/* {CheckPermission([
              CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE,
            ]) && ( */}
            <button
              style={{
                minHeight: '0px',
                padding: '12px 32px 12px 32px',
              }}
              className="btn btn-primary"
              onClick={() =>
                navigate(OPERATIONS_CENTER_RESOURCE_SHARING.CREATE)
              }
            >
              Create Share
            </button>
            {/* )} */}
          </div>
        </div>
        <ProfileTableListing
          // isLoading={isLoading}
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
          message={'Resource Sharing is archived.'}
          modalPopUp={showSuccessMessage}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
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
                    filename={`Resource_Sharing_${currentDateTime}.csv`}
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
    </div>
  );
}

export default ListResourceSharing;
