import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../../../../common/pagination';
import { toast } from 'react-toastify';
import TableList from '../../../../../common/tableListing';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import ConfirmModal from '../../../../../common/confirmModal';
import NavTabs from '../../../../../../components/common/navTabs';
import { accountTabs } from '../tabs';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ListAllIndustrySubCategories = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [industryCategories, setIndustryCategories] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
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
        const industryCategoryId = itemToArchive.id;
        const response = await fetch(
          `${BASE_URL}/accounts/industry_categories/${industryCategoryId}`,
          {
            method: 'PATCH',
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const { status } = await response.json();

        if (status === 204) {
          setShowConfirmation(false);
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          setRefresh(true);
        } else {
          toast.error('Error Archiving Industry Subcategory', {
            autoClose: 3000,
          });
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

  const getData = async () => {
    setIsLoading(true);
    try {
      const result = await fetch(
        `${BASE_URL}/accounts/industry_categories?limit=${limit}&page=${currentPage}&status=${
          isActive?.value ?? ''
        }&sortBy=${sortOrder}&sortName=${sortName}&subCategories=true`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await result.json();
      setIndustryCategories(data?.data);
      setTotalRecords(data?.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleSearchChange = async (e) => {
      setIsLoading(true);

      try {
        const result = await fetch(
          `${BASE_URL}/accounts/industry_categories?limit=${limit}&page=${currentPage}&name=${searchText}&status=${
            isActive?.value ?? ''
          }&sortOrder=${sortOrder}&sortName=${sortName}&subCategories=true`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await result.json();
        setIndustryCategories(data.data);
        setTotalRecords(data?.count);
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

  useEffect(() => {
    getData();
  }, [sortName, sortOrder]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleIsActive = (value) => {
    setIsActive(value);
  };

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'Industry Subcategories',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories',
    },
  ];

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '15%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '35%',
      sortable: true,
    },
    {
      name: 'parent_id',
      label: 'Industry Category',
      width: '25%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '20%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.READ,
    ]) && {
      label: 'View',
      path: (rowData) => `${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Industry Subcategories'}
        SearchPlaceholder={'Search'}
        SearchValue={null}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs tabs={accountTabs} currentLocation={currentLocation} />
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
                onChange={handleIsActive}
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
          Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories/create'
                );
              }}
            >
              Create Industry Subcategory
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={industryCategories}
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
        <ConfirmModal
          showConfirmation={showConfirmation}
          onCancel={cancelArchive}
          onConfirm={confirmArchive}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to archive?'}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Industry Subcategory is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};

export default ListAllIndustrySubCategories;
