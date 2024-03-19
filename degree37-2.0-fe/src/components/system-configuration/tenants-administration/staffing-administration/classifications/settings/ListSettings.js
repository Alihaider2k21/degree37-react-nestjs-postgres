import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import Pagination from '../../../../../common/pagination/index';
import { toast } from 'react-toastify';
import ArchivePopUpModal from '../../../../../common/successModal';
import styles from './index.module.scss';
import { SETTINGS_CLASSIFICATIONS_PATH } from '../../../../../../routes/path';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../../helpers/Api';
import TableList from '../../../../../common/tableListing';
import SuccessPopUpModal from '../../../../../common/successModal';
import { ClassificationsBreadCrumbsData } from '../ClassificationsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ListSettings = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [settingId, setSettingId] = useState(null);
  const [settings, setSettings] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const BreadcrumbsData = [
    ...ClassificationsBreadCrumbsData,
    {
      label: 'Settings',
      class: 'active-label',
      link: SETTINGS_CLASSIFICATIONS_PATH.LIST,
    },
  ];

  const getSettingsData = async () => {
    setIsLoading(true);
    const result = await fetchData(
      `/staffing-admin/setting?limit=${limit}&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    const { data, setting_count } = result;
    setTotalRecords(setting_count);
    setSettings(
      data.map((item) => {
        return {
          ...item,
          classification_id: item?.classification.name,
        };
      })
    );
    setIsLoading(false);
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const handleSearchChange = async (e) => {
      try {
        setIsLoading(true);
        const params = `limit=${limit}&page=${currentPage}&keyword=${searchText}`;
        const result = await fetchData(
          `/staffing-admin/setting/search?${params}`,
          'POST'
        );
        const { data, total_records } = result;
        setSettings(
          data.map((item) => {
            return {
              ...item,
              classification_id: item?.classification.name,
            };
          })
        );
        setTotalRecords(total_records);
        setIsLoading(false);
      } catch (error) {
        // toast.error("Error searching data", { autoClose: 3000 });
      }
    };

    if (!searchText) {
      getSettingsData(limit, currentPage);
    }
    if (searchText?.length > 1) {
      handleSearchChange(searchText);
    }
    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [currentPage, limit, searchText, BASE_URL, sortBy, sortOrder]);

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/staffing-admin/classifications/settings/create'
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else if (sortOrder === 'DESC') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  const archiveSetting = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/staffing-admin/setting/${settingId}`
      );

      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
        await getSettingsData();
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
      name: 'classification_id',
      label: 'Classification',
      width: '7%',
      sortable: true,
    },
    {
      name: 'target_hours_per_week',
      label: 'Trg Hr/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Target Hours per Week',
    },
    {
      name: 'min_hours_per_week',
      label: 'Min Hr/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Minimum Hours per Week',
    },
    {
      name: 'max_hours_per_week',
      label: 'Max Hr/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Maximum Hours per Week',
    },
    {
      name: 'min_days_per_week',
      label: 'Min D/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Minimum Days per Week',
    },
    {
      name: 'max_days_per_week',
      label: 'Max D/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Maximum Days per Week',
    },
    {
      name: 'max_consec_days_per_week',
      label: 'Max Con D/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Maximum Consecutive Days per Week',
    },
    {
      name: 'max_ot_per_week',
      label: 'Max OT/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Maximum OT per Week',
    },
    {
      name: 'max_weekend_hours',
      label: 'Max W/Hr',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Maximum Weekend Hours',
    },
    {
      name: 'max_consec_weekends',
      label: 'Max C/W',
      width: '7%',
      tooltip: true,
      splitlabel: true,
      tooltipText: 'Maximum Consecutive Weekends',
    },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/staffing-admin/classifications/settings/${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/staffing-admin/classifications/settings/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => {
        setSettingId(rowData.id);
        setModalPopUp(true);
      },
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Settings'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
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
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className={`btn btn-primary ${styles.createsettingbtn}`}
              onClick={handleAddClick}
            >
              Create Classification Setting
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={settings}
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
          archived={archiveSetting}
          isNavigate={false}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Classification Settings is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};
export default ListSettings;
