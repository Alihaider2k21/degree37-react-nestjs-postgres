import React, { useEffect, useState } from 'react';
import TopBar from '../../common/topbar/index';
import { OPERATIONS_CENTER } from '../../../routes/path';
import SvgComponent from '../../common/SvgComponent';
import styles from './index.module.scss';
import moment from 'moment';
import CalenderFilters from './calenderFilters';
import ToolTip from '../../common/tooltip';
import { Link } from 'react-router-dom';
import { API } from '../../../api/api-routes';
import DatePicker from '../../common/DatePicker';
import { formatUser } from '../../../helpers/formatUser';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';

function SingleDate({
  date,
  data,
  className,
  onDateClick,
  onShiftClick,
  onShiftClickDuplicate,
  onShiftClickDuplicateNce,
  onShiftClickDuplicateSession,
  taskToggle,
  goalsToggle,
  currentLinkToggle,
  availableToggle,
  nceToggle,
  showDriveInsideToggle,
  showDriveOutsideToggle,
  sessionsToggle,
}) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const totalDrivesTasksLength =
    data?.drives?.length &&
    data?.drives?.reduce((accumulator, drive) => {
      const tasks = drive.task_names || [];
      return accumulator + tasks?.length;
    }, 0);
  const totalNceTasksLength =
    data?.nce?.length &&
    data?.nce?.reduce((accumulator, nce) => {
      const tasks = nce.task_names || [];
      return accumulator + tasks?.length;
    }, 0);

  const handleClick = () => {
    if (data && onDateClick) {
      onDateClick(data);
    } else {
      onDateClick(false);
    }
  };

  // const handleShiftClick = () => {
  //   if (data && onShiftClick) {
  //     onShiftClick(data);
  //   } else {
  //     onShiftClick(false);
  //   }
  // };

  const DuplicateHandleShiftClick = (data, name) => {
    // onShiftClickDuplicate(data);
    if (data && name === 'drive') {
      onShiftClickDuplicate(data);
    }
    if (data && name === 'nce') {
      onShiftClickDuplicateNce(data);
    }
    if (data && name === 'session') {
      onShiftClickDuplicateSession(data);
    } else {
      onShiftClickDuplicate(false);
      onShiftClickDuplicateNce(false);
      onShiftClickDuplicateSession(false);
    }
  };

  return data ? (
    <div className={className}>
      <div className={styles.calendarHeader}>
        <div className={styles.date}>{date.format('DD')}</div>
        <div className={styles.headerBTN}>
          {availableToggle && (
            <>
              <button className={styles.smallBtn}>
                <ToolTip
                  className={styles.toolTip}
                  text={'Date Available (Outside)'}
                  icon={<SvgComponent name={'CalendarDirectionIcon'} />}
                />
              </button>
              <button className={styles.smallBtn}>
                <ToolTip
                  className={styles.toolTip}
                  text={' Data Available (Inside)'}
                  icon={<SvgComponent name={'CalendarHumidityIcon'} />}
                />
              </button>
            </>
          )}

          {currentLinkToggle && (
            <button className={styles.smallBtn}>
              <ToolTip
                className={styles.toolTip}
                text={' Link Opportunity'}
                icon={<SvgComponent name={'CalendarLinkIcon'} />}
              />
            </button>
          )}

          <button className={styles.smallBtn}>
            <ToolTip
              className={styles.toolTip}
              text={' Day Locked'}
              icon={<SvgComponent name={'CalendarLockIcon'} />}
            />
          </button>
          <button className={styles.smallBtn}>
            <ToolTip
              className={styles.toolTip}
              text1={`Shared Staff: ${data?.net_total_shared_staff}`}
              text2={`Shared Vehicles: ${data?.net_total_shared_vehicles}`}
              text3={`Shared Devices: ${data?.net_total_shared_devices}`}
              icon={<SvgComponent name={'CalendarMoveDownIcon'} />}
            />
            &nbsp;10
          </button>
          <button
            className={styles.moreBtn}
            onClick={() => {
              setDropDownOpen((prev) => !prev);
            }}
          >
            <SvgComponent name={'CalendarMoreIcon'} />
            <div className="calendar-dropdown">
              <ul className={`dropdown-menu ${dropDownOpen ? 'show' : ''}`}>
                <li>
                  <a href="#" className="dropdown-item">
                    Lock
                  </a>
                </li>
                <li>
                  <a href="#" className="dropdown-item">
                    Close
                  </a>
                </li>
              </ul>
              <div
                className="overlay"
                onClick={() => {
                  setDropDownOpen(false);
                }}
              ></div>
            </div>
          </button>
        </div>
      </div>
      <div className={styles.taskData} onClick={handleClick}>
        {taskToggle && (
          <div className={styles.calendarTask}>
            <button className={styles.taskCount}>
              {totalDrivesTasksLength + totalNceTasksLength}
            </button>
            Tasks
          </div>
        )}

        <div className={styles.taskDetails}>
          <h3>
            <span>Goal</span>
            {goalsToggle ? data?.goal_products : data.goal_procedures}
          </h3>
          <h3>
            <span>Scheduled</span>
            {goalsToggle ? data?.scheduled_products : data.scheduled_procedures}
          </h3>
          <h3>
            <span>Actual</span>
            {goalsToggle ? data?.actual_products : data.actual_procedures}
          </h3>
          <br />
          <h3>
            <span>PA</span>
            {goalsToggle
              ? data.scheduled_products !== 0
                ? `${parseInt(
                    (data?.actual_products / data?.scheduled_products) * 100,
                    10
                  )}%`
                : '0%'
              : data.scheduled_procedures !== 0
              ? `${parseInt(
                  (data.actual_procedures / data.scheduled_procedures) * 100,
                  10
                )}%`
              : '0%'}
          </h3>
          <h3>
            <span>PG</span>
            {goalsToggle
              ? data.goal_products !== 0
                ? `${parseInt(
                    (data?.actual_products / data.goal_products) * 100,
                    10
                  )}%`
                : '0%'
              : data.goal_procedures !== 0
              ? `${parseInt(
                  (data.actual_procedures / data.goal_procedures) * 100,
                  10
                )}%`
              : '0%'}
          </h3>
        </div>
        <div className={styles.taskResources}>
          <div className="view-flex">
            <h4>
              <ToolTip
                className={styles.toolTip}
                text1={`Booked: ${data?.staff_booked}`}
                text2={`Available: ${data?.staff_available}`}
                calendarIcon={true}
                childeren={'Staff: '}
              />
              <span>{`${data?.staff_booked}/${data?.staff_available}`}</span>
            </h4>
            <h4>
              <ToolTip
                className={styles.toolTip}
                text1={`Booked: ${data?.vehicles_booked}`}
                text2={`Available: ${data?.vehicles_available}`}
                calendarIcon={true}
                childeren={'Vehicles: '}
              />
              <span>{`${data?.vehicles_booked}/${data?.vehicles_available}`}</span>
            </h4>
            <h4>
              <ToolTip
                className={styles.toolTip}
                text1={`Booked: ${data?.devices_booked}`}
                text2={`Available: ${data?.devices_available}`}
                calendarIcon={true}
                childeren={'Devices: '}
              />
              <span>{`${data?.devices_booked}/${data?.devices_available}`}</span>
            </h4>
          </div>
          <button className={styles.resourcesCountBtn}>
            <ToolTip
              className={styles.toolTip}
              text1={`Drives: ${
                data?.drives?.length ? data?.drives?.length : '0'
              }`}
              text2={`Sessions: ${
                data?.sessions?.length ? data?.sessions?.length : '0'
              }`}
              text3={`Events: ${data?.nce?.length ? data?.nce?.length : '0'}`}
              calendarIcon={true}
              childerenButtonText={(
                (data?.drives?.length || 0) +
                (data?.sessions?.length || 0) +
                (data?.nce?.length || 0)
              ).toString()}
            />
          </button>
        </div>
      </div>
      <div className="calendarTaskList">
        {data && data?.drives?.length
          ? data?.drives
              ?.filter((item) => {
                if (
                  !showDriveInsideToggle &&
                  item.crm_locations.site_type === 'Inside'
                ) {
                  return false; // Hide elements with site_type 'Inside' when showDriveInsideToggle is false
                }

                if (
                  !showDriveOutsideToggle &&
                  item.crm_locations.site_type === 'Outside'
                ) {
                  return false; // Hide elements with site_type 'Outside' when showDriveOutsideToggle is false
                }

                return true; // Show elements that don't meet the hide conditions
              })
              ?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={styles.listBox}
                    onClick={() => DuplicateHandleShiftClick(item, 'drive')}
                  >
                    <div className={styles.blueBox}>
                      <div className={styles.listCenterTitle}>
                        <h4 className={styles.listTitle}>
                          A <span>{item?.account?.name}</span>
                        </h4>
                        <h4 className={styles.lisTtime}>
                          {item?.shifts_data?.earliest_shift_start_time
                            ? `${moment
                                .utc(
                                  item?.shifts_data?.earliest_shift_start_time
                                )
                                .local()
                                .format('HH:mm')} - ${moment
                                .utc(
                                  item?.shifts_data?.latest_shift_return_time
                                )
                                .local()
                                .format('HH:mm')}`
                            : ''}
                        </h4>
                      </div>
                      <div className={styles.listCenterDescription}>
                        <p className={styles.description}>
                          {formatUser(item?.recruiter, 1)}
                        </p>
                        <p className={styles.discCount}>
                          {goalsToggle
                            ? item?.projections?.total_product_yield
                            : item?.projections?.total_procedure_type_qty}{' '}
                          <span>
                            {item?.staff_setups_count?.length
                              ? item?.staff_setups_count?.map((item, index) => {
                                  const isLastItem =
                                    index ===
                                    item?.staff_setups_count?.length - 1;
                                  return (
                                    <React.Fragment key={index}>
                                      {`${item}`}
                                      {isLastItem ? '' : ', '}
                                    </React.Fragment>
                                  );
                                })
                              : ''}
                          </span>
                          <span>
                            {item?.vehicles?.length
                              ? item?.vehicles?.map((short, index) => {
                                  const isLastItem =
                                    index === item?.vehicles?.length - 1;
                                  return (
                                    <React.Fragment key={index}>
                                      {`${
                                        short?.short_name
                                          ? short?.short_name
                                          : ''
                                      }`}
                                      {isLastItem ? '' : ', '}
                                    </React.Fragment>
                                  );
                                })
                              : ''}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
          : ''}
        {nceToggle && data && data?.nce?.length
          ? data?.nce?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={styles.listBox}
                  onClick={() => DuplicateHandleShiftClick(item, 'nce')}
                >
                  <div className={styles.blueBox}>
                    <div className={styles.listCenterTitle}>
                      <h4 className={styles.listTitle}>
                        A <span>{item?.ncp?.non_collection_profile?.name}</span>
                      </h4>
                      <h4 className={styles.lisTtime}>
                        {item?.shifts_data?.latest_shift_return_time
                          ? `${moment
                              .utc(item?.shifts_data?.earliest_shift_start_time)
                              .local()
                              .format('HH:mm')} - ${moment
                              .utc(item?.shifts_data?.latest_shift_return_time)
                              .local()
                              .format('HH:mm')}`
                          : ''}
                      </h4>
                    </div>
                    <div className={styles.listCenterDescription}>
                      <p className={styles.description}></p>
                      <p className={styles.discCount}>
                        {goalsToggle
                          ? item?.projections?.total_product_yield
                          : item?.projections?.total_procedure_type_qty}{' '}
                        <span>
                          {item?.staff_setups_count?.length
                            ? item?.staff_setups_count?.map((item, index) => {
                                const isLastItem =
                                  index ===
                                  item?.staff_setups_count?.length - 1;
                                return (
                                  <React.Fragment key={index}>
                                    {`${item}`}
                                    {isLastItem ? '' : ', '}
                                  </React.Fragment>
                                );
                              })
                            : ''}
                        </span>
                        <span>
                          {item?.vehicles?.length
                            ? item?.vehicles?.map((short, index) => {
                                const isLastItem =
                                  index === item?.vehicles?.length - 1;
                                return (
                                  <React.Fragment key={index}>
                                    {`${
                                      short?.short_name ? short?.short_name : ''
                                    }`}
                                    {isLastItem ? '' : ', '}
                                  </React.Fragment>
                                );
                              })
                            : ''}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          : ''}
        {sessionsToggle && data && data?.sessions?.length
          ? data?.sessions?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={styles.listBox}
                  onClick={() => DuplicateHandleShiftClick(item, 'session')}
                >
                  <div className={styles.blueBox}>
                    <div className={styles.listCenterTitle}>
                      <h4 className={styles.listTitle}>
                        A <span>{item?.dc_name}</span>
                      </h4>
                      <h4 className={styles.lisTtime}>
                        {item?.shifts_data?.latest_shift_return_time
                          ? `${moment
                              .utc(item?.shifts_data?.earliest_shift_start_time)
                              .local()
                              .format('HH:mm')} - ${moment
                              .utc(item?.shifts_data?.latest_shift_return_time)
                              .local()
                              .format('HH:mm')}`
                          : ''}
                      </h4>
                    </div>
                    <div className={styles.listCenterDescription}>
                      <p className={styles.description}></p>
                      <p className={styles.discCount}>
                        {goalsToggle
                          ? item?.projections?.total_product_yield
                          : item?.projections?.total_procedure_type_qty}{' '}
                        <span>
                          {item?.staff_setups_count?.length
                            ? item?.staff_setups_count?.map((item, index) => {
                                const isLastItem =
                                  index ===
                                  item?.staff_setups_count?.length - 1;
                                return (
                                  <React.Fragment key={index}>
                                    {`${item}`}
                                    {isLastItem ? '' : ', '}
                                  </React.Fragment>
                                );
                              })
                            : ''}
                        </span>
                        <span>
                          {item?.vehicles?.length
                            ? item?.vehicles?.map((short, index) => {
                                const isLastItem =
                                  index === item?.vehicles?.length - 1;
                                return (
                                  <React.Fragment key={index}>
                                    {`${
                                      short?.short_name ? short?.short_name : ''
                                    }`}
                                    {isLastItem ? '' : ', '}
                                  </React.Fragment>
                                );
                              })
                            : ''}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          : ''}
      </div>
    </div>
  ) : (
    <div className={className}>{date.format('DD')}</div>
  );
}

export default function ViewCalendar() {
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
  const [weekMode, setWeekMode] = useState('false');
  const [date, setDate] = useState(new Date());
  const [showYear, setShowYear] = useState(moment(new Date()).format('YYYY'));
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDetailsOpen, setPopupDetailsOpen] = useState(false);
  const [popupDetailsOpenDuplicate, setPopupDetailsOpenDuplicate] =
    useState(false);
  const [popupNceDetailsOpenDuplicate, setPopupNceDetailsOpenDuplicate] =
    useState(false);
  const [
    popupSessionDetailsOpenDuplicate,
    setPopupSessionDetailsOpenDuplicate,
  ] = useState(false);
  const [frontDetailData, setFrontDetailData] = useState({});
  const [frontNceDetailData, setFrontNceDetailData] = useState({});
  const [frontSessionDetailData, setFrontSessionDetailData] = useState({});
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDriveFilters, setShowDriveFilter] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [goalsToggle, setGoalsToggle] = useState(false);
  const [popupToggleProd, setPopupToggleProd] = useState(false);
  const [showTaskToggle, setShowTaskToggle] = useState(true);
  const [showDriveInsideToggle, setShowDriveInsideToggle] = useState(true);
  const [showDriveOutsideToggle, setShowDriveOutsideToggle] = useState(true);
  const [showNceToggle, setShowNceToggle] = useState(true);
  const [showCurrentLintToggle, setShowCurrentLintToggle] = useState(true);
  const [showAvailableDateToggle, setShowAvailableDateToggle] = useState(true);
  const [showUnderGoalToggle, setShowUnderGoalToggle] = useState(true);
  const [showSessionsToggle, setShowSessionsToggle] = useState(true);
  const [sortingCriteria, setSortingCriteria] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [activeTab, setActiveTab] = useState('Drives');
  const [calenderViewData, setCalenderViewData] = useState([]);
  const [popupSideDetailsOpen, setPopupSideDetailsOpen] = useState(false);
  const [popupSideDetailsNceOpen, setPopupSideDetailsNceOpen] = useState(false);
  const [openMonthPopUp, setOpenMonthPopUp] = useState(false);
  const [openYearPopUp, setOpenYearPopUp] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [goalVarianceData, setGoalVarianceData] = useState();
  const [filterApplied, setFilterApplied] = useState({});
  const [driveDetailsData, setDriveDetailsData] = useState({});
  const [nceDetailsData, setNceDetailsData] = useState({});
  const [sessionDetailsData, setSessionDetailsData] = useState({});
  const [popupSideDetailsSessionOpen, setPopupSideDetailsSessionOpen] =
    useState(false);
  const [activeNotiTab, setActiveNotiTab] = useState('Banners');
  const [showBannerToggle, setShowBannerToggle] = useState(true);
  const [showPromotionToggle, setShowPromotionToggle] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState();
  const [promotionsData, setPromotionsData] = useState([]);
  const [promotionsCoData, setPromotionsCoData] = useState([]);
  const [bannersData, setBannersData] = useState([]);
  const [bannersCoData, setBannersCoData] = useState([]);
  const [getDataDepend, setGetDataDepend] = useState('');
  const bearerToken = localStorage.getItem('token');

  // let currentMonth = date.getMonth();

  const handleNotiClick = (tab) => {
    setActiveNotiTab(tab);
  };

  const monthsData = [
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
  ];

  const yearsData = [
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
  ];

  const [currentMonths, setCurrentMonths] = useState(new Date().getMonth());

  useEffect(() => {
    const getCalenderViewData = async () => {
      const { data } = await API.operationCenter.calender.getView(bearerToken);
      if (data?.status_code === 200) {
        setCalenderViewData(data?.data);
      }
    };
    const getGoalVarianceData = async () => {
      const { data } =
        await API.operationCenter.calender.goalvariance.getGoalVariance(
          bearerToken
        );
      if (data?.data) {
        setGoalVarianceData(data?.data);
      }
    };
    const getPromotionData = async () => {
      const { data } =
        await API.operationCenter.calender.getPromotions(bearerToken);
      if (data?.status === 200) {
        setPromotionsData(data?.data?.promotions);
        setPromotionsCoData(data?.data?.collectionOperations);
      }
    };
    const getBannersData = async () => {
      const { data } =
        await API.operationCenter.calender.getBanners(bearerToken);
      if (data?.status === 200) {
        setBannersData(data?.data?.banners);
        setBannersCoData(data?.data?.collectionOperations);
      }
    };
    getCalenderViewData();
    getGoalVarianceData();
    getPromotionData();
    getBannersData();
  }, []);

  const getData = async (monthNumber, year) => {
    const { data } = await API.operationCenter.calender.getView(
      bearerToken,
      monthNumber,
      year
    );
    if (data?.status_code === 200) {
      setCalenderViewData(data?.data);
    }
  };

  const getDataCalender = async (monthNumber, year) => {
    const { data } = await API.operationCenter.calender.getView(
      bearerToken,
      monthNumber,
      year
    );
    if (data?.status_code === 200) {
      setCalenderViewData(data?.data);
    }
  };

  useEffect(() => {
    if (currentMonths && showYear) {
      getDataCalender(+currentMonths + 1, showYear);
    }
  }, [currentMonths, showYear]);

  const handleMonthClick = (index) => {
    setCurrentMonths(index);
    setOpenMonthPopUp(false);
  };
  const handleYearClick = (index) => {
    const newDate = new Date(date);
    setShowYear(index);
    newDate.setFullYear(index);
    setDate(newDate);
    setOpenYearPopUp(false);
  };

  const handleClick = (tab) => {
    setActiveTab(tab);
    setDriveDetailsData({});
    setNceDetailsData({});
    setSessionDetailsData({});
    setPopupSideDetailsOpen(false);
    setPopupSideDetailsNceOpen(false);
    setPopupSideDetailsSessionOpen(false);
  };

  const handleGoTo = async () => {
    const getMonth = new Date().getMonth() + 1;
    const getYear = new Date().getFullYear();
    const { data } = await API.operationCenter.calender.getView(
      bearerToken,
      getMonth,
      getYear
    );
    if (data?.status_code === 200) {
      setCalenderViewData(data?.data);
      // setCurrentMonths(getMonth);
      // renderCalendar('ok');
    }
  };

  const handlePrevClick = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setShowYear(newDate.getFullYear());
    setDate(newDate);
  };

  const handleNextClick = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setShowYear(newDate.getFullYear());
    setDate(newDate);
  };

  const getCurrentWeek = (currentDate) => {
    const weekStart = moment(currentDate).clone().startOf('week');
    const weekEnd = moment(currentDate).clone().endOf('week');

    return { weekStart, weekEnd };
  };
  const renderCalendar = () => {
    const firstDay = new Date(date.getFullYear(), currentMonths, 1);
    const lastDay = new Date(date.getFullYear(), currentMonths + 1, 0);
    const totalDaysInMonth = moment(firstDay).daysInMonth();
    const prevLastDay = new Date(date.getFullYear(), currentMonths, 0);
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
    const startAdditionalDays = firstDayIndex;
    const endAdditionalDays = 6 - lastDayIndex;

    const days = [];
    for (let i = startAdditionalDays - 1; i >= 0; i--) {
      const currentDate = moment(prevLastDay).subtract(i, 'days');
      const { weekStart, weekEnd } = getCurrentWeek(new Date());
      const inCurrentWeek = currentDate.isBetween(
        weekStart,
        weekEnd,
        'days',
        '[]'
      );
      days.push(
        <SingleDate
          date={moment(prevLastDay).subtract(i, 'days')}
          data={null}
          className={`${inCurrentWeek ? 'current-week' : ''} ${
            styles.prevdate
          }`}
        />
      );
    }
    const checkGreyFunc = (dateData) => {
      let calcPg;
      if (goalsToggle) {
        calcPg = parseInt(
          (dateData?.actual_products / dateData?.goal_products) * 100,
          10
        );
      } else {
        calcPg = parseInt(
          (dateData?.actual_procedures / dateData?.goal_procedures) * 100,
          10
        );
      }
      calcPg = parseInt(
        (dateData?.actual_products / dateData?.goal_products) * 100,
        10
      );
      if (calcPg < goalVarianceData?.under_goal) {
        return true;
      } else {
        return false;
      }
    };
    const checkPinkFunc = (dateData) => {
      let calcPg;
      if (goalsToggle) {
        calcPg = parseInt(
          (dateData?.actual_products / dateData?.goal_products) * 100,
          10
        );
      } else {
        calcPg = parseInt(
          (dateData?.actual_procedures / dateData?.goal_procedures) * 100,
          10
        );
      }

      if (calcPg > goalVarianceData?.over_goal) {
        return true;
      } else {
        return false;
      }
    };
    for (let i = 1; i <= totalDaysInMonth; i++) {
      let isToday = moment().format('D') == i ? true : false;
      const currentDate = moment(firstDay).add(i - 1, 'days');
      const { weekStart, weekEnd } = getCurrentWeek(new Date());
      const inCurrentWeek = currentDate.isBetween(
        weekStart,
        weekEnd,
        'days',
        '[]'
      );
      const data = calenderViewData?.find((item) => {
        return (
          moment(item.date).format('DDMMYYYY') ===
          currentDate.format('DDMMYYYY')
        );
      });

      const classnam = `${inCurrentWeek ? 'current-week' : ''} ${
        isToday ? 'curent-day' : ''
      } ${
        data && showUnderGoalToggle
          ? checkPinkFunc(data)
            ? styles.gray
            : checkGreyFunc(data)
            ? styles.pink
            : ''
          : isToday
          ? styles.today
          : styles.today
      }`;
      days.push(
        <SingleDate
          date={currentDate}
          data={data ? data : null}
          taskToggle={showTaskToggle}
          nceToggle={showNceToggle}
          showDriveInsideToggle={showDriveInsideToggle}
          showDriveOutsideToggle={showDriveOutsideToggle}
          sessionsToggle={showSessionsToggle}
          currentLinkToggle={showCurrentLintToggle}
          availableToggle={showAvailableDateToggle}
          goalsToggle={goalsToggle}
          onDateClick={(data) => {
            if (data) {
              setSelectedDate(data);
              setPopupOpen(true);
            }
          }}
          onShiftClick={(data) => {
            if (data) {
              setSelectedDate(data);
              setPopupDetailsOpen(true);
              setShowAllInfo(false);
            }
          }}
          onShiftClickDuplicate={(data) => {
            if (data) {
              setFrontDetailData(data);
              setPopupDetailsOpenDuplicate(true);
            }
          }}
          onShiftClickDuplicateNce={(data) => {
            if (data) {
              setFrontNceDetailData(data);
              setPopupNceDetailsOpenDuplicate(true);
            }
          }}
          onShiftClickDuplicateSession={(data) => {
            if (data) {
              setFrontSessionDetailData(data);
              setPopupSessionDetailsOpenDuplicate(true);
            }
          }}
          className={classnam}
        />
      );
    }

    for (let i = 1; i <= endAdditionalDays; i++) {
      const currentDate = moment(lastDay).add(i, 'days');
      const { weekStart, weekEnd } = getCurrentWeek(new Date());
      const inCurrentWeek = currentDate.isBetween(
        weekStart,
        weekEnd,
        'days',
        '[]'
      );
      days.push(
        <SingleDate
          date={moment(lastDay).add(i, 'days')}
          data={null}
          className={`${inCurrentWeek ? 'current-week' : ''} ${
            styles.prevdate
          }`}
        />
      );
    }
    return (
      <>
        <div className={styles.days}>{days}</div>
      </>
    );
  };

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Calendar',
      class: 'disable-label',
      link: '/operations-center/calendar/ViewCalendar',
    },
  ];

  useEffect(() => {
    fetchAllStages(filterApplied);
  }, [getDataDepend]);

  const fetchAllStages = async (filters) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    setFilterApplied(filters);
    try {
      const getFilterValue = (filter) => {
        if (typeof filter === 'object' && 'value' in filter) {
          return filter.value;
        } else if (Array.isArray(filter)) {
          return filter[0];
        } else {
          return filter;
        }
      };
      const filterProperties = [
        'procedure_type_id',
        'product_id',
        'operation_status_id',
        'organization_level_id',
      ];
      const queryParams = filterProperties
        .map((property) => {
          const filterValue = getFilterValue(filters[property]);
          return filterValue
            ? `${property}=${
                property === 'date'
                  ? moment(filterValue).format('YYYY-MM-DD')
                  : filterValue
              }`
            : '';
        })
        .filter((param) => param !== '')
        .join('&');
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/operations-center/calender/monthly-view?${queryParams}
        `
      );
      const data = await response.json();
      if (data) {
        setCalenderViewData(data.data);
      }
    } catch (error) {
      // toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setGetDataDepend(false);
    // setIsLoading(false);
  };

  const calculateTotalOefProduct = () => {
    let totalOEFProducts = 0;
    calenderViewData.forEach((item) => {
      if (item.drives && item.drives.length > 0) {
        item.drives.forEach((drive) => {
          if (
            drive.shifts_data &&
            drive.shifts_data.total_oef_products !== null
          ) {
            totalOEFProducts += parseFloat(
              drive.shifts_data.total_oef_products
            );
          }
        });
      }

      if (item.sessions && item.sessions.length > 0) {
        item.sessions.forEach((session) => {
          if (
            session.shifts_data &&
            session.shifts_data.total_oef_products !== null
          ) {
            totalOEFProducts += parseFloat(
              session.shifts_data.total_oef_products
            );
          }
        });
      }

      if (item.nce && item.nce.length > 0) {
        item.nce.forEach((session) => {
          if (
            session.shifts_data &&
            session.shifts_data.total_oef_products !== null
          ) {
            totalOEFProducts += parseFloat(
              session.shifts_data.total_oef_products
            );
          }
        });
      }
    });

    return totalOEFProducts;
  };

  const calculateTotalOefProcedure = () => {
    let totalOEFProcedure = 0;

    calenderViewData?.forEach((item) => {
      if (item.drives && item.drives.length > 0) {
        item.drives.forEach((drive) => {
          if (
            drive.shifts_data &&
            drive.shifts_data.total_oef_procedures !== null
          ) {
            totalOEFProcedure += parseFloat(
              drive.shifts_data.total_oef_procedures
            );
          }
        });
      }
      if (item.sessions && item.sessions.length > 0) {
        item.sessions.forEach((session) => {
          if (
            session.shifts_data &&
            session.shifts_data.total_oef_procedures !== null
          ) {
            totalOEFProcedure += parseFloat(
              session.shifts_data.total_oef_procedures
            );
          }
        });
      }

      if (item.nce && item.nce.length > 0) {
        item.nce.forEach((session) => {
          if (
            session.shifts_data &&
            session.shifts_data.total_oef_procedures !== null
          ) {
            totalOEFProcedure += parseFloat(
              session.shifts_data.total_oef_procedures
            );
          }
        });
      }
    });

    return totalOEFProcedure;
  };

  const showDriveTotal = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.total_drives,
      0
    );
    return totalReduce ? Math.floor(totalReduce) : 0;
  };

  const showSessionTotal = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.total_sessions,
      0
    );
    return totalReduce ? Math.floor(totalReduce) : 0;
  };
  const calculateProductGoals = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.goal_products,
      0
    );
    return totalReduce ? Math.floor(totalReduce) : 0;
  };
  const calculateProcedureGoals = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.goal_procedures,
      0
    );
    return totalReduce ? totalReduce : 0;
  };

  const calculateProductSchedule = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.scheduled_products,
      0
    );
    return totalReduce ? Math.floor(totalReduce) : 0;
  };

  const calculateProcedureSchedule = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.scheduled_procedures,
      0
    );
    return totalReduce ? Math.floor(totalReduce) : 0;
  };

  const calculateScheduleProductPercent = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.scheduled_products,
      0
    );
    const goals = calenderViewData?.reduce(
      (acc, obj) => acc + obj.goal_products,
      0
    );

    if (totalReduce && goals !== 0) {
      return `${Math.floor(totalReduce / goals) * 100}%`;
    } else {
      return '0%';
    }
  };

  const calculateActualProductPercent = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.actual_products,
      0
    );
    const goals = calenderViewData?.reduce(
      (acc, obj) => acc + obj.goal_products,
      0
    );

    if (totalReduce && goals !== 0) {
      return `${Math.floor(totalReduce / goals) * 100}%`;
    } else {
      return '0%';
    }
  };

  const calculateActualProcedurePercent = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.actual_procedures,
      0
    );
    const goals = calenderViewData?.reduce(
      (acc, obj) => acc + obj.goal_procedures,
      0
    );
    if (totalReduce && goals !== 0) {
      return `${Math.floor(totalReduce / goals) * 100}%`;
    } else {
      return '0%';
    }
  };

  const calculateScheduleProcedurePercent = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.scheduled_procedures,
      0
    );
    const goals = calenderViewData?.reduce(
      (acc, obj) => acc + obj.goal_procedures,
      0
    );
    if (totalReduce && goals !== 0) {
      return `${Math.floor(totalReduce / goals) * 100}%`;
    } else {
      return '0%';
    }
  };

  const calculateActualProduct = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.actual_products,
      0
    );
    return totalReduce ? Math.floor(totalReduce) : 0;
  };

  const calculateActualProcedures = () => {
    const totalReduce = calenderViewData?.reduce(
      (acc, obj) => acc + obj.actual_procedures,
      0
    );
    return totalReduce ? Math.floor(totalReduce) : 0;
  };

  const calculateForecast = () => {
    let totalReduce;
    if (goalsToggle) {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_products,
        0
      );
    } else {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_procedures,
        0
      );
    }
    const currentDateOnly = moment().startOf('day');
    const currentDate = moment();
    const endOfMonth = moment().endOf('month');
    const remainingDaysInMonth = endOfMonth.diff(currentDate, 'days');
    return totalReduce
      ? Math.floor(
          (totalReduce / currentDateOnly.format('DD')) *
            (remainingDaysInMonth + totalReduce)
        )
      : 0;
  };

  const calculateForecastPercent = () => {
    let totalReduce;
    let totalGoals;
    if (goalsToggle) {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_products,
        0
      );
      totalGoals = calenderViewData?.reduce(
        (acc, obj) => acc + obj.goal_products,
        0
      );
    } else {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_procedures,
        0
      );
      totalGoals = calenderViewData?.reduce(
        (acc, obj) => acc + obj.goal_procedures,
        0
      );
    }
    const currentDateOnly = moment().startOf('day');
    const currentDate = moment();
    const endOfMonth = moment().endOf('month');
    const remainingDaysInMonth = endOfMonth.diff(currentDate, 'days');
    const percent =
      (totalReduce / currentDateOnly.format('DD')) *
      (remainingDaysInMonth + totalReduce);
    return `${
      percent && totalGoals !== 0
        ? Math.floor((percent / totalGoals) * 100)
        : '0'
    }%`;
  };

  const calculateRequired = () => {
    let totalReduce;
    let totalGoals;
    if (goalsToggle) {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_products,
        0
      );
      totalGoals = calenderViewData?.reduce(
        (acc, obj) => acc + obj.goal_products,
        0
      );
    } else {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_procedures,
        0
      );
      totalGoals = calenderViewData?.reduce(
        (acc, obj) => acc + obj.goal_procedures,
        0
      );
    }
    return totalReduce ? totalGoals - totalReduce : 0;
  };

  const calculateRequiredPercent = () => {
    let totalReduce;
    let totalGoals;
    if (goalsToggle) {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_products,
        0
      );
      totalGoals = calenderViewData?.reduce(
        (acc, obj) => acc + obj.goal_products,
        0
      );
    } else {
      totalReduce = calenderViewData?.reduce(
        (acc, obj) => acc + obj.actual_procedures,
        0
      );
      totalGoals = calenderViewData?.reduce(
        (acc, obj) => acc + obj.goal_procedures,
        0
      );
    }
    const data = totalGoals - totalReduce;
    if (totalGoals !== 0 && data) {
      return `${Math.floor((data / totalGoals) * 100)}%`;
    } else {
      return '0%';
    }
  };

  const sortingData = () => {
    if (activeTab === 'Drives') {
      if (
        sortingCriteria === 'Account Name' ||
        sortingCriteria === 'Account Name Desc'
      ) {
        const temp = selectedDate?.drives?.sort((a, b) => {
          const nameA = a.account.name.toUpperCase(); // Ignore case sensitivity
          const nameB = b.account.name.toUpperCase();
          if (isAscending) {
            if (nameA < nameB) {
              return -1; // Return 1 to place 'a' after 'b'
            }
            if (nameA > nameB) {
              return 1; // Return -1 to place 'a' before 'b'
            }
            return 0;
          } else {
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            return 0;
          }
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Depart Time') {
        const temp = selectedDate?.drives?.sort((a, b) => {
          const timeA = new Date(
            a.shifts_data.earliest_shift_start_time
          ).getTime();
          const timeB = new Date(
            b.shifts_data.earliest_shift_start_time
          ).getTime();

          return isAscending ? timeA - timeB : timeB - timeA;
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Return Time') {
        const temp = selectedDate?.drives?.sort((a, b) => {
          const timeA = new Date(
            a.shifts_data.latest_shift_return_time
          ).getTime();
          const timeB = new Date(
            b.shifts_data.latest_shift_return_time
          ).getTime();

          return isAscending ? timeA - timeB : timeB - timeA;
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Status') {
        const temp = selectedDate?.drives?.sort((a, b) => {
          const nameA = a.drive.operation_status_id.name.toUpperCase(); // Ignore case sensitivity
          const nameB = b.drive.operation_status_id.name.toUpperCase();
          if (isAscending) {
            if (nameA < nameB) {
              return -1; // Return 1 to place 'a' after 'b'
            }
            if (nameA > nameB) {
              return 1; // Return -1 to place 'a' before 'b'
            }
            return 0;
          } else {
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            return 0;
          }
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
    }
    if (activeTab === 'Sessions') {
      if (
        sortingCriteria === 'Account Name' ||
        sortingCriteria === 'Account Name Desc'
      ) {
        const temp = selectedDate?.sessions?.sort((a, b) => {
          const nameA = a?.dc_name?.toUpperCase(); // Ignore case sensitivity
          const nameB = b?.dc_name?.toUpperCase();
          if (isAscending) {
            if (nameA < nameB) {
              return -1; // Return 1 to place 'a' after 'b'
            }
            if (nameA > nameB) {
              return 1; // Return -1 to place 'a' before 'b'
            }
            return 0;
          } else {
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            return 0;
          }
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Depart Time') {
        const temp = selectedDate?.sessions?.sort((a, b) => {
          const timeA = new Date(
            a.shifts_data.earliest_shift_start_time
          ).getTime();
          const timeB = new Date(
            b.shifts_data.earliest_shift_start_time
          ).getTime();

          return isAscending ? timeA - timeB : timeB - timeA;
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Return Time') {
        const temp = selectedDate?.sessions?.sort((a, b) => {
          const timeA = new Date(
            a.shifts_data.latest_shift_return_time
          ).getTime();
          const timeB = new Date(
            b.shifts_data.latest_shift_return_time
          ).getTime();

          return isAscending ? timeA - timeB : timeB - timeA;
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Status') {
        const temp = selectedDate?.sessions?.sort((a, b) => {
          const nameA = a.oc_name.toUpperCase(); // Ignore case sensitivity
          const nameB = b.oc_name.toUpperCase();
          if (isAscending) {
            if (nameA < nameB) {
              return -1; // Return 1 to place 'a' after 'b'
            }
            if (nameA > nameB) {
              return 1; // Return -1 to place 'a' before 'b'
            }
            return 0;
          } else {
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            return 0;
          }
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
    }
    if (activeTab === 'Events') {
      if (
        sortingCriteria === 'Account Name' ||
        sortingCriteria === 'Account Name Desc'
      ) {
        const temp = selectedDate?.nce?.sort((a, b) => {
          const nameA = a?.ncp?.non_collection_profile?.name?.toUpperCase(); // Ignore case sensitivity
          const nameB = b?.ncp?.non_collection_profile?.name?.toUpperCase();
          if (isAscending) {
            if (nameA < nameB) {
              return -1; // Return 1 to place 'a' after 'b'
            }
            if (nameA > nameB) {
              return 1; // Return -1 to place 'a' before 'b'
            }
            return 0;
          } else {
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            return 0;
          }
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Depart Time') {
        const temp = selectedDate?.nce?.sort((a, b) => {
          const timeA = new Date(
            a.shifts_data.earliest_shift_start_time
          ).getTime();
          const timeB = new Date(
            b.shifts_data.earliest_shift_start_time
          ).getTime();

          return isAscending ? timeA - timeB : timeB - timeA;
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Return Time') {
        const temp = selectedDate?.nce?.sort((a, b) => {
          const timeA = new Date(
            a.shifts_data.latest_shift_return_time
          ).getTime();
          const timeB = new Date(
            b.shifts_data.latest_shift_return_time
          ).getTime();

          return isAscending ? timeA - timeB : timeB - timeA;
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
      if (sortingCriteria === 'Status') {
        const temp = selectedDate?.nce?.sort((a, b) => {
          const nameA = a?.status?.operation_status_id?.name?.toUpperCase(); // Ignore case sensitivity
          const nameB = b?.status?.operation_status_id?.name?.toUpperCase();
          if (isAscending) {
            if (nameA < nameB) {
              return -1; // Return 1 to place 'a' after 'b'
            }
            if (nameA > nameB) {
              return 1; // Return -1 to place 'a' before 'b'
            }
            return 0;
          } else {
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            return 0;
          }
          // Names are equal, no change needed
        });
        setIsAscending(!isAscending);
        setSelectedDate((prevSelectedDate) => ({
          ...prevSelectedDate,
          drive: temp,
        }));
      }
    }
  };
  return (
    <div className="mainContent">
      <TopBar BreadCrumbsData={BreadcrumbsData} BreadCrumbsTitle={'Calendar'} />

      <div className="mainContentInner">
        <CalenderFilters
          fetchAllStages={fetchAllStages}
          setSelectedOptions={setSelectedOptions}
          selectedOptions={selectedOptions}
          // setIsLoading={setIsLoading}
        />
        <div className="claendargetDayTopSec">
          <div className="d-flex justify-content-between mt-4 mb-2">
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setGoalsToggle(!goalsToggle)}
              className="link"
            >
              {goalsToggle ? 'View as Procedures' : 'View as Products'}
            </span>
            <span
              className="link"
              onClick={(e) => {
                setShowDetailView(!showDetailView);
              }}
            >
              {showDetailView ? 'Hide' : 'Show'} Detailed View
            </span>
          </div>
          <div className="d-flex justify-content-between mt-4 calendar-data-filter">
            <div className="left-sec">
              <div className="left-box light-box">
                <div className="box-light-calendar">
                  Drives <br />
                  <strong>{showDriveTotal()}</strong>
                </div>
                <div className="box-light-calendar">
                  Sessions <br />
                  <strong>{showSessionTotal()}</strong>
                </div>

                <div className="white-box">
                  <div className="box-light-calendar">
                    Goal <br />
                    <strong>
                      {goalsToggle
                        ? calculateProductGoals()
                        : calculateProcedureGoals()}
                    </strong>
                  </div>
                  <div className="box-light-calendar">
                    Scheduled <br />
                    <strong>
                      {goalsToggle
                        ? calculateProductSchedule()
                        : calculateProcedureSchedule()}
                    </strong>
                    <span>
                      {goalsToggle
                        ? calculateScheduleProductPercent()
                        : calculateScheduleProcedurePercent()}
                      {goalsToggle ? (
                        calculateScheduleProductPercent() > 100 ? (
                          <SvgComponent name={'CalendarUpArrow'} />
                        ) : (
                          ''
                        )
                      ) : calculateScheduleProcedurePercent() > 100 ? (
                        <SvgComponent name={'CalendarUpArrow'} />
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                  <div className="box-light-calendar">
                    Actual <br />
                    <strong>
                      {goalsToggle
                        ? calculateActualProduct()
                        : calculateActualProcedures()}
                    </strong>
                    <span>
                      {goalsToggle
                        ? calculateActualProductPercent()
                        : calculateActualProcedurePercent()}
                    </span>
                  </div>
                  <div className="box-light-calendar">
                    Forecast <br />
                    <strong>{calculateForecast()}</strong>
                    <span>
                      {calculateForecastPercent()}
                      {calculateForecastPercent() > 100 ? (
                        <SvgComponent name={'CalendarUpArrow'} />
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                  <div className="box-light-calendar">
                    Required <br />
                    <strong>{calculateRequired()}</strong>
                    <span>{calculateRequiredPercent()}</span>
                  </div>
                </div>
              </div>
              <div className="light-box">
                <div className="box-light-calendar">
                  OEF <br />
                  <strong>
                    {goalsToggle
                      ? calculateTotalOefProduct()
                      : calculateTotalOefProcedure()}
                  </strong>
                </div>
              </div>
            </div>
            <div className="right-sec">
              <button
                onClick={() =>
                  setShowAvailableDateToggle(!showAvailableDateToggle)
                }
                className={`c-right-btn ${
                  showAvailableDateToggle ? 'active' : ''
                }`}
              >
                <SvgComponent name={'CalendarIcon3'} />
                Available Date
              </button>
              <button
                onClick={() => setShowCurrentLintToggle(!showCurrentLintToggle)}
                className={`c-right-btn ${
                  showCurrentLintToggle ? 'active' : ''
                }`}
              >
                <SvgComponent name={'CalendarIcon1'} />
                Not currently linked
              </button>
              <button
                onClick={() => setShowUnderGoalToggle(!showUnderGoalToggle)}
                className={`c-right-btn ${showUnderGoalToggle ? 'active' : ''}`}
              >
                <SvgComponent name={'CalendarIcon2'} />
                Over/Under Goal
              </button>
              <button
                onClick={() => setShowBannerToggle(!showBannerToggle)}
                className={`c-right-btn ${showBannerToggle ? 'active' : ''}`}
              >
                <SvgComponent name={'CalendarIcon8'} />
                Banner
              </button>
              <button
                onClick={() => setShowPromotionToggle(!showPromotionToggle)}
                className={`c-right-btn ${showPromotionToggle ? 'active' : ''}`}
              >
                <SvgComponent name={'CalendarIcon10'} />
                Promotions
              </button>
              <button
                onClick={() => setShowTaskToggle(!showTaskToggle)}
                className={`c-right-btn ${showTaskToggle ? 'active' : ''}`}
              >
                <SvgComponent name={'CalendarIcon5'} />
                Tasks
              </button>
              <button
                onClick={() => setShowDriveInsideToggle(!showDriveInsideToggle)}
                className={`c-right-btn ${
                  showDriveInsideToggle ? 'active' : ''
                }`}
              >
                <SvgComponent name={'CalendarIcon9'} />
                Drives (inside)
              </button>
              <button
                onClick={() =>
                  setShowDriveOutsideToggle(!showDriveOutsideToggle)
                }
                className={`c-right-btn ${
                  showDriveOutsideToggle ? 'active' : ''
                }`}
              >
                <SvgComponent name={'CalendarIcon7'} />
                Drives (Outside)
              </button>
              <button
                onClick={() => setShowNceToggle(!showNceToggle)}
                className={`c-right-btn ${showNceToggle ? 'active' : ''}`}
              >
                <SvgComponent name={'CalendarIcon6'} />
                NCEs
              </button>
              <button
                onClick={() => setShowSessionsToggle(!showSessionsToggle)}
                className={`c-right-btn ${showSessionsToggle ? 'active' : ''}`}
              >
                <SvgComponent name={'CalendarIcon4'} />
                Sessions
              </button>
            </div>
          </div>
        </div>
        <div
          className={`${weekMode === 'true' ? 'week-mode' : 'month-mode'} ${
            showDetailView ? 'detail-view' : ''
          } calendar-container ${styles.calendar}`}
        >
          <div className={styles.calendarchild}>
            <div className={styles.calendarMode}>
              <select
                value={weekMode}
                onChange={(e) => {
                  setWeekMode(e.target.value);
                }}
              >
                {' '}
                <option value={'true'}>Week View</option>
                <option value={'false'}>Month View</option>
              </select>
            </div>
            <div className={styles.month}>
              <>
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
                <div className="week-navigation">
                  {getCurrentWeek(new Date()).weekStart.format('DD MMMM, YYYY')}{' '}
                  - {getCurrentWeek(new Date()).weekEnd.format('DD MMMM, YYYY')}
                </div>
                <div
                  className={`d-flex align-items-center month-navigation ${styles.date}`}
                >
                  <div
                    onClick={() => setOpenMonthPopUp(!openMonthPopUp)}
                    className="d-flex position-relative align-items-center justify-content-between ms-5"
                  >
                    <h1 style={{ cursor: 'pointer' }}>
                      {months[currentMonths]}
                    </h1>
                    {openMonthPopUp && weekMode !== 'true' && (
                      <div className={styles.calenderMain}>
                        <div className={styles.monthBox}>
                          {monthsData.map((month, index) => (
                            <div
                              key={month}
                              className={styles.monthdiv}
                              onClick={() => handleMonthClick(index)}
                            >
                              {month}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="d-flex flex-column align-items-center justify-content-between">
                      <span
                        className={styles.upchevron}
                        // onClick={handleNextClick}
                      >
                        <SvgComponent name={'UpChevron'} />
                      </span>
                      <span
                        className={styles.downchevron}
                        // onClick={handlePrevClick}
                      >
                        <SvgComponent name={'DownChevron'} />
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => setOpenYearPopUp(!openYearPopUp)}
                    className="d-flex position-relative align-items-center justify-content-between me-5"
                  >
                    <h1 style={{ cursor: 'pointer' }} className="ms-5">
                      {showYear}
                    </h1>
                    {openYearPopUp && weekMode !== 'true' && (
                      <div className={styles.calenderMain}>
                        <div
                          style={{ marginLeft: '45px' }}
                          className={styles.monthBox}
                        >
                          {yearsData.map((year, index) => (
                            <div
                              key={year}
                              className={styles.monthdiv}
                              onClick={() => handleYearClick(year)}
                            >
                              {year}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="d-flex flex-column align-items-center justify-content-between">
                      <span
                        className={styles.upchevron}
                        // onClick={nextYear}
                      >
                        <SvgComponent name={'UpChevron'} />
                      </span>
                      <span
                        className={styles.downchevron}
                        // onClick={prevYear}
                      >
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
              </>
              <div className={styles.calenderTopBtn}>
                <div className={styles.todayBtn} onClick={handleGoTo}>
                  Today
                </div>
                <div className={`${styles.fieldDate} ms-2`}>
                  <DatePicker
                    dateFormat="MM/dd/yyyy"
                    // showLabel={true}
                    selected={startDate}
                    className={`${styles.dateTimeSvg} `}
                    onChange={(item) => {
                      if (item) {
                        const date = moment(item);
                        const monthNumber = date?.format('MM');
                        const year = date?.format('YYYY');
                        getData(monthNumber, year);
                      }
                      setStartDate(item);
                    }}
                    placeholderText="Go to Date"
                  />
                </div>
              </div>
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
            <div className={styles.Bcontainer}>
              {showBannerToggle && (
                <>
                  {' '}
                  <div className={styles.BinfoBox}>
                    <div className={styles.BinfoText}>
                      {bannersData?.length ? bannersData[0]?.description : ''}
                    </div>
                  </div>
                  {bannersData?.length > 1 && (
                    <div
                      className={styles.BnotificationBox}
                      onClick={() => {
                        setShowModal(true);
                        setActiveNotiTab('Banners');
                      }}
                    >
                      <div className={styles.BnotificationText}>
                        {bannersData?.length - 1} more...
                      </div>
                    </div>
                  )}
                </>
              )}
              {showPromotionToggle && (
                <>
                  <div className={styles.Balertdiv}>
                    <div className={styles.BalertBox}>
                      <div className={styles.BalertText}>
                        {promotionsData?.length
                          ? promotionsData[0]?.description
                          : ''}
                      </div>
                    </div>
                  </div>
                  {promotionsData?.length > 1 && (
                    <div
                      className={styles.BnotificationBox}
                      onClick={() => {
                        setShowModal(true);
                        setActiveNotiTab('Promotions');
                      }}
                    >
                      <div className={styles.BnotificationText}>
                        {promotionsData?.length - 1} more...
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="calendar-dates">{renderCalendar()}</div>
          </div>
        </div>
      </div>
      {showModal && (
        <section
          className={`calendarPoup full-section popup ${
            showModal ? 'active' : ''
          } `}
        >
          {/* <Modal show={showModal} style={{ width: '1000px' }}> */}
          <div
            className="popup-inner"
            style={{ maxWidth: '1000px', height: '500px', overflowY: 'auto' }}
          >
            {/* <Container style={{ width: '100%' }}> */}
            <div className={styles.popupHeader}>
              <h3 className={styles.popupTitle}>Banners and Promotions</h3>
              <button
                className={styles.popupClose}
                onClick={() => {
                  setShowModal(false);
                  setShowDriveFilter(false);
                }}
              >
                <SvgComponent name={'CrossIcon'} />
              </button>
            </div>
            <div className="mainContentInner pb-1 px-0">
              <div className={`NotesBar border-separator pb-0`}>
                <div className="d-flex align-items-center h-100">
                  <Link
                    className={
                      activeNotiTab === 'Banners' ? 'text-white h-100' : 'h-100'
                    }
                    onClick={() => handleNotiClick('Banners')}
                  >
                    <p
                      className={
                        activeNotiTab === 'Banners'
                          ? `mb-0 ${styles.activeNotitab}`
                          : `mb-0 ${styles.NotactiveNotitab}`
                      }
                    >
                      Banners
                    </p>
                  </Link>

                  <Link
                    className={
                      activeNotiTab === 'Promotions'
                        ? 'text-white h-100'
                        : 'h-100'
                    }
                    onClick={() => handleNotiClick('Promotions')}
                  >
                    <p
                      className={
                        activeNotiTab === 'Promotions'
                          ? `mb-0 activeNotes ${styles.activeNotitab}`
                          : `mb-0 ${styles.NotactiveNotitab}`
                      }
                      // style={{ padding: '0 20px', color: '#005375' }}
                    >
                      Promotions
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.promotionBannerHead}>Name</th>
                <th className={styles.promotionBannerHead}>Description</th>
                <th className={styles.promotionBannerHead}>Collection Op.</th>
                <th className={styles.promotionBannerHead}>Start Date</th>
                <th className={styles.promotionBannerHead}>End Date</th>
              </tr>
              {/* <tbody> */}
              {activeNotiTab === 'Banners' && bannersData.length
                ? bannersData?.map((banner) => (
                    <tr className={styles.tableDataRow} key={banner.id}>
                      <td>{banner?.title}</td>
                      <td>{banner?.description}</td>
                      <td>
                        {bannersCoData?.length
                          ? bannersCoData
                              ?.filter(
                                (co) => +co?.banner_id?.id === +banner?.id
                              )
                              .map((co, index, array) => (
                                <span key={index}>
                                  {co?.collection_operation_id?.name}
                                  {index < array.length - 1 ? ', ' : ''}
                                </span>
                              ))
                          : ''}
                      </td>
                      <td>{moment(banner?.start_date).format('DD-MM-YYYY')}</td>
                      <td>{moment(banner?.end_date).format('DD-MM-YYYY')}</td>
                    </tr>
                  ))
                : ''}
              {activeNotiTab === 'Promotions' && promotionsData?.length
                ? promotionsData?.map((promotion) => {
                    return (
                      <tr className={styles.tableDataRow} key={promotion.id}>
                        <td>{promotion?.name}</td>
                        <td>{promotion?.description}</td>
                        <td>
                          {promotionsCoData?.length
                            ? promotionsCoData
                                ?.filter(
                                  (co) =>
                                    +co?.promotion_id?.id === +promotion?.id
                                )
                                .map((co, index, array) => (
                                  <span key={index}>
                                    {co?.collection_operation_id?.name}
                                    {index < array.length - 1 ? ', ' : ''}
                                  </span>
                                ))
                            : ''}
                        </td>
                        <td>
                          {moment(promotion?.start_date).format('DD-MM-YYYY')}
                        </td>
                        <td>
                          {moment(promotion?.end_date).format('DD-MM-YYYY')}
                        </td>
                      </tr>
                    );
                  })
                : ''}
              {/* </tbody> */}
            </table>
          </div>
        </section>
      )}
      {popupOpen ? (
        <section
          className={`calendarPoup full-section popup ${
            popupOpen ? 'active' : ''
          } `}
        >
          <div className="popup-inner" style={{ maxWidth: '800px' }}>
            <div className="content">
              <div className={styles.popupHeader}>
                <h3 className={styles.popupTitle}>
                  {moment(selectedDate.date).format('dddd, D MMMM, YYYY')}
                </h3>
                <button
                  className={styles.popupClose}
                  onClick={() => {
                    setPopupOpen(false);
                    setShowDriveFilter(false);
                  }}
                >
                  <SvgComponent name={'CrossIcon'} />
                </button>
              </div>
              <div className="row">
                <div className="col-md-7">
                  <div className="d-flex justify-content-between mb-4">
                    <h4 className={styles.innerTitle}>Over Goal</h4>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPopupToggleProd(!popupToggleProd)}
                      className={styles.linkPopup}
                    >
                      {popupToggleProd
                        ? 'View as Procedures'
                        : 'View as Products'}
                    </span>
                  </div>
                  <div className={styles.headerBTN}>
                    {showAvailableDateToggle && (
                      <>
                        <button className={styles.smallBtn}>
                          <ToolTip
                            className={styles.toolTip}
                            text={'Date Available (Outside)'}
                            icon={
                              <SvgComponent name={'CalendarDirectionIcon'} />
                            }
                          />
                        </button>
                        <button className={styles.smallBtn}>
                          <ToolTip
                            className={styles.toolTip}
                            text={' Data Available (Inside)'}
                            icon={
                              <SvgComponent name={'CalendarHumidityIcon'} />
                            }
                          />
                        </button>
                      </>
                    )}

                    {showCurrentLintToggle && (
                      <button className={styles.smallBtn}>
                        <ToolTip
                          className={styles.toolTip}
                          text={' Link Opportunity'}
                          icon={<SvgComponent name={'CalendarLinkIcon'} />}
                        />
                      </button>
                    )}

                    <button className={styles.smallBtn}>
                      <ToolTip
                        className={styles.toolTip}
                        text={' Day Locked'}
                        icon={<SvgComponent name={'CalendarLockIcon'} />}
                      />
                    </button>
                    <button className={styles.smallBtn}>
                      <ToolTip
                        className={styles.toolTip}
                        text1={`Shared Staff: ${selectedDate?.net_total_shared_staff}`}
                        text2={`Shared Vehicles: ${selectedDate?.net_total_shared_vehicles}`}
                        text3={`Shared Devices: ${selectedDate?.net_total_shared_devices}`}
                        icon={<SvgComponent name={'CalendarMoveDownIcon'} />}
                      />
                      &nbsp;10
                    </button>
                  </div>
                  <div className={styles.taskDetails}>
                    <h3>
                      <span>Goal</span>
                      {popupToggleProd
                        ? selectedDate.goal_procedures
                        : selectedDate?.goal_products}
                    </h3>
                    <h3>
                      <span>Scheduled</span>
                      {popupToggleProd
                        ? selectedDate.scheduled_procedures
                        : selectedDate?.scheduled_products}
                    </h3>
                    <h3>
                      <span>Actual</span>
                      {popupToggleProd
                        ? selectedDate.actual_procedures
                        : selectedDate?.actual_products}
                    </h3>
                    <br />
                    <h3>
                      <span>PA</span>
                      {popupToggleProd
                        ? selectedDate.scheduled_products !== 0
                          ? `${parseInt(
                              (selectedDate?.actual_products /
                                selectedDate.scheduled_products) *
                                100,
                              10
                            )}%`
                          : '0%'
                        : selectedDate.scheduled_procedures !== 0
                        ? `${parseInt(
                            (selectedDate.actual_procedures /
                              selectedDate.scheduled_procedures) *
                              100,
                            10
                          )}%`
                        : '0%'}
                    </h3>
                    <h3>
                      <span>PG</span>
                      {popupToggleProd
                        ? selectedDate.goal_products !== 0
                          ? `${parseInt(
                              (selectedDate?.actual_products /
                                selectedDate.goal_products) *
                                100,
                              10
                            )}%`
                          : '0%'
                        : selectedDate.goal_procedures !== 0
                        ? `${parseInt(
                            (selectedDate.actual_procedures /
                              selectedDate.goal_procedures) *
                              100,
                            10
                          )}%`
                        : '0%'}
                    </h3>
                  </div>
                  <div className={styles.progress}>
                    <div>
                      <h4>Staff</h4>
                      <h3>{`${selectedDate?.staff_booked}/${selectedDate?.staff_available}`}</h3>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressRed}
                          style={{
                            maxWidth: `${
                              selectedDate?.staff_booked === 0 &&
                              selectedDate?.staff_booked === 0
                                ? '0'
                                : (selectedDate?.staff_booked /
                                    selectedDate?.staff_available) *
                                  100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h4>Vehicles</h4>
                      <h3>{`${selectedDate?.vehicles_booked}/${selectedDate?.vehicles_available}`}</h3>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressGreen}
                          style={{
                            maxWidth: `${
                              selectedDate?.vehicles_booked === 0 &&
                              selectedDate?.vehicles_available === 0
                                ? '0'
                                : (selectedDate?.vehicles_booked /
                                    selectedDate?.vehicles_available) *
                                  100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h4>Devices</h4>
                      <h3>{`${selectedDate?.devices_booked}/${selectedDate?.devices_available}`}</h3>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressYellow}
                          style={{
                            maxWidth: `${
                              selectedDate?.devices_booked === 0 &&
                              selectedDate?.devices_available === 0
                                ? '0'
                                : (selectedDate?.devices_booked /
                                    selectedDate?.devices_available) *
                                  100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.popupTask}>
                    <p>
                      <strong>Tasks</strong>
                    </p>
                    {selectedDate?.drives?.map((item) => {
                      return item?.task_names && item?.task_names?.length
                        ? item?.task_names?.map((items, index) => {
                            return <p key={index}>{items?.name}</p>;
                          })
                        : '';
                    })}
                    {selectedDate?.sessions?.map((item) => {
                      return item?.task_names && item?.task_names?.length
                        ? item?.task_names?.map((items, index) => {
                            return <p key={index}>{items?.name}</p>;
                          })
                        : '';
                    })}
                    {selectedDate?.nce?.map((item) => {
                      return item?.task_names && item?.task_names?.length
                        ? item?.task_names?.map((items, index) => {
                            return <p key={index}>{items?.name}</p>;
                          })
                        : '';
                    })}
                  </div>
                </div>
                <div className="col-md-5">
                  <div className={styles.headerPopupRight}>
                    <div className={styles.popupAccordion}>
                      <button
                        className={activeTab === 'Drives' ? styles.active : ''}
                        onClick={() => handleClick('Drives')}
                      >
                        Drives
                      </button>
                      <button
                        className={
                          activeTab === 'Sessions' ? styles.active : ''
                        }
                        onClick={() => handleClick('Sessions')}
                      >
                        Sessions
                      </button>
                      <button
                        className={activeTab === 'Events' ? styles.active : ''}
                        onClick={() => handleClick('Events')}
                      >
                        Events
                      </button>
                    </div>
                    <div className={styles.popupRight}>
                      <div>
                        <button
                          onClick={() => {
                            setShowDriveFilter((prev) => !prev);
                          }}
                        >
                          <SvgComponent name={'CalendarSortIcon'} />
                        </button>
                        <ul
                          className={`dropdown-menu claendar-dropdown ${
                            showDriveFilters ? 'show' : ''
                          }`}
                        >
                          <li
                            onClick={() => {
                              setSortingCriteria('Account Name');
                              setShowDriveFilter(false);
                            }}
                          >
                            <a href="#" className="dropdown-item">
                              Account Name
                            </a>
                          </li>
                          <li
                            onClick={() =>
                              setSortingCriteria('Account Name Desc')
                            }
                          >
                            <a href="#" className="dropdown-item">
                              Account Name (Z-A)
                            </a>
                          </li>
                          <li
                            onClick={() => setSortingCriteria('Operation Type')}
                          >
                            <a href="#" className="dropdown-item">
                              Operation Type
                            </a>
                          </li>
                          <li
                            onClick={() => {
                              setSortingCriteria('Depart Time');
                              setShowDriveFilter(false);
                            }}
                          >
                            <a href="#" className="dropdown-item">
                              Depart Time
                            </a>
                          </li>
                          <li
                            onClick={() => {
                              setSortingCriteria('Return Time');
                              setShowDriveFilter(false);
                            }}
                          >
                            <a href="#" className="dropdown-item">
                              Return Time
                            </a>
                          </li>
                          <li onClick={() => setSortingCriteria('Projection')}>
                            <a href="#" className="dropdown-item">
                              Projection
                            </a>
                          </li>
                          <li
                            onClick={() => {
                              setSortingCriteria('Status');
                              setShowDriveFilter(false);
                            }}
                          >
                            <a href="#" className="dropdown-item">
                              Status
                            </a>
                          </li>
                        </ul>
                      </div>
                      <button onClick={sortingData}>
                        <SvgComponent name={'CalendarSortIconTwo'} />
                      </button>
                    </div>
                  </div>
                  {activeTab === 'Drives' && (
                    <div className="calendarTaskList">
                      {selectedDate && selectedDate?.drives?.length
                        ? selectedDate?.drives
                            ?.filter((item) => {
                              if (
                                !showDriveInsideToggle &&
                                item.crm_locations.site_type === 'Inside'
                              ) {
                                return false;
                              }

                              if (
                                !showDriveOutsideToggle &&
                                item.crm_locations.site_type === 'Outside'
                              ) {
                                return false;
                              }

                              return true;
                            })
                            ?.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  style={{ cursor: 'pointer' }}
                                  className={styles.listBox}
                                  onClick={() => {
                                    setShowAllInfo(true);
                                    setPopupDetailsOpen(true);
                                    setPopupOpen(false);
                                    setShowDriveFilter(false);
                                    setDriveDetailsData(item);
                                    setPopupSideDetailsOpen(true);
                                    setPopupSideDetailsNceOpen(false);
                                  }}
                                >
                                  <div className={styles.blueBox}>
                                    <div className={styles.listCenterTitle}>
                                      <h4 className={styles.listTitle}>
                                        A <span>{item?.account?.name}</span>
                                      </h4>
                                      <h4 className={styles.lisTtime}>
                                        {item?.shifts_data
                                          ?.earliest_shift_start_time
                                          ? `${moment
                                              .utc(
                                                item?.shifts_data
                                                  ?.earliest_shift_start_time
                                              )
                                              .local()
                                              .format('HH:mm')} - ${moment
                                              .utc(
                                                item?.shifts_data
                                                  ?.latest_shift_return_time
                                              )
                                              .local()
                                              .format('HH:mm')}`
                                          : ''}
                                      </h4>
                                    </div>
                                    <div
                                      className={styles.listCenterDescription}
                                    >
                                      <p className={styles.description}>
                                        {formatUser(item?.recruiter, 1)}
                                      </p>
                                      <p className={styles.discCount}>
                                        {popupToggleProd
                                          ? item?.projections
                                              ?.total_product_yield
                                          : item?.projections
                                              ?.total_procedure_type_qty}{' '}
                                        <span>
                                          {item?.staff_setups_count?.length
                                            ? item?.staff_setups_count?.map(
                                                (item, index) => {
                                                  const isLastItem =
                                                    index ===
                                                    item?.staff_setups_count
                                                      ?.length -
                                                      1;
                                                  return (
                                                    <React.Fragment key={index}>
                                                      {`${item}`}
                                                      {isLastItem ? '' : ', '}
                                                    </React.Fragment>
                                                  );
                                                }
                                              )
                                            : ''}
                                        </span>
                                        <span>
                                          {item?.vehicles?.length
                                            ? item?.vehicles?.map(
                                                (short, index) => {
                                                  const isLastItem =
                                                    index ===
                                                    item?.vehicles?.length - 1;
                                                  return (
                                                    <React.Fragment key={index}>
                                                      {`${
                                                        short?.short_name
                                                          ? short?.short_name
                                                          : ''
                                                      }`}
                                                      {isLastItem ? '' : ', '}
                                                    </React.Fragment>
                                                  );
                                                }
                                              )
                                            : ''}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        : ''}
                    </div>
                  )}
                  {activeTab === 'Sessions' && (
                    <div className="calendarTaskList">
                      {showSessionsToggle &&
                      selectedDate &&
                      selectedDate?.sessions.length
                        ? selectedDate?.sessions?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className={styles.listBox}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setShowAllInfo(true);
                                  setPopupSideDetailsSessionOpen(true);
                                  setPopupDetailsOpen(true);
                                  setPopupOpen(false);
                                  setShowDriveFilter(false);
                                  setSessionDetailsData(item);
                                  setPopupSideDetailsOpen(false);
                                }}
                              >
                                <div className={styles.blueBox}>
                                  <div className={styles.listCenterTitle}>
                                    <h4 className={styles.listTitle}>
                                      A <span>{item?.dc_name}</span>
                                    </h4>
                                    <h4 className={styles.lisTtime}>
                                      {item?.shifts_data
                                        ?.earliest_shift_start_time
                                        ? `${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.earliest_shift_start_time
                                            )
                                            .local()
                                            .format('HH:mm')} - ${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.latest_shift_return_time
                                            )
                                            .local()
                                            .format('HH:mm')}`
                                        : ''}
                                    </h4>
                                  </div>
                                  <div className={styles.listCenterDescription}>
                                    <p className={styles.description}></p>
                                    <p className={styles.discCount}>
                                      {popupToggleProd
                                        ? item?.projections?.total_product_yield
                                        : item?.projections
                                            ?.total_procedure_type_qty}{' '}
                                      <span>
                                        {item?.staff_setups_count?.length
                                          ? item?.staff_setups_count?.map(
                                              (item, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.staff_setups_count
                                                    ?.length -
                                                    1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${item}`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                      <span>
                                        {item?.vehicles?.length
                                          ? item?.vehicles?.map(
                                              (short, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.vehicles?.length - 1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${
                                                      short?.short_name
                                                        ? short?.short_name
                                                        : ''
                                                    }`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : ''}
                    </div>
                  )}
                  {activeTab === 'Events' && (
                    <div className="calendarTaskList">
                      {showNceToggle && selectedDate && selectedDate?.nce.length
                        ? selectedDate?.nce?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                style={{ cursor: 'pointer' }}
                                className={styles.listBox}
                                onClick={() => {
                                  setNceDetailsData(item);
                                  setPopupSideDetailsNceOpen(true);
                                  setPopupSideDetailsOpen(false);
                                  setShowAllInfo(true);
                                  setPopupDetailsOpen(true);
                                  setPopupOpen(false);
                                  setShowDriveFilter(false);
                                }}
                              >
                                <div className={styles.blueBox}>
                                  <div className={styles.listCenterTitle}>
                                    <h4 className={styles.listTitle}>
                                      A
                                      <span>
                                        {
                                          item?.ncp?.non_collection_profile
                                            ?.name
                                        }
                                      </span>
                                    </h4>
                                    <h4 className={styles.lisTtime}>
                                      {item?.shifts_data
                                        ?.latest_shift_return_time
                                        ? `${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.earliest_shift_start_time
                                            )
                                            .local()
                                            .format('HH:mm')} - ${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.latest_shift_return_time
                                            )
                                            .local()
                                            .format('HH:mm')}`
                                        : ''}
                                    </h4>
                                  </div>
                                  <div className={styles.listCenterDescription}>
                                    <p className={styles.description}></p>
                                    <p className={styles.discCount}>
                                      {popupToggleProd
                                        ? item?.projections?.total_product_yield
                                        : item?.projections
                                            ?.total_procedure_type_qty}{' '}
                                      <span>
                                        {item?.staff_setups_count?.length
                                          ? item?.staff_setups_count?.map(
                                              (item, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.staff_setups_count
                                                    ?.length -
                                                    1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${item}`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                      <span>
                                        {item?.vehicles?.length
                                          ? item?.vehicles?.map(
                                              (short, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.vehicles?.length - 1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${
                                                      short?.short_name
                                                        ? short?.short_name
                                                        : ''
                                                    }`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {popupDetailsOpenDuplicate ? (
        <section
          className={`calendarPoup full-section ${
            showAllInfo ? 'show-info' : 'hide-info'
          } popup ${popupDetailsOpenDuplicate ? 'active' : ''}`}
        >
          <div
            className="popup-inner"
            style={{ maxWidth: '800px', padding: '20px' }}
          >
            <div className="col-md-12">
              <div className={styles.popupHeader}>
                <h3 className={styles.popupTitle} style={{ color: '#005375' }}>
                  {frontDetailData?.account?.name}
                  <br />
                  <span style={{ color: '#000', fontSize: '16px' }}>
                    {moment(frontDetailData?.drive?.date).format(
                      'D MMMM, YYYY'
                    )}
                  </span>
                </h3>
                <button
                  className={styles.popupClose}
                  onClick={() => {
                    setPopupDetailsOpenDuplicate(false);
                    setShowDriveFilter(false);
                  }}
                >
                  <SvgComponent name={'CrossIcon'} />
                </button>
              </div>
              <div className={styles.popupTaskDetail}>
                {/* <h3>
                  Metro High School
                  <span>1 January, 2023</span>
                </h3> */}
                <p className={styles.time}>
                  {frontDetailData?.shifts_data?.earliest_shift_start_time &&
                  frontDetailData?.shifts_data?.latest_shift_return_time
                    ? `${moment
                        .utc(
                          frontDetailData?.shifts_data
                            ?.earliest_shift_start_time
                        )
                        .local()
                        .format('HH:mm')} - ${moment
                        .utc(
                          frontDetailData?.shifts_data?.latest_shift_return_time
                        )
                        .local()
                        .format('HH:mm')}`
                    : ''}{' '}
                  <span>
                    {popupToggleProd
                      ? frontDetailData?.projections?.total_product_yield
                      : frontDetailData?.projections
                          ?.total_procedure_type_qty}{' '}
                  </span>
                </p>
                <div className={styles.popupLocation}>
                  <h4>
                    <span>Location</span>
                    {frontDetailData?.crm_locations?.name}
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Primary Chairperson</span>
                    {frontDetailData?.drive?.drive_contacts &&
                    frontDetailData?.drive?.drive_contacts?.length &&
                    frontDetailData?.drive?.drive_contacts[0]?.role?.name
                      ? frontDetailData?.drive?.drive_contacts[0]?.role?.name
                      : ''}
                  </h4>
                  <h4>
                    <span>Chairperson Phone</span>
                    {frontDetailData?.drive?.drive_contacts &&
                    frontDetailData?.drive?.drive_contacts?.length &&
                    frontDetailData?.drive?.drive_contacts[0]
                      ?.account_contacts[0]?.contactable_data[0]?.data
                      ? frontDetailData?.drive?.drive_contacts[0]
                          ?.account_contacts[0]?.contactable_data[0]?.data
                      : ''}
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Chairperson SMS</span>
                    {frontDetailData?.drive?.drive_contacts &&
                    frontDetailData?.drive?.drive_contacts?.length &&
                    frontDetailData?.drive?.drive_contacts[0]
                      ?.account_contacts[0]?.contactable_data[0]?.data
                      ? frontDetailData?.drive?.drive_contacts[0]
                          ?.account_contacts[0]?.contactable_data[0]?.data
                      : ''}
                  </h4>
                  <h4>
                    <span>Chairperson Email</span>
                    {frontDetailData?.drive?.drive_contacts &&
                    frontDetailData?.drive?.drive_contacts?.length &&
                    frontDetailData?.drive?.drive_contacts[0]
                      ?.account_contacts[0]?.contactable_data[1]?.data
                      ? frontDetailData?.drive?.drive_contacts[0]
                          ?.account_contacts[0]?.contactable_data[1]?.data
                      : ''}
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Recruite</span>
                    {formatUser(frontDetailData?.recruiter, 1)}
                  </h4>
                  <h4>
                    <span>Setup</span>
                    <span>
                      {frontDetailData?.staff_setups_count?.length
                        ? frontDetailData?.staff_setups_count?.map(
                            (item, index) => {
                              const isLastItem =
                                index ===
                                frontDetailData?.staff_setups_count?.length - 1;
                              return (
                                <React.Fragment key={index}>
                                  {`${item}`}
                                  {isLastItem ? '' : ', '}
                                </React.Fragment>
                              );
                            }
                          )
                        : ''}
                    </span>
                    <span>
                      {frontDetailData?.vehicles?.length
                        ? frontDetailData?.vehicles?.map((short, index) => {
                            const isLastItem =
                              index === frontDetailData?.vehicles?.length - 1;
                            return (
                              <React.Fragment key={index}>
                                {`${
                                  short?.short_name ? short?.short_name : ''
                                }`}
                                {short?.short_name
                                  ? isLastItem
                                    ? ''
                                    : ', '
                                  : ''}
                              </React.Fragment>
                            );
                          })
                        : ''}
                    </span>
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Shifts</span>
                    {frontDetailData?.shifts_data?.shifts}
                  </h4>
                  <h4>
                    <span>Linked With</span>
                    Metro Blood...
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>status</span>
                    <button
                      style={{
                        borderRadius: '4px',
                        padding: '0px',
                        height: '25px',
                        lineHeight: '25px',
                        textAlign: 'center',
                        width: '80px',
                        fontSize: '12px',
                      }}
                      className={
                        frontDetailData?.drive?.operation_status_id
                          ?.chip_color === 'Green'
                          ? styles.green
                          : frontDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Yellow'
                          ? styles.yellow
                          : frontDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Red'
                          ? styles.red
                          : frontDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Blue'
                          ? styles.blue
                          : frontDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Grey'
                          ? styles.grey
                          : frontDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Lavender'
                          ? styles.lavendar
                          : styles.green
                      }
                    >
                      {frontDetailData?.drive?.operation_status_id?.name}
                    </button>
                  </h4>
                </div>
                <div className="d-flex justify-content-end">
                  <h4 className="font-size-14px text-primary">
                    {activeTab === 'Drives' && <Link>View Drive</Link>}
                    {activeTab === 'Events' && <Link>View Event</Link>}
                    {activeTab === 'Sessions' && <Link>View Session</Link>}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        ''
      )}
      {popupNceDetailsOpenDuplicate ? (
        <section
          className={`calendarPoup full-section ${
            showAllInfo ? 'show-info' : 'hide-info'
          } popup ${popupNceDetailsOpenDuplicate ? 'active' : ''}`}
        >
          <div
            className="popup-inner"
            style={{ maxWidth: '800px', padding: '20px' }}
          >
            <div className="col-md-12">
              <div className={styles.popupHeader}>
                <h3 className={styles.popupTitle} style={{ color: '#005375' }}>
                  {frontNceDetailData?.ncp?.non_collection_profile?.name}
                  <br />
                  <span style={{ color: '#000', fontSize: '16px' }}>
                    {moment(frontNceDetailData?.date).format('D MMMM, YYYY')}
                  </span>
                </h3>
                <button
                  className={styles.popupClose}
                  onClick={() => {
                    setPopupNceDetailsOpenDuplicate(false);
                    setShowDriveFilter(false);
                  }}
                >
                  <SvgComponent name={'CrossIcon'} />
                </button>
              </div>
              <div className={styles.popupTaskDetail}>
                <p className={styles.time}>
                  {frontNceDetailData?.shifts_data?.earliest_shift_start_time
                    ? `${moment
                        .utc(
                          frontNceDetailData?.shifts_data
                            ?.earliest_shift_start_time
                        )
                        .local()
                        .format('HH:mm')} - ${moment
                        .utc(
                          frontNceDetailData?.shifts_data
                            ?.latest_shift_return_time
                        )
                        .local()
                        .format('HH:mm')}`
                    : ''}{' '}
                  <span>
                    {popupToggleProd
                      ? frontNceDetailData?.projections?.total_product_yield
                      : frontNceDetailData?.projections
                          ?.total_procedure_type_qty}{' '}
                  </span>
                </p>
                <div className={styles.popupLocation}>
                  <h4>
                    <span>Location</span>
                    {frontNceDetailData?.crm_locations?.name}
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Setup</span>
                    <span>
                      {frontNceDetailData?.staff_setups_count?.length
                        ? frontNceDetailData?.staff_setups_count?.map(
                            (item, index) => {
                              const isLastItem =
                                index ===
                                frontNceDetailData?.staff_setups_count?.length -
                                  1;
                              return (
                                <React.Fragment key={index}>
                                  {`${item}`}
                                  {isLastItem ? '' : ', '}
                                </React.Fragment>
                              );
                            }
                          )
                        : ''}
                    </span>
                    <span>
                      {frontNceDetailData?.vehicles?.length
                        ? frontNceDetailData?.vehicles?.map((short, index) => {
                            const isLastItem =
                              index ===
                              frontNceDetailData?.vehicles?.length - 1;
                            return (
                              <React.Fragment key={index}>
                                {`${
                                  short?.short_name ? short?.short_name : ''
                                }`}
                                {short?.short_name
                                  ? isLastItem
                                    ? ''
                                    : ', '
                                  : ''}
                              </React.Fragment>
                            );
                          })
                        : ''}
                    </span>
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Shifts</span>
                    {frontNceDetailData?.shifts_data?.shifts}
                  </h4>
                  <h4>
                    <span>Linked With</span>
                    Metro Blood...
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>status</span>
                    <button
                      style={{
                        borderRadius: '4px',
                        padding: '0px',
                        height: '25px',
                        lineHeight: '25px',
                        textAlign: 'center',
                        width: '80px',
                        fontSize: '12px',
                      }}
                      className={
                        frontNceDetailData?.drive?.operation_status_id
                          ?.chip_color === 'Green'
                          ? styles.green
                          : frontNceDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Yellow'
                          ? styles.yellow
                          : frontNceDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Red'
                          ? styles.red
                          : frontNceDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Blue'
                          ? styles.blue
                          : frontNceDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Grey'
                          ? styles.grey
                          : frontNceDetailData?.drive?.operation_status_id
                              ?.chip_color === 'Lavender'
                          ? styles.lavendar
                          : styles.green
                      }
                    >
                      {frontNceDetailData?.status?.operation_status_id?.name}
                    </button>
                  </h4>
                </div>
                <div className="d-flex justify-content-end">
                  <h4 className="font-size-14px text-primary">
                    {activeTab === 'Drives' && <Link>View Drive</Link>}
                    {activeTab === 'Events' && <Link>View Event</Link>}
                    {activeTab === 'Sessions' && <Link>View Session</Link>}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        ''
      )}
      {popupSessionDetailsOpenDuplicate ? (
        <section
          className={`calendarPoup full-section ${
            showAllInfo ? 'show-info' : 'hide-info'
          } popup ${popupSessionDetailsOpenDuplicate ? 'active' : ''}`}
        >
          <div
            className="popup-inner"
            style={{ maxWidth: '800px', padding: '20px' }}
          >
            <div className="col-md-12">
              <div className={styles.popupHeader}>
                <h3 className={styles.popupTitle} style={{ color: '#005375' }}>
                  {frontSessionDetailData?.dc_name}
                  <br />
                  <span style={{ color: '#000', fontSize: '16px' }}>
                    {moment(frontSessionDetailData?.sessions_date).format(
                      'D MMMM, YYYY'
                    )}
                  </span>
                </h3>
                <button
                  className={styles.popupClose}
                  onClick={() => {
                    setPopupSessionDetailsOpenDuplicate(false);
                    setShowDriveFilter(false);
                  }}
                >
                  <SvgComponent name={'CrossIcon'} />
                </button>
              </div>
              <div className={styles.popupTaskDetail}>
                {/* <h3>
                  Metro High School
                  <span>1 January, 2023</span>
                </h3> */}
                <p className={styles.time}>
                  {frontSessionDetailData?.shifts_data
                    ?.earliest_shift_start_time
                    ? `${moment
                        .utc(
                          frontSessionDetailData?.shifts_data
                            ?.earliest_shift_start_time
                        )
                        .local()
                        .format('HH:mm')} - ${moment
                        .utc(
                          frontSessionDetailData?.shifts_data
                            ?.latest_shift_return_time
                        )
                        .local()
                        .format('HH:mm')}`
                    : ''}{' '}
                  <span>
                    {popupToggleProd
                      ? frontSessionDetailData?.projections?.total_product_yield
                      : frontSessionDetailData?.projections
                          ?.total_procedure_type_qty}{' '}
                  </span>
                </p>
                <div className={styles.popupLocation}>
                  <h4>
                    <span>Facility Name</span>
                    {frontSessionDetailData?.dc_name}
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Setup</span>
                    <span>
                      {frontSessionDetailData?.staff_setups_count?.length
                        ? frontSessionDetailData?.staff_setups_count?.map(
                            (item, index) => {
                              const isLastItem =
                                index ===
                                frontSessionDetailData?.staff_setups_count
                                  ?.length -
                                  1;
                              return (
                                <React.Fragment key={index}>
                                  {`${item}`}
                                  {isLastItem ? '' : ', '}
                                </React.Fragment>
                              );
                            }
                          )
                        : ''}
                    </span>
                    <span>
                      {frontSessionDetailData?.vehicles?.length
                        ? frontSessionDetailData?.vehicles?.map(
                            (short, index) => {
                              const isLastItem =
                                index ===
                                frontSessionDetailData?.vehicles?.length - 1;
                              return (
                                <React.Fragment key={index}>
                                  {`${
                                    short?.short_name ? short?.short_name : ''
                                  }`}
                                  {short?.short_name
                                    ? isLastItem
                                      ? ''
                                      : ', '
                                    : ''}
                                </React.Fragment>
                              );
                            }
                          )
                        : ''}
                    </span>
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>Shifts</span>
                    {frontSessionDetailData?.shifts_data?.shifts}
                  </h4>
                  <h4>
                    <span>Linked With</span>
                    Metro Blood...
                  </h4>
                </div>
                <div className="d-flex two-col">
                  <h4>
                    <span>status</span>
                    <button
                      style={{
                        borderRadius: '4px',
                        padding: '0px',
                        height: '25px',
                        lineHeight: '25px',
                        textAlign: 'center',
                        width: '80px',
                        fontSize: '12px',
                      }}
                      className={
                        frontSessionDetailData?.oc_chip_color === 'Green'
                          ? styles.green
                          : frontSessionDetailData?.oc_chip_color === 'Yellow'
                          ? styles.yellow
                          : frontSessionDetailData?.oc_chip_color === 'Red'
                          ? styles.red
                          : frontSessionDetailData?.oc_chip_color === 'Blue'
                          ? styles.blue
                          : frontSessionDetailData?.oc_chip_color === 'Grey'
                          ? styles.grey
                          : frontSessionDetailData?.oc_chip_color === 'Lavender'
                          ? styles.lavendar
                          : styles.green
                      }
                    >
                      {frontSessionDetailData?.oc_name}
                    </button>
                  </h4>
                </div>
                <div className="d-flex justify-content-end">
                  <h4 className="font-size-14px text-primary">
                    {activeTab === 'Drives' && <Link>View Drive</Link>}
                    {activeTab === 'Events' && <Link>View Event</Link>}
                    {activeTab === 'Sessions' && <Link>View Session</Link>}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        ''
      )}
      {popupDetailsOpen ? (
        <section
          className={`calendarPoup full-section ${
            showAllInfo ? 'show-info' : 'hide-info'
          } popup ${popupDetailsOpen ? 'active' : ''}`}
        >
          <div
            className="popup-inner"
            style={{
              maxWidth:
                popupSideDetailsOpen ||
                popupSideDetailsNceOpen ||
                popupSideDetailsSessionOpen
                  ? '1050px'
                  : '800px',
            }}
          >
            <div className="content">
              <div className={styles.popupHeader}>
                <h3 className={styles.popupTitle}>
                  {moment(selectedDate.date).format('dddd, D MMMM, YYYY')}
                </h3>
                <button
                  className={styles.popupClose}
                  onClick={() => {
                    setPopupDetailsOpen(false);
                    setShowDriveFilter(false);
                  }}
                >
                  <SvgComponent name={'CrossIcon'} />
                </button>
              </div>
              <div className="row">
                <div
                  className={
                    popupSideDetailsOpen ||
                    popupSideDetailsNceOpen ||
                    popupSideDetailsSessionOpen
                      ? 'col-md-4'
                      : 'col-md-7'
                  }
                >
                  <div className="d-flex justify-content-between mb-4">
                    <h4 className={styles.innerTitle}>Over Goal</h4>
                    <span
                      onClick={() => setPopupToggleProd(!popupToggleProd)}
                      className={styles.linkPopup}
                      style={{ cursor: 'pointer' }}
                    >
                      {popupToggleProd
                        ? 'View as Procedures'
                        : 'View as Products'}
                    </span>
                  </div>
                  <div className={styles.headerBTN}>
                    {showAvailableDateToggle && (
                      <>
                        <button className={styles.smallBtn}>
                          <SvgComponent name={'CalendarDirectionIcon'} />
                        </button>
                        <button className={styles.smallBtn}>
                          <SvgComponent name={'CalendarHumidityIcon'} />
                        </button>
                      </>
                    )}

                    {showCurrentLintToggle && (
                      <button className={styles.smallBtn}>
                        <SvgComponent name={'CalendarLinkIcon'} />
                      </button>
                    )}

                    <button className={styles.smallBtn}>
                      <SvgComponent name={'CalendarLockIcon'} />
                    </button>
                    <button className={styles.smallBtn}>
                      <ToolTip
                        className={styles.toolTip}
                        text1={`Shared Staff: ${selectedDate?.net_total_shared_staff}`}
                        text2={`Shared Vehicles: ${selectedDate?.net_total_shared_vehicles}`}
                        text3={`Shared Devices: ${selectedDate?.net_total_shared_devices}`}
                        icon={<SvgComponent name={'CalendarMoveDownIcon'} />}
                      />
                      &nbsp;10
                    </button>
                  </div>
                  <div className={styles.taskDetails}>
                    <h3>
                      <span>Goal</span>
                      {popupToggleProd
                        ? selectedDate.goal_procedures
                        : selectedDate?.goal_products}
                    </h3>
                    <h3>
                      <span>Scheduled</span>
                      {popupToggleProd
                        ? selectedDate.scheduled_procedures
                        : selectedDate?.scheduled_products}
                    </h3>
                    <h3>
                      <span>Actual</span>
                      {popupToggleProd
                        ? selectedDate.actual_procedures
                        : selectedDate?.actual_products}
                    </h3>
                    <br />
                    <h3>
                      <span>PA</span>
                      {popupToggleProd
                        ? selectedDate.scheduled_products !== 0
                          ? `${parseInt(
                              (selectedDate?.actual_products /
                                selectedDate.scheduled_products) *
                                100,
                              10
                            )}%`
                          : '0%'
                        : selectedDate.scheduled_procedures !== 0
                        ? `${parseInt(
                            (selectedDate.actual_procedures /
                              selectedDate.scheduled_procedures) *
                              100,
                            10
                          )}%`
                        : '0%'}
                    </h3>
                    <h3>
                      <span>PG</span>
                      {popupToggleProd
                        ? selectedDate.goal_products !== 0
                          ? `${parseInt(
                              (selectedDate?.actual_products /
                                selectedDate.goal_products) *
                                100,
                              10
                            )}%`
                          : '0%'
                        : selectedDate.goal_procedures !== 0
                        ? `${parseInt(
                            (selectedDate.actual_procedures /
                              selectedDate.goal_procedures) *
                              100,
                            10
                          )}%`
                        : '0%'}
                    </h3>
                  </div>
                  <div className={styles.progress}>
                    <div>
                      <h4>Staff</h4>
                      <h3>{`${selectedDate?.staff_booked}/${selectedDate?.staff_available}`}</h3>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressRed}
                          style={{
                            maxWidth: `${
                              selectedDate?.staff_booked === 0 &&
                              selectedDate?.staff_booked === 0
                                ? '0'
                                : (selectedDate?.staff_booked /
                                    selectedDate?.staff_available) *
                                  100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h4>Vehicles</h4>
                      <h3>{`${selectedDate?.vehicles_booked}/${selectedDate?.vehicles_available}`}</h3>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressGreen}
                          style={{
                            maxWidth: `${
                              selectedDate?.vehicles_booked === 0 &&
                              selectedDate?.vehicles_available === 0
                                ? '0'
                                : (selectedDate?.vehicles_booked /
                                    selectedDate?.vehicles_available) *
                                  100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h4>Devices</h4>
                      <h3>{`${selectedDate?.devices_booked}/${selectedDate?.devices_available}`}</h3>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressYellow}
                          style={{
                            maxWidth: `${
                              selectedDate?.devices_booked === 0 &&
                              selectedDate?.devices_available === 0
                                ? '0'
                                : (selectedDate?.devices_booked /
                                    selectedDate?.devices_available) *
                                  100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.popupTask}>
                    <p>
                      <strong>Tasks</strong>
                    </p>
                    {selectedDate?.drives?.map((item) => {
                      return item?.task_names && item?.task_names?.length
                        ? item?.task_names?.map((items, index) => {
                            return <p key={index}>{items?.name}</p>;
                          })
                        : '';
                    })}
                    {selectedDate?.sessions?.map((item) => {
                      return item?.task_names && item?.task_names?.length
                        ? item?.task_names?.map((items, index) => {
                            return <p key={index}>{items?.name}</p>;
                          })
                        : '';
                    })}
                    {selectedDate?.nce?.map((item) => {
                      return item?.task_names && item?.task_names?.length
                        ? item?.task_names?.map((items, index) => {
                            return <p key={index}>{items?.name}</p>;
                          })
                        : '';
                    })}
                    {/* <p>Name of Task 1</p>
                    <p>Name of Task 2</p>
                    <p>Name of Task 3</p>
                    <p>Name of Task 4</p>
                    <p>Name of Task 5</p>
                    <p>Name of Task 6</p> */}
                  </div>
                </div>
                <div
                  className={
                    popupSideDetailsOpen ||
                    popupSideDetailsNceOpen ||
                    popupSideDetailsSessionOpen
                      ? 'col-md-4'
                      : 'col-md-5'
                  }
                >
                  <div className={styles.headerPopupRight}>
                    <div className={styles.popupAccordion}>
                      <button
                        className={activeTab === 'Drives' ? styles.active : ''}
                        onClick={() => handleClick('Drives')}
                      >
                        Drives
                      </button>
                      <button
                        className={
                          activeTab === 'Sessions' ? styles.active : ''
                        }
                        onClick={() => handleClick('Sessions')}
                      >
                        Sessions
                      </button>
                      <button
                        className={activeTab === 'Events' ? styles.active : ''}
                        onClick={() => handleClick('Events')}
                      >
                        Events
                      </button>
                    </div>
                    <div className={styles.popupRight}>
                      <button
                        onClick={() => {
                          setShowDriveFilter((prev) => !prev);
                        }}
                      >
                        <SvgComponent name={'CalendarSortIcon'} />
                      </button>
                      <ul
                        className={`dropdown-menu claendar-dropdown ${
                          showDriveFilters ? 'show' : ''
                        }`}
                      >
                        <li>
                          <a href="#" className="dropdown-item">
                            Account Name
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item">
                            Account Name (Z-A)
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item">
                            Operation Type
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item">
                            Depart Time
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item">
                            Return Time
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item">
                            Projection
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item">
                            Status
                          </a>
                        </li>
                      </ul>
                      <button>
                        <SvgComponent name={'CalendarSortIconTwo'} />
                      </button>
                    </div>
                  </div>
                  {activeTab === 'Drives' && (
                    <div className="calendarTaskList">
                      {selectedDate && selectedDate?.drives.length
                        ? selectedDate?.drives
                            ?.filter((item) => {
                              if (
                                !showDriveInsideToggle &&
                                item.crm_locations.site_type === 'Inside'
                              ) {
                                return false;
                              }

                              if (
                                !showDriveOutsideToggle &&
                                item.crm_locations.site_type === 'Outside'
                              ) {
                                return false;
                              }

                              return true;
                            })
                            ?.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  style={{ cursor: 'pointer' }}
                                  className={styles.listBox}
                                  onClick={() => {
                                    setDriveDetailsData(item);
                                    setShowAllInfo(true);
                                    setPopupDetailsOpen(true);
                                    setPopupOpen(false);
                                    setShowDriveFilter(false);
                                    setPopupSideDetailsOpen(true);
                                    setPopupSideDetailsNceOpen(false);
                                  }}
                                >
                                  <div className={styles.blueBox}>
                                    <div className={styles.listCenterTitle}>
                                      <h4 className={styles.listTitle}>
                                        A <span>{item?.account?.name}</span>
                                      </h4>
                                      <h4 className={styles.lisTtime}>
                                        {item?.shifts_data
                                          ?.earliest_shift_start_time
                                          ? `${moment
                                              .utc(
                                                item?.shifts_data
                                                  ?.earliest_shift_start_time
                                              )
                                              .local()
                                              .format('HH:mm')} - ${moment
                                              .utc(
                                                item?.shifts_data
                                                  ?.latest_shift_return_time
                                              )
                                              .local()
                                              .format('HH:mm')}`
                                          : ''}
                                      </h4>
                                    </div>
                                    <div
                                      className={styles.listCenterDescription}
                                    >
                                      <p className={styles.description}>
                                        {item?.recruiter
                                          ? formatUser(item?.recruiter, 1)
                                          : ''}
                                      </p>
                                      <p className={styles.discCount}>
                                        {popupToggleProd
                                          ? item?.projections
                                              ?.total_product_yield
                                          : item?.projections
                                              ?.total_procedure_type_qty}{' '}
                                        <span>
                                          {item?.staff_setups_count?.length
                                            ? item?.staff_setups_count?.map(
                                                (item, index) => {
                                                  const isLastItem =
                                                    index ===
                                                    item?.staff_setups_count
                                                      ?.length -
                                                      1;
                                                  return (
                                                    <React.Fragment key={index}>
                                                      {`${item}`}
                                                      {isLastItem ? '' : ', '}
                                                    </React.Fragment>
                                                  );
                                                }
                                              )
                                            : ''}
                                        </span>
                                        <span>
                                          {item?.vehicles?.length
                                            ? item?.vehicles?.map(
                                                (short, index) => {
                                                  const isLastItem =
                                                    index ===
                                                    item?.vehicles?.length - 1;
                                                  return (
                                                    <React.Fragment key={index}>
                                                      {`${
                                                        short?.short_name
                                                          ? short?.short_name
                                                          : ''
                                                      }`}
                                                      {short?.short_name
                                                        ? isLastItem
                                                          ? ''
                                                          : ', '
                                                        : ''}
                                                    </React.Fragment>
                                                  );
                                                }
                                              )
                                            : ''}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        : ''}
                    </div>
                  )}
                  {activeTab === 'Sessions' && (
                    <div className="calendarTaskList">
                      {showSessionsToggle &&
                      selectedDate &&
                      selectedDate?.sessions.length
                        ? selectedDate?.sessions?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className={styles.listBox}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setShowAllInfo(true);
                                  setPopupSideDetailsSessionOpen(true);
                                  setPopupDetailsOpen(true);
                                  setPopupOpen(false);
                                  setShowDriveFilter(false);
                                  setSessionDetailsData(item);
                                  setPopupSideDetailsOpen(false);
                                }}
                              >
                                <div className={styles.blueBox}>
                                  <div className={styles.listCenterTitle}>
                                    <h4 className={styles.listTitle}>
                                      A <span>{item?.dc_name}</span>
                                    </h4>
                                    <h4 className={styles.lisTtime}>
                                      {item?.shifts_data
                                        ?.earliest_shift_start_time
                                        ? `${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.earliest_shift_start_time
                                            )
                                            .local()
                                            .format('HH:mm')} - ${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.latest_shift_return_time
                                            )
                                            .local()
                                            .format('HH:mm')}`
                                        : ''}
                                    </h4>
                                  </div>
                                  <div className={styles.listCenterDescription}>
                                    <p className={styles.description}></p>
                                    <p className={styles.discCount}>
                                      {popupToggleProd
                                        ? item?.projections?.total_product_yield
                                        : item?.projections
                                            ?.total_procedure_type_qty}{' '}
                                      <span>
                                        {item?.staff_setups_count?.length
                                          ? item?.staff_setups_count?.map(
                                              (item, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.staff_setups_count
                                                    ?.length -
                                                    1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${item}`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                      <span>
                                        {item?.vehicles?.length
                                          ? item?.vehicles?.map(
                                              (short, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.vehicles?.length - 1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${
                                                      short?.short_name
                                                        ? short?.short_name
                                                        : ''
                                                    }`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : ''}
                    </div>
                  )}
                  {activeTab === 'Events' && (
                    <div className="calendarTaskList">
                      {showNceToggle && selectedDate && selectedDate?.nce.length
                        ? selectedDate?.nce?.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className={styles.listBox}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setNceDetailsData(item);
                                  setShowAllInfo(true);
                                  setPopupDetailsOpen(true);
                                  setPopupOpen(false);
                                  setShowDriveFilter(false);
                                  setPopupSideDetailsNceOpen(true);
                                  setPopupSideDetailsOpen(false);
                                }}
                              >
                                <div className={styles.blueBox}>
                                  <div className={styles.listCenterTitle}>
                                    <h4 className={styles.listTitle}>
                                      A
                                      <span>
                                        {
                                          item?.ncp?.non_collection_profile
                                            ?.name
                                        }
                                      </span>
                                    </h4>
                                    <h4 className={styles.lisTtime}>
                                      {item?.shifts_data
                                        ?.latest_shift_return_time
                                        ? `${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.earliest_shift_start_time
                                            )
                                            .local()
                                            .format('HH:mm')} - ${moment
                                            .utc(
                                              item?.shifts_data
                                                ?.latest_shift_return_time
                                            )
                                            .local()
                                            .format('HH:mm')}`
                                        : ''}
                                    </h4>
                                  </div>
                                  <div className={styles.listCenterDescription}>
                                    <p className={styles.description}></p>
                                    <p className={styles.discCount}>
                                      {popupToggleProd
                                        ? item?.projections?.total_product_yield
                                        : item?.projections
                                            ?.total_procedure_type_qty}{' '}
                                      <span>
                                        {item?.staff_setups_count?.length
                                          ? item?.staff_setups_count?.map(
                                              (item, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.staff_setups_count
                                                    ?.length -
                                                    1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${item}`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                      <span>
                                        {item?.vehicles?.length
                                          ? item?.vehicles?.map(
                                              (short, index) => {
                                                const isLastItem =
                                                  index ===
                                                  item?.vehicles?.length - 1;
                                                return (
                                                  <React.Fragment key={index}>
                                                    {`${
                                                      short?.short_name
                                                        ? short?.short_name
                                                        : ''
                                                    }`}
                                                    {isLastItem ? '' : ', '}
                                                  </React.Fragment>
                                                );
                                              }
                                            )
                                          : ''}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : ''}
                    </div>
                  )}
                </div>
                {popupSideDetailsOpen && (
                  <div className="col-md-4">
                    <div className={styles.popupTaskDetail}>
                      <h3>
                        {driveDetailsData?.account?.name}
                        <span>
                          {moment(driveDetailsData?.drive?.date).format(
                            'D MMMM, YYYY'
                          )}
                        </span>
                      </h3>
                      <p className={styles.time}>
                        {driveDetailsData?.shifts_data
                          ?.earliest_shift_start_time
                          ? `${moment
                              .utc(
                                driveDetailsData?.shifts_data
                                  ?.earliest_shift_start_time
                              )
                              .local()
                              .format('HH:mm')} - ${moment
                              .utc(
                                driveDetailsData?.shifts_data
                                  ?.latest_shift_return_time
                              )
                              .local()
                              .format('HH:mm')}`
                          : ''}{' '}
                        <span>
                          {popupToggleProd
                            ? driveDetailsData?.projections?.total_product_yield
                            : driveDetailsData?.projections
                                ?.total_procedure_type_qty}{' '}
                        </span>
                      </p>
                      <div className={styles.popupLocation}>
                        <h4>
                          <span>Location</span>
                          {driveDetailsData?.crm_locations?.name}
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Primary Chairperson</span>
                          {driveDetailsData?.drive?.drive_contacts &&
                          driveDetailsData?.drive?.drive_contacts.length
                            ? driveDetailsData?.drive?.drive_contacts[0]?.role
                                ?.name
                            : ''}
                        </h4>
                        <h4>
                          <span>Chairperson Phone</span>
                          {driveDetailsData?.drive?.drive_contacts &&
                          driveDetailsData?.drive?.drive_contacts.length &&
                          driveDetailsData?.drive?.drive_contacts[0]
                            ?.account_contacts.length
                            ? driveDetailsData?.drive?.drive_contacts[0]
                                ?.account_contacts[0]?.contactable_data[0]?.data
                            : ''}
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Chairperson SMS</span>
                          {driveDetailsData?.drive?.drive_contacts &&
                          driveDetailsData?.drive?.drive_contacts.length &&
                          driveDetailsData?.drive?.drive_contacts[0]
                            ?.account_contacts.length
                            ? driveDetailsData?.drive?.drive_contacts[0]
                                ?.account_contacts[0]?.contactable_data[0]?.data
                            : ''}
                        </h4>
                        <h4>
                          <span>Chairperson Email</span>
                          {driveDetailsData?.drive?.drive_contacts &&
                          driveDetailsData?.drive?.drive_contacts.length &&
                          driveDetailsData?.drive?.drive_contacts[0]
                            ?.account_contacts.length
                            ? driveDetailsData?.drive?.drive_contacts[0]
                                ?.account_contacts[0]?.contactable_data[1]?.data
                            : ''}
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Recruite</span>
                          {formatUser(driveDetailsData?.recruiter, 1)}
                        </h4>
                        <h4>
                          <span>Setup</span>
                          <span>
                            {driveDetailsData?.staff_setups_count?.length
                              ? driveDetailsData?.staff_setups_count?.map(
                                  (item, index) => {
                                    const isLastItem =
                                      index ===
                                      driveDetailsData?.staff_setups_count
                                        ?.length -
                                        1;
                                    return (
                                      <React.Fragment key={index}>
                                        {`${item}`}
                                        {isLastItem ? '' : ', '}
                                      </React.Fragment>
                                    );
                                  }
                                )
                              : ''}
                          </span>
                          <span>
                            {driveDetailsData?.vehicles?.length
                              ? driveDetailsData?.vehicles?.map(
                                  (short, index) => {
                                    const isLastItem =
                                      index ===
                                      driveDetailsData?.vehicles?.length - 1;
                                    return (
                                      <React.Fragment key={index}>
                                        {`${
                                          short?.short_name
                                            ? short?.short_name
                                            : ''
                                        }`}
                                        {short?.short_name
                                          ? isLastItem
                                            ? ''
                                            : ', '
                                          : ''}
                                      </React.Fragment>
                                    );
                                  }
                                )
                              : ''}
                          </span>
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Shifts</span>
                          {driveDetailsData?.shifts_data?.shifts}
                        </h4>
                        <h4>
                          <span>Linked With</span>
                          Metro Blood...
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>status</span>
                          <button
                            style={{
                              borderRadius: '4px',
                              padding: '0px',
                              height: '25px',
                              lineHeight: '25px',
                              textAlign: 'center',
                              width: '80px',
                              fontSize: '12px',
                            }}
                            className={
                              driveDetailsData?.drive?.operation_status_id
                                ?.chip_color === 'Green'
                                ? styles.green
                                : driveDetailsData?.drive?.operation_status_id
                                    ?.chip_color === 'Yellow'
                                ? styles.yellow
                                : driveDetailsData?.drive?.operation_status_id
                                    ?.chip_color === 'Red'
                                ? styles.red
                                : driveDetailsData?.drive?.operation_status_id
                                    ?.chip_color === 'Blue'
                                ? styles.blue
                                : driveDetailsData?.drive?.operation_status_id
                                    ?.chip_color === 'Grey'
                                ? styles.grey
                                : driveDetailsData?.drive?.operation_status_id
                                    ?.chip_color === 'Lavender'
                                ? styles.lavendar
                                : styles.green
                            }
                          >
                            {driveDetailsData?.drive?.operation_status_id?.name}
                          </button>
                        </h4>
                      </div>
                      <div className="d-flex justify-content-end">
                        <h4 className="font-size-14px text-primary">
                          {activeTab === 'Drives' && <Link>View Drive</Link>}
                          {activeTab === 'Events' && <Link>View Event</Link>}
                          {activeTab === 'Sessions' && (
                            <Link>View Session</Link>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>
                )}
                {popupSideDetailsNceOpen && (
                  <div className="col-md-4">
                    <div className={styles.popupTaskDetail}>
                      <h3>
                        {nceDetailsData?.ncp?.non_collection_profile?.name}
                        <span>
                          {moment(nceDetailsData?.date).format('D MMMM, YYYY')}
                        </span>
                      </h3>
                      <p className={styles.time}>
                        {nceDetailsData?.shifts_data?.earliest_shift_start_time
                          ? `${moment
                              .utc(
                                nceDetailsData?.shifts_data
                                  ?.earliest_shift_start_time
                              )
                              .local()
                              .format('HH:mm')} - ${moment
                              .utc(
                                nceDetailsData?.shifts_data
                                  ?.latest_shift_return_time
                              )
                              .local()
                              .format('HH:mm')}`
                          : ''}{' '}
                        <span>
                          {popupToggleProd
                            ? nceDetailsData?.projections?.total_product_yield
                            : nceDetailsData?.projections
                                ?.total_procedure_type_qty}{' '}
                        </span>
                      </p>
                      <div className={styles.popupLocation}>
                        <h4>
                          <span>Location</span>
                          {nceDetailsData?.crm_locations?.name}
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Setup</span>
                          <span>
                            {nceDetailsData?.staff_setups_count?.length
                              ? nceDetailsData?.staff_setups_count?.map(
                                  (item, index) => {
                                    const isLastItem =
                                      index ===
                                      nceDetailsData?.staff_setups_count
                                        ?.length -
                                        1;
                                    return (
                                      <React.Fragment key={index}>
                                        {`${item}`}
                                        {isLastItem ? '' : ', '}
                                      </React.Fragment>
                                    );
                                  }
                                )
                              : ''}
                          </span>
                          <span>
                            {nceDetailsData?.vehicles?.length
                              ? nceDetailsData?.vehicles?.map(
                                  (short, index) => {
                                    const isLastItem =
                                      index ===
                                      nceDetailsData?.vehicles?.length - 1;
                                    return (
                                      <React.Fragment key={index}>
                                        {`${
                                          short?.short_name
                                            ? short?.short_name
                                            : ''
                                        }`}
                                        {short?.short_name
                                          ? isLastItem
                                            ? ''
                                            : ', '
                                          : ''}
                                      </React.Fragment>
                                    );
                                  }
                                )
                              : ''}
                          </span>
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Shifts</span>
                          {nceDetailsData?.shifts_data?.shifts}
                        </h4>
                        <h4>
                          <span>Linked With</span>
                          Metro Blood...
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>status</span>
                          <button
                            style={{
                              borderRadius: '4px',
                              padding: '0px',
                              height: '25px',
                              lineHeight: '25px',
                              textAlign: 'center',
                              width: '80px',
                              fontSize: '12px',
                            }}
                            className={
                              nceDetailsData?.status?.operation_status_id
                                ?.chip_color === 'Green'
                                ? styles.green
                                : nceDetailsData?.status?.operation_status_id
                                    ?.chip_color === 'Yellow'
                                ? styles.yellow
                                : nceDetailsData?.status?.operation_status_id
                                    ?.chip_color === 'Red'
                                ? styles.red
                                : nceDetailsData?.status?.operation_status_id
                                    ?.chip_color === 'Blue'
                                ? styles.blue
                                : nceDetailsData?.status?.operation_status_id
                                    ?.chip_color === 'Grey'
                                ? styles.grey
                                : nceDetailsData?.status?.operation_status_id
                                    ?.chip_color === 'Lavender'
                                ? styles.lavendar
                                : styles.green
                            }
                          >
                            {nceDetailsData?.status.operation_status_id?.name}
                          </button>
                        </h4>
                      </div>
                      <div className="d-flex justify-content-end">
                        <h4 className="font-size-14px text-primary">
                          {activeTab === 'Drives' && <Link>View Drive</Link>}
                          {activeTab === 'Events' && <Link>View Event</Link>}
                          {activeTab === 'Sessions' && (
                            <Link>View Session</Link>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>
                )}
                {popupSideDetailsSessionOpen && (
                  <div className="col-md-4">
                    <div className={styles.popupTaskDetail}>
                      <h3>
                        {sessionDetailsData?.dc_name}
                        <span>
                          {moment(sessionDetailsData?.sessions_date).format(
                            'D MMMM, YYYY'
                          )}
                        </span>
                      </h3>
                      <p className={styles.time}>
                        {sessionDetailsData?.shifts_data
                          ?.earliest_shift_start_time
                          ? `${moment
                              .utc(
                                sessionDetailsData?.shifts_data
                                  ?.earliest_shift_start_time
                              )
                              .local()
                              .format('HH:mm')} - ${moment
                              .utc(
                                sessionDetailsData?.shifts_data
                                  ?.latest_shift_return_time
                              )
                              .local()
                              .format('HH:mm')}`
                          : ''}{' '}
                        <span>
                          {popupToggleProd
                            ? sessionDetailsData?.projections
                                ?.total_product_yield
                            : sessionDetailsData?.projections
                                ?.total_procedure_type_qty}{' '}
                        </span>
                      </p>
                      <div className={styles.popupLocation}>
                        <h4>
                          <span>Facility Name</span>
                          {sessionDetailsData?.dc_name}
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Setup</span>
                          <span>
                            {sessionDetailsData?.staff_setups_count?.length
                              ? sessionDetailsData?.staff_setups_count?.map(
                                  (item, index) => {
                                    const isLastItem =
                                      index ===
                                      sessionDetailsData?.staff_setups_count
                                        ?.length -
                                        1;
                                    return (
                                      <React.Fragment key={index}>
                                        {`${item}`}
                                        {isLastItem ? '' : ', '}
                                      </React.Fragment>
                                    );
                                  }
                                )
                              : ''}
                          </span>
                          <span>
                            {sessionDetailsData?.vehicles?.length
                              ? sessionDetailsData?.vehicles?.map(
                                  (short, index) => {
                                    const isLastItem =
                                      index ===
                                      sessionDetailsData?.vehicles?.length - 1;
                                    return (
                                      <React.Fragment key={index}>
                                        {`${
                                          short?.short_name
                                            ? short?.short_name
                                            : ''
                                        }`}
                                        {short?.short_name
                                          ? isLastItem
                                            ? ''
                                            : ', '
                                          : ''}
                                      </React.Fragment>
                                    );
                                  }
                                )
                              : ''}
                          </span>
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>Shifts</span>
                          {sessionDetailsData?.shifts_data?.shifts}
                        </h4>
                        <h4>
                          <span>Linked With</span>
                          Metro Blood...
                        </h4>
                      </div>
                      <div className="d-flex two-col">
                        <h4>
                          <span>status</span>
                          <button
                            style={{
                              borderRadius: '4px',
                              padding: '0px',
                              height: '25px',
                              lineHeight: '25px',
                              textAlign: 'center',
                              width: '80px',
                              fontSize: '12px',
                            }}
                            className={
                              sessionDetailsData?.oc_chip_color === 'Green'
                                ? styles.green
                                : sessionDetailsData?.oc_chip_color === 'Yellow'
                                ? styles.yellow
                                : sessionDetailsData?.oc_chip_color === 'Red'
                                ? styles.red
                                : sessionDetailsData?.oc_chip_color === 'Blue'
                                ? styles.blue
                                : sessionDetailsData?.oc_chip_color === 'Grey'
                                ? styles.grey
                                : sessionDetailsData?.oc_chip_color ===
                                  'Lavender'
                                ? styles.lavendar
                                : styles.green
                            }
                          >
                            {sessionDetailsData?.oc_name}
                          </button>
                        </h4>
                      </div>
                      <div className="d-flex justify-content-end">
                        <h4 className="font-size-14px text-primary">
                          {activeTab === 'Drives' && <Link>View Drive</Link>}
                          {activeTab === 'Events' && <Link>View Event</Link>}
                          {activeTab === 'Sessions' && (
                            <Link>View Session</Link>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
