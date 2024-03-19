import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../../../../common/pagination';
import { toast } from 'react-toastify';
import TableList from '../../../../../common/tableListing';
import SuccessPopUpModal from '../../../../../common/successModal';
// import styles from './index.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
// import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';

const ListProcedureTypes = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [procedureTypes, setProcedureTypes] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [goalTypeText, setGoalTypeText] = useState(null);
  const [goalType, setGoalType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setItemToArchive(rowData);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const procedureTypeId = itemToArchive.id;
        const response = await fetch(
          `${BASE_URL}/procedure_types/${procedureTypeId}`,
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

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await fetch(
          `${BASE_URL}/procedure_types?limit=${limit}&page=${currentPage}&status=${
            isActive?.value ?? ''
          }&goal_type=${goalType}&sortOrder=${sortOrder}&sortName=${sortName}`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await result.json();
        setProcedureTypes(data?.data);
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
          `${BASE_URL}/procedure_types?limit=${limit}&page=${currentPage}&name=${searchText}&status=${
            isActive?.value ?? ''
          }&goal_type=${goalType}&sortOrder=${sortOrder}&sortName=${sortName}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await result.json();
        setProcedureTypes(data.data);
        setTotalRecords(data?.count);
        setRefresh(false);
      } catch (error) {
        console.error('Error searching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText) {
      getData(limit, currentPage);
    }

    if (searchText) {
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
    goalType,
    sortOrder,
    sortName,
  ]);

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

  const sortedProcedureTypes = useMemo(() => {
    const sorted = [...procedureTypes];

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
  }, [procedureTypes, sortName, sortOrder]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleGoalType = (value) => {
    if (value !== null) {
      setGoalType(value?.value);
      setGoalTypeText(value);
    } else {
      setGoalType('');
      setGoalTypeText(value);
    }
  };

  const BreadcrumbsData = [
    ...ProductsProceduresBreadCrumbsData,
    {
      label: 'Procedure Types',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/organization-admin/procedures-types',
    },
  ];

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '15%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '15%',
      sortable: true,
    },
    {
      name: 'short_description',
      label: 'Short Description',
      width: '14%',
      splitlabel: true,
      sortable: true,
    },
    { name: 'is_goal_type', label: 'Goal Type', width: '10%', sortable: true },
    {
      name: 'is_generate_online_appointments',
      label: 'Generate Online Appointments',
      width: '12%',
      splitlabel: true,
      sortable: true,
    },
    {
      name: 'procedure_types_products',
      label: 'Yield',
      width: '15%',
      sortable: false,
    },
    {
      name: 'procedure_duration',
      label: 'Procedure Duration (Minutes)',
      width: '10%',
      splitlabel: true,
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '5%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
        .PROCEDURE_TYPES.READ,
    ]) && {
      label: 'View',
      path: (rowData) => `${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
        .PROCEDURE_TYPES.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
        .PROCEDURE_TYPES.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedure Types'}
        SearchPlaceholder={'Search'}
        SearchValue={null}
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
            <form className="d-flex justify-content-end">
              <div className="dropdown">
                <SelectDropdown
                  label="Goal Type"
                  options={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                  selectedValue={goalTypeText}
                  onChange={(val) => {
                    handleGoalType(val);
                  }}
                  removeDivider
                  showLabel
                  placeholder="Goal Type"
                />
              </div>
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
            .PROCEDURE_TYPES.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  '/system-configuration/tenant-admin/organization-admin/procedures-types/create'
                );
              }}
            >
              Create Procedure Type
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={sortedProcedureTypes}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortName}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
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
          message={'Are you sure you want to archive?'}
          modalPopUp={showConfirmation}
          setModalPopUp={setShowConfirmation}
          showActionBtns={false}
          isArchived={true}
          archived={confirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Procedure Type is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organization-admin/procedures-types'
          }
        />
      </div>
    </div>
  );
};

export default ListProcedureTypes;
