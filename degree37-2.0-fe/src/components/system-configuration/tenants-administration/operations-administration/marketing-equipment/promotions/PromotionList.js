import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import Pagination from '../../../../../common/pagination/index';
import { toast } from 'react-toastify';
import ArchivePopUpModal from '../../../../../common/successModal';
import MarketingEquipmentNavigationTabs from '../Navigation';
import moment from 'moment';
import { groupBy } from 'lodash';
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

const PromotionList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [promotionToArchive, setPromotionToArchive] = useState(null);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Promotions',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions',
    },
  ];

  const handleOpenConfirmation = (id) => {
    setPromotionToArchive(id);
    setModalPopUp(true);
  };

  const handleConfirmArchive = async () => {
    if (promotionToArchive) {
      const response = await fetchData(
        `/marketing-equipment/promotions/archive/${promotionToArchive}`,
        'PATCH'
      );
      if (response?.status === 'success') {
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 500);
        getPromotionsData();
        promotions?.length === 1 && currentPage > 1
          ? setCurrentPage(currentPage - 1)
          : getPromotionsData();
      } else {
        toast.error(`${response?.message?.[0] ?? response?.response}`, {
          autoClose: 3000,
        });
      }
    }
    setModalPopUp(false);
  };

  const getPromotionsData = async () => {
    setIsLoading(true);
    let collectionOperationValues = '';
    if (collectionOperation?.length > 0)
      collectionOperationValues = collectionOperation
        ?.map((op) => op?.id)
        .join(',');
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/marketing-equipment/promotions?limit=${limit}&page=${currentPage}&keyword=${
        searchText?.length > 1 ? searchText : ''
      }&status=${
        isActive?.value || ''
      }&collection_operation=${collectionOperationValues}&sortName=${
        sortBy === 'collection_operation_name' ? 'collection_operation' : sortBy
      }&sortOrder=${sortOrder}`
    );

    const data = await result.json();
    const promotionsData = data?.data?.promotions;
    if (currentPage > 1 && !(data?.data?.promotions?.length > 0)) {
      setCurrentPage(currentPage - 1);
    }
    const collectionOperationsData = groupBy(
      data?.data?.collectionOperations,
      (collectionOperation) => collectionOperation.promotion_id.id
    );

    if (promotionsData) {
      for (const promotionData of promotionsData) {
        promotionData.collectionOperations = collectionOperationsData[
          promotionData.id
        ]
          ?.map((bco) => bco.collection_operation_id.name)
          .join(', ');
      }
    }

    setPromotions(promotionsData);
    setIsLoading(false);
    setTotalRecords(data?.count);
  };

  useEffect(() => {
    if (searchText?.length > 1) {
      setSearched(true);
      setCurrentPage(1);
      getPromotionsData();
    }
    if (searchText?.length === 1 && searched) {
      setCurrentPage(1);
      getPromotionsData();
      setSearched(false);
    }
  }, [searchText]);
  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
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
    getPromotionsData();
  }, [currentPage, limit, BASE_URL, isActive, collectionOperation]);

  useEffect(() => {
    getCollectionOperations();
  }, []);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/create'
    );
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

  const sortedPromotions = useMemo(() => {
    if (!promotions || !promotions.length) return;
    const sorted = [...promotions];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [promotions, sortBy, sortOrder]);

  const handleCollectionOperationChange = (collectionOperation) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperation(data);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Promotions'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <MarketingEquipmentNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex gap-4">
              <GlobalMultiSelect
                label="Collection Operation"
                data={collectionOperationData}
                selectedOptions={collectionOperation}
                onChange={handleCollectionOperationChange}
                onSelectAll={handleCollectionOperationChangeAll}
              />
              <SelectDropdown
                placeholder={'Status'}
                selectedValue={isActive}
                onChange={(option) => {
                  setIsActive(option);
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
          Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONS
            .WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Promotion
            </button>
          </div>
        )}

        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="10%">
                    Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="13%">
                    Short Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('short_name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="20%">
                    Description
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('description')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="10%">
                    Start Date
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('start_date')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="10%">
                    End Date
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('end_date')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%">Collection Operation</th>
                  <th width="10%">
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('status')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner justify-content-center">
                      <span className="title">Actions</span>
                    </div>
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
                ) : sortedPromotions?.length ? (
                  sortedPromotions?.map((promotion) => {
                    const collection_operations_full =
                      promotion.collectionOperations?.split(', ');
                    const collection_operations_sliced =
                      collection_operations_full?.slice(0, 2)?.join(', ');
                    return (
                      <tr key={promotion.id}>
                        <td>{promotion.name}</td>
                        <td>{promotion.short_name}</td>
                        <td>
                          <span className="truncate">
                            {promotion.description}
                          </span>
                        </td>
                        <td>
                          {moment(promotion.start_date, 'YYYY-MM-DD').format(
                            'MM-DD-YYYY'
                          )}
                        </td>
                        <td>
                          {moment(promotion.end_date, 'YYYY-MM-DD').format(
                            'MM-DD-YYYY'
                          )}
                        </td>
                        <td>
                          {collection_operations_full?.length > 2
                            ? `${collection_operations_sliced}...`
                            : collection_operations_sliced}
                        </td>
                        <td>
                          {promotion.status === true ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">InActive</span>
                          )}
                        </td>
                        <td className="options">
                          <div className="dropdown-center">
                            <div
                              className="optionsIcon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu">
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION
                                  .MARKETING_EQUIPMENTS.PROMOTIONS.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${promotion.id}/view`}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION
                                  .MARKETING_EQUIPMENTS.PROMOTIONS.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${promotion.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION
                                  .MARKETING_EQUIPMENTS.PROMOTIONS.ARCHIVE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      handleOpenConfirmation(promotion.id);
                                    }}
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
                    <td className="no-data" colSpan={8}>
                      {' '}
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
          />
        </div>
        <SuccessPopUpModal
          title="Success!"
          message="Promotion is archived."
          modalPopUp={archivedStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions'
          }
        />

        <ArchivePopUpModal
          title={'Confirmation'}
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={handleConfirmArchive}
          isNavigate={false}
        />
      </div>
    </div>
  );
};

export default PromotionList;
