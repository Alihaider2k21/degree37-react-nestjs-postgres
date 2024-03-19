import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../../../../common/pagination/index';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import TableList from '../../../../../common/tableListing';
import MarketingEquipmentNavigation from '../Navigation';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../../helpers/Api';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const EquipmentsList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [equipments, setEquipments] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [collectionOperation, setCollectionOperation] = useState([]);

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Equipment',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list',
    },
  ];

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setRefresh(false);
    setItemToArchive(rowData);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const equipmentId = itemToArchive.id;
        const result = await fetchData(
          `/marketing-equipment/equipment/archive/${equipmentId}`,
          'PATCH'
        );
        const { status_code, status } = result;
        if (status_code === 204 && status === 'Success') {
          setShowConfirmation(false);
          setTimeout(() => {
            setArchivedStatus(true);
          }, 600);
          setRefresh(true);
        } else {
          toast.error('Error Archiving Equipment', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error archiving data:', error);
      }

      setShowConfirmation(false);
      setItemToArchive(null);
    }
  };

  const handleCollectionOperation = (collectionOperation) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  useEffect(() => {
    getCollectionOperations();
  }, []);

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list`
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

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        let collectionOperationValues = '';
        if (collectionOperation?.length > 0)
          collectionOperationValues = collectionOperation
            ?.map((op) => op?.id)
            .join(',');
        var url = `${BASE_URL}/marketing-equipment/equipment/?limit=${limit}&page=${currentPage}&keyword=${searchText}&status=${
          isActive?.value ?? ''
        }&collection_operations=${collectionOperationValues}`;
        if (sortOrder.length > 0) {
          url += `&sort_order=${sortOrder}`;
        }

        if (sortName.length > 0) {
          url += `&sort_name=${sortName}`;
        }

        const result = await makeAuthorizedApiRequest('GET', url);
        const data = await result.json();

        const updatedEquipments = [];

        for (const item of data?.data ?? []) {
          const dateParts = item.retire_on?.split('-');
          const formattedDate = item.retire_on
            ? `${dateParts[1]}-${dateParts[2]}-${dateParts[0]}`
            : '';
          const updatedCatObject = {
            ...item,
            type:
              item.type.toLowerCase().charAt(0).toUpperCase() +
              item.type.toLowerCase().slice(1),
            is_active: item.is_active,
            retire_on: formattedDate,
          };

          updatedEquipments.push(updatedCatObject);
        }

        setEquipments(updatedEquipments);
        setTotalRecords(data?.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();

    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    isActive,
    collectionOperation,
    refresh,
    sortOrder,
    sortName,
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/create'
    );
  };

  const handleIsActive = (val) => {
    setIsActive(val);
  };

  const handleSort = (columnName) => {
    columnName === 'is_active'
      ? setSortName('status')
      : setSortName(columnName);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'ASC' ? 'DESC' : 'ASC'));
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '20%', sortable: true },
    { name: 'short_name', label: 'Short Name', width: '20%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    {
      name: 'type',
      label: 'Type',
      width: '20%',
      sortable: true,
    },
    {
      name: 'retire_on',
      label: 'Retire On',
      width: '20%',
      sortable: true,
    },
    {
      name: 'collection_operation',
      label: 'Collection Operation',
      width: '20%',
      sortable: false,
    },
    { name: 'is_active', label: 'Status', width: '5%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS
        .READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/view/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS
        .WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/edit/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS
        .ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Equipment'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="filterBar">
        <MarketingEquipmentNavigation />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex gap-4">
              <GlobalMultiSelect
                label="Collection Operation"
                data={collectionOperationData}
                selectedOptions={collectionOperation}
                onChange={handleCollectionOperation}
                onSelectAll={(data) => setCollectionOperation(data)}
              />
              <SelectDropdown
                placeholder={'Status'}
                selectedValue={isActive}
                onChange={(val) => {
                  console.log(val);
                  handleIsActive(val);
                }}
                options={[
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
                removeDivider
                showLabel
              />
            </form>
          </div>
        </div>
      </div>

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS
            .WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Equipment
            </button>
          </div>
        )}

        <TableList
          isLoading={isLoading}
          data={equipments}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortName}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
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
        <SuccessPopUpModal
          title="Success!"
          message="Equipment is archived."
          modalPopUp={archivedStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list'
          }
        />
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

export default EquipmentsList;
