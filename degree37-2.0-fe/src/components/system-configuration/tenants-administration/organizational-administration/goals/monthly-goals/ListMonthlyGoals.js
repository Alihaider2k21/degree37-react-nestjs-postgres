import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import GoalsNavigationTabs from '../navigationTabs';
import { MONTHLY_GOALS_PATH } from '../../../../../../routes/path';
import SvgComponent from '../../../../../common/SvgComponent';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import Pagination from '../../../../../common/pagination/index';
import styles from './index.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import { Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import axios from 'axios';

const ListMonthlyGoals = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [archivePopup, setArchivePopup] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [procedureType, setProcedureType] = useState(null);
  const [procedureTypeData, setProcedureTypeData] = useState();
  const currentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState(null);
  const years = Array.from({ length: 51 }, (_, index) => {
    return {
      label: (currentYear + index).toString(),
      value: (currentYear + index).toString(),
    };
  });
  const [sortBy, setSortBy] = useState('');
  const [childSortBy, setChildSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [goalId, setGoalId] = useState(null);
  const bearerToken = localStorage.getItem('token');
  const [archiveDisabled, setArchiveDisabled] = useState(false);
  const navigate = useNavigate();

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: 'Monthly Goals',
      class: 'active-label',
      link: `${MONTHLY_GOALS_PATH.LIST}`,
    },
  ];

  const fetchCollectionOperations = async () => {
    const result = await axios.get(
      `${BASE_URL}/business_units/collection_operations/list?status=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = result.data;
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const getData = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    {
      collectionOperation?.length &&
        collectionOperation?.forEach((item) => {
          params.append('collectionOperation', parseInt(item.id));
        });
    }
    const response = await axios.get(
      `${BASE_URL}/monthly_goals?${
        params.size > 0 ? params.toString() : 'collectionOperation='
      }&limit=${limit}&page=${currentPage}&procedureType=${
        procedureType?.value || ''
      }&year=${
        year?.value
      }&sortBy=${sortBy}&childSortBy=${childSortBy}&sortOrder=${sortOrder}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const data = response.data;
    setMonthlyGoals(data?.data);
    setTotalRecords(data?.count);
    setIsLoading(false);
  };

  const fetchProcedureData = async () => {
    try {
      const response = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/procedure_types?fetchAll=true&status=true`
      );
      const data = response.data;
      setProcedureTypeData([
        ...(data?.data
          .filter((item) => item.is_goal_type == true)
          .map((item) => {
            return { value: item.id, label: item.name };
          }) || []),
      ]);
    } catch (error) {
      console.error('Error procedures:', error);
    }
  };

  useEffect(() => {
    fetchCollectionOperations();
    fetchProcedureData();
  }, []);

  useEffect(() => {
    getData();
    setCurrentPage(1);
  }, [
    limit,
    BASE_URL,
    procedureType,
    collectionOperation,
    year,
    sortBy,
    childSortBy,
    sortOrder,
  ]);

  useEffect(() => {
    getData();
  }, [currentPage]);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handleSort = (column, child) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else if (sortOrder === 'DESC') {
        setSortOrder('ASC');
      } else {
        setSortOrder('ASC');
        setSortBy('');
        setChildSortBy(null);
      }
    } else {
      setSortBy(column);
      child ? setChildSortBy(child) : setChildSortBy(null);
      setSortOrder('ASC');
    }
  };

  const archive = async () => {
    if (archiveDisabled) return;
    setArchiveDisabled(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/monthly_goals/${goalId}`,
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const { data, status } = response;
      if (status === 204) {
        setArchivePopup(false);
        setArchiveDisabled(false);
        getData();
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      setArchiveDisabled(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleProcedureType = (item) => {
    setProcedureType(item);
  };

  const handleYear = (item) => {
    setYear(item);
  };

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
        BreadCrumbsTitle={'Monthly Goals'}
      />
      <div className="filterBar">
        <GoalsNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className={`d-flex row ${styles.dropdownWidthMenu}`}>
              <Col lg={4} className="">
                {collectionOperationData && (
                  <GlobalMultiSelect
                    label="Collection Operation"
                    data={collectionOperationData}
                    selectedOptions={collectionOperation}
                    onChange={handleCollectionOperationChange}
                    onSelectAll={handleCollectionOperationChangeAll}
                  />
                )}
              </Col>
              <Col lg={4} className="">
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Procedure Type'}
                  showLabel
                  selectedValue={procedureType}
                  removeDivider
                  onChange={handleProcedureType}
                  options={procedureTypeData}
                />
              </Col>
              <Col lg={4}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Year'}
                  showLabel={!isEmpty(year)}
                  selectedValue={year}
                  onChange={handleYear}
                  options={years}
                  removeDivider
                />
              </Col>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.MONTHLY_GOALS.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(MONTHLY_GOALS_PATH.CREATE);
              }}
            >
              Create Monthly Goal
            </button>
          </div>
        )}

        <div className="table-listing-main" style={{ overflowX: 'unset' }}>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-head">
                    Year
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('year')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Collection Operation
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('collection_operation', 'name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Procedure Type
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('procedure_type', 'name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Owner
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('owner', 'name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Goal
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('total_goal')}
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
                ) : monthlyGoals?.length ? (
                  monthlyGoals?.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item?.year}</td>
                        <td>
                          {item.collection_operation
                            .map((item) => item.name)
                            .join(',') || ''}
                        </td>{' '}
                        <td>{item.procedure_type.name || ''}</td>
                        <td className="col2">
                          {item?.donor_center?.name ||
                            `${item?.recruiter?.first_name || ''} ${
                              item?.recruiter?.last_name || ''
                            }`}{' '}
                        </td>
                        <td>{item.total_goal}</td>
                        <td className="options">
                          <div className="dropdown-center">
                            <div
                              className="optionsIcon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              // style={{justifyContent:"start",position:"relative"}}
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu popper">
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS
                                  .MONTHLY_GOALS.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={MONTHLY_GOALS_PATH.VIEW.replace(
                                      ':id',
                                      item.id
                                    )}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS
                                  .MONTHLY_GOALS.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={MONTHLY_GOALS_PATH.EDIT.replace(
                                      ':id',
                                      item.id
                                    )}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS
                                  .MONTHLY_GOALS.ARCHIVE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      setGoalId(item.id);
                                      setArchivePopup(true);
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
                    <td colSpan="6" className="text-center">
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
        />
        <section
          className={`popup full-section ${archivePopup ? 'active' : ''}`}
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
                  onClick={() => {
                    setArchivePopup(false);
                  }}
                >
                  No
                </button>
                <button
                  disabled={archiveDisabled}
                  className="btn btn-primary"
                  onClick={() => archive()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListMonthlyGoals;
