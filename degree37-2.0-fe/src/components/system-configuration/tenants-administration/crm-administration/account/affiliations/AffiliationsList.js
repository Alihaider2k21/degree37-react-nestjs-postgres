import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Pagination from '../../../../../common/pagination';
import TopBar from '../../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import NavTabs from '../../../../../common/navTabs';
import { accountTabs } from '../tabs.js';
import TableList from '../../../../../common/tableListing';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect/index.jsx';

const AffiliationsList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [affiliationId, setAffiliationId] = useState(null);
  const [affiliations, setAffiliations] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'Affiliations',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/affiliations',
    },
  ];
  useEffect(() => {
    if (!isActive?.value) {
      setIsActive(null);
    }
  }, [isActive]);
  const getAffiliationsData = async () => {
    setIsLoading(true);
    let search = searchText.length > 1 ? searchText : '';
    let collectionOperationValues = '';
    if (collectionOperation?.length > 0)
      collectionOperationValues = collectionOperation
        ?.map((op) => op?.id)
        .join(',');
    const result = await fetch(
      `${BASE_URL}/affiliations?limit=${limit}&page=${currentPage}&name=${search}&status=${
        isActive?.value ? isActive.value : ''
      }&collection_operation=${collectionOperationValues}&sortName=${
        sortBy === 'collection_operation_name' ? 'collection_operation' : sortBy
      }&sortOrder=${sortOrder}`,
      {
        headers: {
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    setIsLoading(false);
    const data = await result.json();
    let temAffi = data?.data;
    for (const affi of temAffi) {
      affi.collection_operation = {
        name: affi?.collection_operation?.map((item) => item.name).join(','),
      };
    }
    setAffiliations(temAffi ?? []);
    setTotalRecords(data?.count);
  };

  useEffect(() => {
    getAffiliationsData();
  }, [
    currentPage,
    limit,
    BASE_URL,
    isActive,
    collectionOperation,
    sortBy,
    sortOrder,
  ]);
  useEffect(() => {
    if (searchText?.length > 1) {
      setSearched(true);
      setCurrentPage(1);
      getAffiliationsData();
    } else if (searchText.length === 1 && searched) {
      setCurrentPage(1);
      getAffiliationsData();
      setSearched(false);
    } else {
      setCurrentPage(1);
      getAffiliationsData();
      setSearched(false);
    }
  }, [searchText]);
  useEffect(() => {
    fetchCollectionOperations();
  }, []);
  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/crm-admin/accounts/affiliations/create'
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '25%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '25%',
      sortable: true,
    },
    {
      name: 'collection_operation_name',
      label: 'Collection Operation',
      width: '20%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];
  const optionsConfig = [
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/crm-admin/accounts/affiliations/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/crm-admin/accounts/affiliations/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => {
        setAffiliationId(rowData);
        setModalPopUp(true);
      },
    },
  ];

  const fetchCollectionOperations = async () => {
    const result = await fetch(
      `${BASE_URL}/business_units/collection_operations/list`,
      {
        headers: {
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      let formatCollectionOperations = data?.map((operation) => ({
        name: operation?.name,
        id: operation?.id,
      }));
      setCollectionOperationData([...formatCollectionOperations]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const archiveAffiliation = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/affiliations/archive/${affiliationId.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
            body: JSON.stringify({
              collection_operation_id:
                +affiliationId?.collection_operation_id?.id,
              created_by: +affiliationId?.created_by?.id,
            }),
          },
        }
      );
      if (res.status === 404) {
        toast.error('Affiliation not found.');
        return;
      }
      if (res.status === 204) {
        setModalPopUp(false);
        setShowSuccessMessage(true);
        await getAffiliationsData();
        return;
      } else toast.error('Something went wrong.');
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleCollectionOperation = (data) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === data.id)
        ? prevSelected.filter((item) => item.id !== data.id)
        : [...prevSelected, data]
    );
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Affiliations'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs tabs={accountTabs} currentLocation={currentLocation} />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex gap-3">
              <GlobalMultiSelect
                label="Collection Operation"
                data={collectionOperationData}
                selectedOptions={collectionOperation}
                onChange={(data) => handleCollectionOperation(data)}
                onSelectAll={(data) => setCollectionOperation(data)}
              />
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={isActive}
                selectedValue={isActive}
                removeDivider
                showLabel
                onChange={setIsActive}
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
          Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Affiliation
            </button>
          </div>
        )}

        <TableList
          isLoading={isLoading}
          data={affiliations}
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
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={archiveAffiliation}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Affiliation is archived.'}
          modalPopUp={showSuccessMessage}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />
      </div>
    </div>
  );
};

export default AffiliationsList;
