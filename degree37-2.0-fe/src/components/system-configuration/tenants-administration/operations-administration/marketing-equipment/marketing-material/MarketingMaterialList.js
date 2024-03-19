/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuccessPopUpModal from '../../../../../common/successModal';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SvgComponent from '../../../../../common/SvgComponent';
import Pagination from '../../../../../common/pagination';
import styles from './index.module.scss';
import MarketingEquipmentNavigation from '../Navigation';
import moment from 'moment';
import CalendarCheck from '../../../../../../assets/calendar-check.svg';
import CalendarCheckAlt from '../../../../../../assets/calendar-check-alt.svg';
import SelectDropdown from '../../../../../common/selectDropdown';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const MarketingMaterialList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [materialMarketingList, setMaterialMarketingList] = useState([]);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [marketMaterialToArchive, setMaterialMarketingToArchive] =
    useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [getData, setGetData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenConfirmation = (id) => {
    setMaterialMarketingToArchive(id);
    setIsArchived(true);
    setModalPopUp(true);
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleIsActive = (value) => {
    setIsActive(value);
  };

  const handleCollectionOperation = (collectionOperation) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
    }
  };

  const handleArchive = async () => {
    if (marketMaterialToArchive) {
      const response = await fetch(
        `${BASE_URL}/marketing-equipment/marketing-material/archive/${marketMaterialToArchive}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      let data = await response.json();
      if (data.status === 'success') {
        setModalPopUp(false);

        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
        setGetData(true);
      }
      setModalPopUp(false);
    }
  };

  useEffect(() => {
    const getCollectionOperation = async () => {
      const response = await fetch(
        `${BASE_URL}/business_units/collection_operations/list?status=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      let { data } = await response.json();
      if (response.ok || response.status === 200) {
        let formatCollectionOperations = data?.map((operation) => ({
          name: operation?.name,
          id: operation?.id,
        }));
        setCollectionOperationData([...formatCollectionOperations]);
      } else {
        toast.error('Error Fetching Device type Details', {
          autoClose: 3000,
        });
      }
    };
    getCollectionOperation();
  }, []);

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Marketing Material',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/list',
    },
  ];

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      let collectionOperationValues = '';
      if (collectionOperation?.length > 0)
        collectionOperationValues = collectionOperation
          ?.map((op) => op?.id)
          .join(',');
      const result = await fetch(
        `${BASE_URL}/marketing-equipment/marketing-material?limit=${limit}&page=${currentPage}${
          sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
        }&status=${
          isActive?.value ?? ''
        }&collectionOperationId=${collectionOperationValues}${
          searchText ? `&keyword=${searchText}` : ''
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await result.json();
      setMaterialMarketingList(data.data);
      setIsLoading(false);
      setTotalRecords(data?.total_records);
    };

    getData(limit, currentPage);

    if (searchText.length === 1) {
      setCurrentPage(1);
    }
    return () => {
      setGetData(false);
    };
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    collectionOperation,
    isActive,
    getData,
    sortBy,
    sortOrder,
  ]);

  const handleAddClick = () => {
    navigate(
      `/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/create`
    );
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Marketing Material'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        {/* <MarketingEquipmentNavigationTabs/> */}
        <MarketingEquipmentNavigation></MarketingEquipmentNavigation>
        <div className="filterInner pe-3">
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
          Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
            .MARKETING_MATERIAL.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className={`btn btn-primary ${styles.btncreatemarket}`}
              onClick={handleAddClick}
            >
              Create Marketing Material
            </button>
          </div>
        )}
        <div className={`table-listing-main ${styles.tableoverflow}`}>
          <div className={`table-responsive ${styles.tableWidth}`}>
            <table className={`table table-striped`}>
              <thead>
                <tr className={styles.tr}>
                  <th className={styles.headercolor}>
                    Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.headercolor}>
                    Short Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('short_name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.headercolor}>
                    Description
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('description')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.headercolor}>
                    Retire On
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('retire_on')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.headercolor}>Collection Operation</th>
                  <th className={styles.headercolor}>
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('status')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="d-flex justify-content-center">
                    <span className="title">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="no-data" colSpan="10">
                      Data Loading
                    </td>
                  </tr>
                ) : materialMarketingList &&
                  materialMarketingList?.length > 0 ? (
                  materialMarketingList?.map((marketingMaterial, index) => {
                    return (
                      <tr key={index}>
                        <td className={styles.fontsize}>
                          {marketingMaterial.name}
                        </td>
                        <td className={styles.fontsize}>
                          {marketingMaterial.short_name}
                        </td>
                        <td>
                          <p
                            className={`mb-0 ${styles.elipseP} ${styles.fontsize}`}
                          >
                            {marketingMaterial.description}
                          </p>
                        </td>
                        <td>
                          {marketingMaterial.retire_on ? (
                            <div
                              className="d-flex"
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              <img
                                className="me-2"
                                src={
                                  moment(
                                    marketingMaterial.retire_on,
                                    'YYYY-MM-DD'
                                  ).isBefore(moment().startOf('day'))
                                    ? CalendarCheckAlt
                                    : CalendarCheck
                                }
                                alt=""
                              />
                              {moment(marketingMaterial.retire_on).format(
                                'MM-DD-YYYY'
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className={styles.fontsize}>
                          <p
                            className={`mb-0 ${styles.collectionElipse} ${styles.fontsize}`}
                          >
                            {marketingMaterial.collection_operation
                              .map((obj) => obj.name)
                              .join(', ')}
                          </p>
                        </td>
                        <td className={styles.fontsize}>
                          {marketingMaterial.status ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">InActive</span>
                          )}
                        </td>
                        <td className={`options ${styles.flexwrap}`}>
                          <div className="dropdown-center">
                            <div
                              className="optionsIcon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu position-fixed">
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION
                                  .MARKETING_EQUIPMENTS.MARKETING_MATERIAL.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/${marketingMaterial?.id}/view`}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION
                                  .MARKETING_EQUIPMENTS.MARKETING_MATERIAL
                                  .WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/${marketingMaterial?.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION
                                  .MARKETING_EQUIPMENTS.MARKETING_MATERIAL
                                  .ARCHIVE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`#`}
                                    onClick={() =>
                                      handleOpenConfirmation(
                                        marketingMaterial?.id
                                      )
                                    }
                                  >
                                    Archive
                                  </Link>
                                </li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="no-data" colSpan="10">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
          componentName={'Marketing Material'}
        />
      </div>
      <SuccessPopUpModal
        title={isArchived ? 'Confirmation' : 'Success!'}
        message={
          isArchived
            ? 'Are you sure you want to archive?'
            : 'Device Type updated.'
        }
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={isArchived ? false : true}
        isArchived={isArchived}
        archived={handleArchive}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Marketing Material is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/list'
        }
      />
    </div>
  );
};

export default MarketingMaterialList;
