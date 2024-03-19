import React, { useEffect, useState } from 'react';
import TopBar from '../../../../common/topbar/index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../../../common/pagination';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../helpers/Api';
import { toast } from 'react-toastify';
import ArchivePopUpModal from '../../../../common/successModal';
import styles from './index.module.scss';
import TableList from '../../../../common/tableListing';
import SelectDropdown from '../../../../common/selectDropdown';
import SuccessPopUpModal from '../../../../common/successModal';
import { ClassificationsBreadCrumbsData } from './ClassificationsBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const ListClassification = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [classifications, setClassifications] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [isLoading, setIsLoading] = useState(true);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [classificationId, setClassificationId] = useState('');
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();
  const [active, setActive] = useState({ label: 'Active', value: 'true' });
  const getData = async () => {
    try {
      let params = `limit=${limit}&page=${currentPage}${
        active && `&status=${active.value}`
      }`;

      if (sortOrder.length > 0) {
        params += `&sortOrder=${sortOrder}`;
      }

      if (sortBy.length > 0) {
        params += `&sortBy=${sortBy}`;
      }

      const result = await fetchData(
        `/staffing-admin/classifications?${params}`
      );

      const { data, code, total_classifications_count } = result;
      if (code === 200) {
        setClassifications(data);
        setTotalRecords(total_classifications_count);
        if (total_classifications_count <= limit) {
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleSearchChange = async (e) => {
      try {
        const params = `limit=${limit}&page=${currentPage}&keyword=${searchText}${
          active ? `&status=${active.value}` : ''
        }`;
        const result = await fetchData(
          `/staffing-admin/classifications/search?${params}`,
          'POST'
        );
        const { data, total_records } = result;
        setClassifications(data);
        setTotalRecords(total_records);
        if (totalRecords <= limit) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error searching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText) {
      getData();
    }
    if (searchText?.length > 1) {
      handleSearchChange(searchText);
    }
    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [currentPage, limit, searchText, BASE_URL, active, sortBy, sortOrder]);

  const handleSort = (columnName) => {
    columnName === 'status' ? setSortBy('status') : setSortBy(columnName);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'ASC' ? 'DESC' : 'ASC'));
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/staffing-admin/classifications/create'
    );
  };

  const archiveClassification = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/staffing-admin/classifications/${classificationId}`
      );
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
        await getData();
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

  const tableHeaders = [
    {
      name: 'name',
      label: 'Name',
      width: '20%',
      sortable: true,
    },
    {
      name: 'description',
      label: 'Description',
      width: '35%',
      sortable: true,
    },
    {
      name: 'short_description',
      label: 'Short Description',
      width: '30%',
      sortable: true,
    },
    { name: 'status', label: 'Status', width: '30%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/staffing-admin/classifications/${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/staffing-admin/classifications/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => {
        setClassificationId(rowData.id);
        setModalPopUp(true);
      },
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={ClassificationsBreadCrumbsData}
        BreadCrumbsTitle={'Classifications'}
        SearchPlaceholder={'Search'}
        SearchValue={null}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="tabs">
          <ul>
            {CheckPermission(null, [
              Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS
                .MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/tenant-admin/staffing-admin/classifications/list'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/tenant-admin/staffing-admin/classifications/list'
                      ? 'active'
                      : ''
                  }
                >
                  Classifications
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS
                .MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
                      ? 'active'
                      : ''
                  }
                >
                  Settings
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="filterInner">
          <h2>Filters</h2>
          <form className="filterInner">
            <div className="d-flex gap-4">
              <div className={` ${styles.filter}`}>
                <SelectDropdown
                  placeholder={'Status'}
                  selectedValue={active}
                  onChange={(option) => {
                    setActive(option);
                  }}
                  options={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                  ]}
                  removeDivider
                  showLabel
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS
            .WRITE,
        ]) && (
          <div className="buttons">
            <button
              className={`btn btn-primary ${styles.btn_classification}`}
              onClick={handleAddClick}
            >
              Create Classification
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={classifications}
          headers={tableHeaders}
          handleSort={handleSort}
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

        <ArchivePopUpModal
          title={'Confirmation'}
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={archiveClassification}
          isNavigate={false}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Classification is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};

export default ListClassification;
