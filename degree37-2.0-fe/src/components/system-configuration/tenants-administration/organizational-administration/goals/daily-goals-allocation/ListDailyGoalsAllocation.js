import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import GoalsNavigationTabs from '../navigationTabs';
import { DAILY_GOALS_ALLOCATION_PATH } from '../../../../../../routes/path';
import SvgComponent from '../../../../../common/SvgComponent';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import Pagination from '../../../../../common/pagination/index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Col } from 'react-bootstrap';
import styles from './index.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ListDailyGoalsAllocation = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [dailyGoalsAllocation, setDailyGoalsAllocation] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [archivePopup, setArchivePopup] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [procedureType, setProcedureType] = useState(null);
  const [procedureTypeData, setProcedureTypeData] = useState();
  const [sortBy, setSortBy] = useState('');
  const [childSortBy, setChildSortBy] = useState('');
  const [userTimezone, setUserTimezone] = useState(''); // State to hold the user's timezone
  const [sortOrder, setSortOrder] = useState('');
  const [goalId, setGoalId] = useState(null);
  const [archiveDisabled, setArchiveDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: 'Daily Goals Allocation',
      class: 'active-label',
      link: `${DAILY_GOALS_ALLOCATION_PATH.LIST}`,
    },
  ];

  const handleCollectionOperationChange = (collectionOperation) => {
    setCollectionOperations((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };
  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperations(data);
  };
  const fetchCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
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
    collectionOperations.forEach((item) => {
      params.append('collection_operation', parseInt(item.id));
    });
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/daily-goals-allocation?${
        params.size > 0 ? params.toString() : 'collection_operation='
      }&limit=${limit}&page=${currentPage}&procedure_type=${
        procedureType?.value || ''
      }&selected_date=${
        effectiveDate ?? ''
      }&sortBy=${sortBy}&sortOrder=${sortOrder}&childSortBy=${childSortBy}`
    );
    const data = result.data;
    setDailyGoalsAllocation(data?.data);
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
      console.error('Error procedures : ', error);
    }
  };

  useEffect(() => {
    fetchCollectionOperations();
    fetchProcedureData();
  }, []);

  useEffect(() => {
    getData();
  }, [currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
    getData();
  }, [
    limit,
    effectiveDate,
    procedureType,
    collectionOperations,
    sortBy,
    sortOrder,
    childSortBy,
  ]);

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
      const res = await makeAuthorizedApiRequestAxios(
        'PUT',
        `${BASE_URL}/daily-goals-allocation/archive/${goalId}`
      );
      let { data, status, response } = res.data;
      if (status === 'success') {
        setArchivePopup(false);
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
      setArchiveDisabled(false);
    } catch (error) {
      setArchiveDisabled(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    const getTimezone = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(timezone);
      } catch (error) {
        console.error('Error getting timezone : ', error);
      }
    };

    getTimezone();
  }, []);

  const handleProcedureType = (item) => {
    setProcedureType(item);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Goals Allocation'}
      />
      <div className="filterBar">
        <GoalsNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter  dropdown-w w-60">
            <form
              className={`d-flex align-items-center ${styles.dropdownWidthMenu}`}
            >
              <Col lg={4} className="me-3">
                <GlobalMultiSelect
                  label="Collection Operation"
                  data={collectionOperationData}
                  selectedOptions={collectionOperations}
                  onChange={handleCollectionOperationChange}
                  onSelectAll={handleCollectionOperationChangeAll}
                />
              </Col>
              <Col lg={4} className="me-3">
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Procedure Type'}
                  defaultValue={procedureType}
                  selectedValue={procedureType}
                  showLabel
                  onChange={handleProcedureType}
                  options={procedureTypeData}
                  removeDivider
                />
              </Col>
              <Col lg={4}>
                <div className="form-field w-100">
                  <div className={`field position-relative`}>
                    <DatePicker
                      dateFormat="MM/dd/yyyy"
                      className="custom-datepicker effectiveDate"
                      placeholderText="Select Date"
                      selected={effectiveDate}
                      onChange={(date) => {
                        setEffectiveDate(date);
                      }}
                    />
                    {effectiveDate && (
                      <label
                        className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                      >
                        Select Date
                      </label>
                    )}
                  </div>
                </div>
              </Col>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_ALLOCATION
            .WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(DAILY_GOALS_ALLOCATION_PATH.CREATE);
              }}
            >
              Create Allocation
            </button>
          </div>
        )}

        <div className="table-listing-main" style={{ overflowX: 'unset' }}>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-head">
                    Effective Month
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('effective_date')}
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
                    Sun
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('sunday')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Mon
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('monday')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Tues
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('tuesday')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Wed
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('wednesday')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Thur
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('thursday')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Fri
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('friday')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Sat
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('saturday')}
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
                    <td colSpan="12" className="text-center">
                      Data Loading
                    </td>
                  </tr>
                ) : dailyGoalsAllocation?.length ? (
                  dailyGoalsAllocation?.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {format(
                            new Date(
                              new Date(item.effective_date).getTime() +
                                Math.abs(
                                  new Date(
                                    item.effective_date
                                  ).getTimezoneOffset() * 60000
                                )
                            ),
                            'MM-yyyy',
                            {
                              locale: enUS,
                              timeZone: userTimezone,
                            }
                          )}
                        </td>
                        <td>
                          {item.collection_operation
                            ?.map((item) => item.name)
                            .join(',') || ''}
                        </td>
                        <td>{item.procedure_type.name || ''}</td>
                        <td>{item.sunday}%</td>
                        <td>{item.monday}%</td>
                        <td>{item.tuesday}%</td>
                        <td>{item.wednesday}%</td>
                        <td>{item.thursday}%</td>
                        <td>{item.friday}%</td>
                        <td>{item.saturday}%</td>
                        <td className="options" style={{ paddingLeft: 0 }}>
                          <div className="dropdown-center">
                            <div
                              className="optionsIcon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              // style={{justifyContent:"start",position:"relative"}}
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu">
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS
                                  .DAILY_GOALS_ALLOCATION.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={DAILY_GOALS_ALLOCATION_PATH.VIEW.replace(
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
                                  .DAILY_GOALS_ALLOCATION.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={DAILY_GOALS_ALLOCATION_PATH.EDIT.replace(
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
                                  .DAILY_GOALS_ALLOCATION.ARCHIVE,
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
                    <td colSpan="12" className="text-center">
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

export default ListDailyGoalsAllocation;
