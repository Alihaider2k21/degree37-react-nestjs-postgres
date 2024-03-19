import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../../common/pagination/index';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import TableList from '../../../../../common/tableListing';
import SuccessPopUpModal from '../../../../../common/successModal';
// import styles from './procedures.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
// import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
const ProceduresList = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [procedures, setProcedures] = useState([]);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const currentLocation = location.pathname;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [refresh, setRefresh] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);

  const BreadcrumbsData = [
    ...ProductsProceduresBreadCrumbsData,
    {
      label: 'Procedures',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/procedures',
    },
  ];

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setItemToArchive(rowData);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      const bearerToken = localStorage.getItem('token');
      try {
        const procedureTypeId = itemToArchive.id;
        const response = await fetch(
          `${BASE_URL}/procedures/${procedureTypeId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const { status_code, status } = await response.json();

        if (status_code === 204 && status === 'Success') {
          setShowConfirmation(false);
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          setRefresh(true);
        } else {
          toast.error('Error Archiving Procedure Types', { autoClose: 3000 });
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

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await fetch(
          `${BASE_URL}/procedures?limit=${limit}&page=${currentPage}&status=${
            isActive?.value ?? ''
          }&sortOrder=${sortOrder}&sortName=${sortName}`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await result.json();
        setProcedures(data?.data);
        setTotalRecords(data?.count);
        setRefresh(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSearchChange = async (e) => {
      setIsLoading(true);
      try {
        const result = await fetch(
          `${BASE_URL}/procedures?limit=${limit}&page=${currentPage}&name=${searchText}&status=${
            isActive?.value ?? ''
          }&sortOrder=${sortOrder}&sortName=${sortName}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await result.json();
        setProcedures(data.data);
        setTotalRecords(data?.count);
        setRefresh(false);
      } catch (error) {
        console.error('Error searching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText) {
      getData();
    }
    if (searchText.length > 1) {
      handleSearchChange(searchText);
    }

    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    isActive,
    refresh,
    sortOrder,
    sortName,
  ]);

  const sortedProcedures = useMemo(() => {
    if (procedures !== undefined) {
      const sorted = [...procedures];
      if (sortName && sortOrder) {
        sorted.sort((a, b) => {
          const aValue = a[sortName];
          const bValue = b[sortName];

          if (aValue < bValue) {
            return sortOrder === 'ASC' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOrder === 'ASC' ? 1 : -1;
          }
          return 0;
        });
      }

      return sorted;
    }
  }, [procedures, sortName, sortOrder]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/organization-admin/procedures/create'
    );
  };

  const handleSort = (columnName) => {
    if (sortName === columnName) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      setSortName(columnName);
      setSortOrder('ASC');
    }
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '20%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    {
      name: 'procedure_type_id',
      label: 'Procedure Type',
      width: '20%',
      sortable: true,
    },
    {
      name: 'procedure_products',
      label: 'Yield',
      width: '10%',
      sortable: false,
    },
    {
      name: 'credits',
      label: 'Credits',
      width: '10%',
      sortable: false,
    },
    { name: 'is_active', label: 'Status', width: '5%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
        .PROCEDURES.READ,
    ]) && {
      label: 'View',
      path: (rowData) => `${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
        .PROCEDURES.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
        .PROCEDURES.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedures'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="tabs">
          <ul>
            <li>
              <Link
                to={
                  '/system-configuration/tenant-admin/organization-admin/products'
                }
                className={
                  currentLocation ===
                  '/system-configuration/tenant-admin/organization-admin/products'
                    ? 'active'
                    : ''
                }
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to={
                  '/system-configuration/tenant-admin/organization-admin/procedures'
                }
                className={
                  currentLocation ===
                  '/system-configuration/tenant-admin/organization-admin/procedures'
                    ? 'active'
                    : ''
                }
              >
                Procedures
              </Link>
            </li>
            <li>
              <Link
                to={
                  '/system-configuration/tenant-admin/organization-admin/procedures-types'
                }
                className={
                  currentLocation ===
                  '/system-configuration/tenant-admin/organization-admin/procedures-types'
                    ? 'active'
                    : ''
                }
              >
                Procedure Types
              </Link>
            </li>
          </ul>
        </div>
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex">
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={isActive}
                selectedValue={isActive}
                removeDivider
                showLabel
                onChange={(value) => {
                  setIsActive(value);
                }}
                options={[
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
            .PROCEDURES.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Procedures
            </button>
          </div>
        )}

        <TableList
          isLoading={isLoading}
          data={sortedProcedures}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortName}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Procedure is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
        {/* Confirmation Dialog */}
        <section
          className={`popup full-section ${showConfirmation ? 'active' : ''}`}
        >
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
                  onClick={() => cancelArchive()}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => confirmArchive()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>

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

export default ProceduresList;
