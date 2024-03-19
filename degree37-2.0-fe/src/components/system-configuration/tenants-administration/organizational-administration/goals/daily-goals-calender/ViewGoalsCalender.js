import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './index.module.scss';
import SvgComponent from '../../../../../common/SvgComponent';
import { DAILY_GOALS_CALENDAR } from '../../../../../../routes/path';
import GoalsNavigationTabs from '../navigationTabs';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import { toast } from 'react-toastify';
import SelectDropdown from '../../../../../common/selectDropdown';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import '../../../../../../styles/Global/Global.scss';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewDailyGoalsCalender = () => {
  const [months] = useState([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [date, setDate] = useState(new Date());
  const [dailyGoalsCalendarData, setDailyGoalsCalendarData] = useState([]);
  const [showYear, setShowYear] = useState();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [collectionOperation, setCollectionOperation] = useState(null);
  const [collectionOperationGoal, setCollectionOperationGoal] = useState(0);
  const [adjustedGoal, setAdjustedGoal] = useState(0);
  const [procedureTypeData, setProcedureTypeData] = useState([]);
  const [procedureType, setProcedureType] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());

  useEffect(() => {
    const date = new Date();
    setShowYear(date.getFullYear());
  }, []);

  const fetchCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = result.data;
    if (result.ok || result.status === 200) {
      setCollectionOperationData([
        ...(data?.map((item) => {
          return { value: item.id, label: item.name };
        }) || []),
      ]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
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

  const fetchDailyGoalsCalendar = async () => {
    if (
      procedureType?.value &&
      collectionOperation?.value &&
      !isEmpty(procedureType.value) &&
      !isEmpty(collectionOperation.value) &&
      currentMonth >= 0 &&
      showYear
    ) {
      const result = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/daily-goals-calender?procedure_type=${procedureType.value}&collection_operation=${collectionOperation.value}&month=${currentMonth}&year=${showYear}`
      );
      let { data, monthly_value } = result.data;
      if (result.ok || result.status === 200) {
        setDailyGoalsCalendarData(data || []);
        setCollectionOperationGoal(monthly_value);
        const goal_amounts = data?.map((item) => item.goal_amount);
        setAdjustedGoal(
          parseInt(goal_amounts?.reduce((partialSum, a) => partialSum + a, 0))
        );
      } else {
        toast.error('Error Fetching Collection Operations', {
          autoClose: 3000,
        });
      }
    }
  };
  useEffect(() => {
    fetchCollectionOperations();
    fetchProcedureData();
  }, []);

  useEffect(() => {
    fetchDailyGoalsCalendar();
  }, [currentMonth, showYear, procedureType, collectionOperation]);

  useEffect(() => {
    months?.forEach((_, index) => {
      if (index === parseInt(searchParams.get('month'))) {
        const newDate = new Date(date);
        newDate.setMonth(index);
        newDate.setDate(1);
        if (searchParams.get('year')) {
          newDate.setFullYear(searchParams.get('year'));
          setDate(newDate);
          setShowYear(searchParams.get('year'));
        }
        setDate(newDate);
        setCurrentMonth(index);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    const selected = collectionOperationData?.filter(
      (item) => item.value === searchParams.get('collectionOperation')
    );
    setCollectionOperation(selected[0] || null);
  }, [collectionOperationData, searchParams]);

  useEffect(() => {
    const selected = procedureTypeData?.filter(
      (item) => item.value === searchParams.get('procedureType')
    );
    setProcedureType(selected[0] || null);
  }, [procedureTypeData, searchParams]);

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: 'Daily Goals Calender',
      class: 'active-label',
      link: DAILY_GOALS_CALENDAR.VIEW,
    },
  ];

  const getdataByDay = (date) => {
    return dailyGoalsCalendarData?.filter((item) => {
      return item.date === moment(date).format('YYYY-MM-DD');
    });
  };

  const renderCalendar = () => {
    const dateCalendar = new Date(showYear, currentMonth, 1);
    const firstDay = new Date(dateCalendar.getFullYear(), currentMonth, 1);
    const lastDay = new Date(dateCalendar.getFullYear(), currentMonth + 1, 0);
    const prevLastDay = new Date(dateCalendar.getFullYear(), currentMonth, 0);
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
    const nextDays = 7 - lastDayIndex - 1;

    const days = [];
    for (let x = firstDayIndex; x > 0; x--) {
      days.push(
        <div key={`prev-${x}`} className={styles.prevdate}>
          {prevLastDay.getDate() - x + 1}
        </div>
      );
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const isToday =
        i === new Date().getDate() && currentMonth === new Date().getMonth();
      const dailyData = getdataByDay(new Date(showYear, currentMonth, i));
      days.push(
        <div
          key={`current-${i}`}
          className={isToday ? `${styles.today}` : `${styles.today}`}
        >
          <div className={`${styles.numbers} numbers`}>{i}</div>
          {dailyData?.map((item, index) => {
            return (
              <div className={`${styles.wholebody} wholebody pe-2`} key={index}>
                <p>{item?.procedure_type?.name}</p>
                <p>{parseInt(item?.goal_amount) || 0}</p>
              </div>
            );
          })}
        </div>
      );
    }

    for (let j = 1; j <= nextDays; j++) {
      days.push(
        <div key={`next-${j}`} className={styles.nextdate}>
          {j}
        </div>
      );
    }

    return (
      <>
        <div className={styles.days}>{days}</div>
      </>
    );
  };

  const handlePrevClick = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.getMonth() == 0 ? 11 : date.getMonth() - 1);
    setShowYear(newDate.getFullYear());
    setDate(newDate);
  };

  const handleNextClick = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.getMonth() == 11 ? 0 : date.getMonth() + 1);
    setShowYear(newDate.getFullYear());
    setDate(newDate);
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const prevYear = () => {
    const newDate = new Date(date);
    setShowYear(newDate.getFullYear() - 1);
    newDate.setFullYear(date.getFullYear() - 1);
    setDate(newDate);
  };

  const nextYear = () => {
    const newDate = new Date(date);
    setShowYear(newDate.getFullYear() + 1);
    newDate.setFullYear(date.getFullYear() + 1);
    setDate(newDate);
  };

  const handleProcedureType = (item) => {
    setProcedureType(item);
  };

  const handleCollectionOperation = (item) => {
    setCollectionOperation(item);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Goals Calender'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <GoalsNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter ">
            <form className={`d-flex`}>
              <SelectDropdown
                styles={{ root: 'me-3' }}
                placeholder={'Collection Operation*'}
                defaultValue={collectionOperation}
                selectedValue={collectionOperation}
                showLabel
                onChange={handleCollectionOperation}
                options={collectionOperationData}
                removeDivider
              />
              <SelectDropdown
                styles={{}}
                placeholder={'Procedure Type*'}
                defaultValue={procedureType}
                showLabel
                selectedValue={procedureType}
                removeDivider
                onChange={handleProcedureType}
                options={procedureTypeData}
              />
            </form>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div className={`${styles.info} text-dark`}>
            <div className="d-flex">
              <div>Collection Operation Goal: </div>
              <span className="ms-2">{collectionOperationGoal || 0}</span>
            </div>
            <div className="d-flex mt-2">
              <div className={styles.adjustgoaltext}>Adjusted Goal:</div>
              <span>{adjustedGoal || 0}</span>
              <div className="ms-5">Difference:</div>
              <div className="ms-4">
                {isNaN(collectionOperationGoal - adjustedGoal)
                  ? 0
                  : parseInt(collectionOperationGoal - adjustedGoal)}
              </div>
            </div>
          </div>
          <div className={styles.editIconContainer}>
            {CheckPermission([
              Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS
                .DAILY_GOALS_CALENDAR.WRITE,
            ]) && (
              <>
                <Link
                  className={`${
                    dailyGoalsCalendarData?.length === 0
                      ? styles.disabledlink
                      : ''
                  }`}
                  to={
                    dailyGoalsCalendarData?.length !== 0
                      ? `${DAILY_GOALS_CALENDAR.EDIT}?month=${currentMonth}&year=${showYear}&collectionOperation=${collectionOperation?.value}&procedureType=${procedureType?.value}`
                      : '#'
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="edit-2-outline (1) 1"
                      clipPath="url(#clip0_14318_54761)"
                    >
                      <g id="Layer 2">
                        <g id="edit-2">
                          <path
                            id="Vector"
                            d="M19 20H5C4.73478 20 4.48043 20.1054 4.29289 20.2929C4.10536 20.4804 4 20.7348 4 21C4 21.2652 4.10536 21.5196 4.29289 21.7071C4.48043 21.8946 4.73478 22 5 22H19C19.2652 22 19.5196 21.8946 19.7071 21.7071C19.8946 21.5196 20 21.2652 20 21C20 20.7348 19.8946 20.4804 19.7071 20.2929C19.5196 20.1054 19.2652 20 19 20Z"
                            fill="#387DE5"
                          />
                          <path
                            id="Vector_2"
                            d="M5.0003 18.0008H5.0903L9.2603 17.6208C9.71709 17.5753 10.1443 17.3741 10.4703 17.0508L19.4703 8.05083C19.8196 7.6818 20.0084 7.18934 19.9953 6.68137C19.9822 6.1734 19.7682 5.69134 19.4003 5.34083L16.6603 2.60083C16.3027 2.26493 15.8341 2.07219 15.3436 2.05929C14.8532 2.04638 14.3751 2.2142 14.0003 2.53083L5.0003 11.5308C4.67706 11.8568 4.4758 12.284 4.4303 12.7408L4.0003 16.9108C3.98683 17.0573 4.00583 17.2049 4.05596 17.3432C4.10608 17.4815 4.1861 17.607 4.2903 17.7108C4.38374 17.8035 4.49455 17.8768 4.61639 17.9266C4.73823 17.9764 4.86869 18.0016 5.0003 18.0008ZM15.2703 4.00083L18.0003 6.73083L16.0003 8.68083L13.3203 6.00083L15.2703 4.00083ZM6.3703 12.9108L12.0003 7.32083L14.7003 10.0208L9.1003 15.6208L6.1003 15.9008L6.3703 12.9108Z"
                            fill="#387DE5"
                          />
                        </g>
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_14318_54761">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className={`ms-1 ${styles.edittext}`}>Edit</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <div className={styles.calendar}>
          <div className={styles.calendarchild}>
            <div className={styles.month}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2D2D2E"
                className={`bi bi-chevron-left ${styles.pointer}`}
                viewBox="0 0 16 16"
                onClick={handlePrevClick}
                strokeWidth={5}
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
              <div className={`d-flex align-items-center ${styles.date}`}>
                <div className="d-flex align-items-center justify-content-between ms-5">
                  <h1>{months[currentMonth]}</h1>
                  <div className="d-flex flex-column align-items-center justify-content-between">
                    <span
                      className={styles.upchevron}
                      onClick={handleNextClick}
                    >
                      <SvgComponent name={'UpChevron'} />
                    </span>
                    <span
                      className={styles.downchevron}
                      onClick={handlePrevClick}
                    >
                      <SvgComponent name={'DownChevron'} />
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between me-5">
                  <h1 className="ms-5">{showYear}</h1>
                  <div className="d-flex flex-column align-items-center justify-content-between">
                    <span className={styles.upchevron} onClick={nextYear}>
                      <SvgComponent name={'UpChevron'} />
                    </span>
                    <span className={styles.downchevron} onClick={prevYear}>
                      <SvgComponent name={'DownChevron'} />
                    </span>
                  </div>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2D2D2E"
                className={`bi bi-chevron-right ${styles.pointer}`}
                viewBox="0 0 16 16"
                onClick={handleNextClick}
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
            <div className={styles.weekdays}>
              <div>Sunday</div>
              <div>Monday</div>
              <div>Tuesday</div>
              <div>Wednesday</div>
              <div>Thursday</div>
              <div>Friday</div>
              <div>Saturday</div>
            </div>
            <div>{renderCalendar()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDailyGoalsCalender;
