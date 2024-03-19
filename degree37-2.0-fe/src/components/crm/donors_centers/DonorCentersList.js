import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../common/topbar/index';
import Pagination from '../../common/pagination/index';
import { toast } from 'react-toastify';
import TableList from './DonorsCenterTableListing';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import DonorCentersFilters from './DonorsCentersFilters';
import SvgComponent from '../../common/SvgComponent';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import exportImage from '../../../assets/images/exportImage.svg';
import { Col, Row } from 'react-bootstrap';
import JsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import { CRM_DONORS_CENTERS } from '../../../routes/path';
import SuccessPopUpModal from '../../common/successModal';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import { DonorCentersBreadCrumbsData } from './DonorCentersBreadCrumbsData';

let inputTimer = null;

function DonorCentersList() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [downloadType, setDownloadType] = useState('PDF');
  const [exportType, setExportType] = useState('filtered');
  const [showExportDialogue, setShowExportDialogue] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [tableHeaders, setTableHeaders] = useState([
    {
      name: 'code',
      label: 'BECS Code',
      sortable: true,
      checked: true,
    },
    {
      name: 'name',
      label: 'Name',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'city',
      label: 'City',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
      checked: true,
    },
    {
      name: 'state',
      label: 'State',
      sortable: true,
      checked: true,
    },
    {
      name: 'staging_site',
      label: 'Staging Facility',
      sortable: true,
      checked: true,
      splitlabel: true,
    },
    {
      name: 'collection_operation',
      label: 'Collection Operation',
      sortable: true,
      checked: true,
      splitlabel: true,
    },
    {
      name: 'alternate_name',
      label: 'Alternate Name',
      sortable: true,
      checked: false,
    },
    {
      name: 'physical_address',
      label: 'Physical Address',
      sortable: true,
      checked: false,
    },
    {
      name: 'postal_code',
      label: 'Zip Code',
      sortable: true,
      checked: false,
    },
    {
      name: 'county',
      label: 'County',
      sortable: true,
      checked: false,
    },
    {
      name: 'phone',
      label: 'Phone',
      sortable: true,
      checked: false,
    },
    {
      name: 'industry_category',
      label: 'Industry Category',
      sortable: true,
      checked: false,
    },
    {
      name: 'industry_sub_category',
      label: 'Industry Subcategory',
      sortable: true,
      checked: false,
    },
    {
      name: 'donor_center',
      label: 'Donor Center',
      sortable: true,
      checked: false,
    },
    {
      name: 'staging_site',
      label: 'Staging Site',
      sortable: true,
      checked: false,
    },
    {
      name: 'status',
      label: 'Status',
      sortable: true,
      checked: true,
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
      fetchAllDonorCenters({});
    }, 500);
  }, [searchText, limit, currentPage, sortBy, refresh, sortOrder]);

  const fetchAllDonorCenters = async (filters) => {
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

      let params = {
        sortOrder: sortOrder,
        sortBy: sortBy,
        page: currentPage,
        limit: +limit,
        keyword: searchText,
        city: filters?.city || '',
        organizational_levels: filters?.organizational_levels || '',
        state: filters?.state || '',
        collection_operation: filters?.collection_operation
          ? filters?.collection_operation
              .map((item) => (item?.id ? item.id : item))
              .join(',')
          : '',
        staging_site:
          filters?.staging_facility == ''
            ? null
            : filters?.staging_facility == 'Yes'
            ? true
            : filters?.staging_facility == 'No'
            ? false
            : null,
        is_active: getStatusValue(filters?.status),
      };

      const cleanedFilters = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== '' && value != undefined
        )
      );

      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/system-configuration/facilities/donor-centers/search`,
        JSON.stringify(cleanedFilters)
      );
      const data = await response.json();
      if (data) {
        const modifiedData = data?.data?.map((item) => ({
          ...item,
          city: item?.address?.city,
          state: item?.address?.state,
          county: item?.address?.county,
        }));

        setRows(modifiedData);
        setTotalRecords(data?.total_records);
        setRefresh(false);
      }
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setIsLoading(false);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const optionsConfig = [
    CheckPermission([CrmPermissions.CRM.DONOR_CENTERS.READ])
      ? {
          label: 'View',
          path: (rowData) => CRM_DONORS_CENTERS.VIEW.replace(':id', rowData.id),
          action: (rowData) => {},
        }
      : null,
  ];

  const generatePDF = async (csvPDFData) => {
    // Initialize jsPDF
    const doc = new JsPDF('landscape');

    const tableData = csvPDFData.map((row) => row.split(','));
    // Add content to the PDF
    doc.text('Donor Centers', 10, 10);

    // Calculate the maximum column width for each column
    const columnWidths = tableData.reduce((acc, row) => {
      row.forEach((cell, columnIndex) => {
        acc[columnIndex] = Math.max(
          acc[columnIndex] || 0,
          doc.getStringUnitWidth(cell)
        );
      });
      return acc;
    }, []);

    // Calculate the total width required for the table
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);

    // Calculate scaling factor based on the page width
    const pageWidth = doc.internal.pageSize.width - 20; // Adjust for margin
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
    doc.save('donor_centers.pdf');
  };

  const [csvData, setCsvData] = useState([]);
  const handleDownload = async () => {
    const csvPDFData = [
      'BECS Code,Name,City,State,Staging Facility,Collection Operation,Status',
    ];

    if (exportType === 'filtered' && downloadType === 'PDF') {
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        csvPDFData.push(
          `${item.code},${item.name},${item.city},${item.state},${
            item.staging_site ? 'YES' : 'NO'
          },${item.collection_operation.name},${
            item.status ? 'Active' : 'Inactive'
          }`
        );
      }
      generatePDF(csvPDFData);
    }

    if (exportType === 'all' && downloadType === 'PDF') {
      const results = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/system-configuration/facilities/donor-centers/search`,
        JSON.stringify({
          fetch_all: true,
        })
      );
      const data = await results.json();
      for (let i = 0; i < data?.data.length; i++) {
        const item = data?.data[i];
        csvPDFData.push(
          `${item.code},${item.name},${item?.address?.city},${
            item?.address?.state
          },${item.staging_site ? 'YES' : 'NO'},${
            item.collection_operation.name
          },${item.status ? 'Active' : 'Inactive'}`
        );
      }
      generatePDF(csvPDFData);
    }

    setShowExportDialogue(false);
  };

  useEffect(() => {
    setCsvData([]);
    if (exportType === 'filtered' && downloadType === 'CSV') {
      rows?.map((item) => {
        setCsvData((prev) => [
          ...prev,
          {
            code: item.code,
            name: item.name,
            city: item.city,
            state: item.state,
            staging_site: item.staging_site,
            collection_operation: item.collection_operation.name,
            status: item.is_active,
          },
        ]);
      });
    }

    if (exportType === 'all' && downloadType === 'CSV') {
      setAllCSVData();
    }
  }, [exportType, downloadType]);

  const setAllCSVData = async () => {
    setCsvData([]);
    const results = await makeAuthorizedApiRequest(
      'POST',
      `${BASE_URL}/system-configuration/facilities/donor-centers/search`,
      JSON.stringify({
        fetch_all: true,
      })
    );
    const data = await results.json();
    data?.data.map((item) => {
      setCsvData((prev) => [
        ...prev,
        {
          code: item.code,
          name: item.name,
          city: item?.address?.city,
          state: item?.address?.state,
          staging_site: item.staging_site,
          collection_operation: item.collection_operation.name,
          status: item.is_active,
        },
      ]);
    });
  };
  const headers = [
    { label: 'BECS Code', key: 'code' },
    { label: 'Name', key: 'name' },
    { label: 'City', key: 'city' },
    { label: 'State', key: 'state' },
    { label: 'Staging Facility', key: 'staging_site' },
    { label: 'Collection Operation', key: 'collection_operation' },
    { label: 'Status', key: 'is_active' },
    { label: 'Alternate Name', key: 'alternate_name' },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={DonorCentersBreadCrumbsData}
        BreadCrumbsTitle={'Donors Centers'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="mainContentInner">
        <DonorCentersFilters
          fetchAllStages={fetchAllDonorCenters}
          setIsLoading={setIsLoading}
        />
        <div className="d-flex flex-direction-row justify-content-between my-4">
          <div>
            <div
              className={`optionsIcon ${styles.neutral}`}
              aria-expanded="false"
              style={{ color: '#555555', fontSize: '14px' }}
            >
              <SvgComponent name={'Info'} /> Donor Centers are created in System
              Configurations.
            </div>
          </div>
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
          </div>
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
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />

        <SuccessPopUpModal
          title="Success!"
          message="Donor Center is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath="/crm/donor_center"
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
                    onClick={handleDownload}
                  >
                    Download
                  </button>
                )}

                {downloadType === 'CSV' && (
                  <CSVLink
                    className="btn btn-primary"
                    style={{ width: '45%' }}
                    filename={'donor_Centers.csv'}
                    data={csvData}
                    headers={headers}
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

export default DonorCentersList;
