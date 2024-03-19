import React, { useEffect, useMemo, useRef, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useParams, useSearchParams } from 'react-router-dom';
import styles from './index.module.scss';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { isEmpty } from 'lodash';
import SelectDropdown from '../../../../../common/selectDropdown';
import {
  makeAuthorizedApiRequestAxios,
  makeAuthorizedApiRequest,
} from '../../../../../../helpers/Api';
import { toast } from 'react-toastify';
import FormInput from '../../../../../common/form/FormInput';
import FormToggle from '../../../../../common/form/FormToggle';
import moment from 'moment';
import { DAILY_GOALS_CALENDAR } from '../../../../../../routes/path';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import WarningModalPopUp from '../../../../../common/warningModal';

const EditGoalsCalender = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [save, setSave] = useState('save');
  const [procedureType, setProcedureType] = useState('');
  const [procedureTypeData, setProcedureTypeData] = useState([]);
  const [collectionOperation, setCollectionOperation] = useState('');
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [searchParams] = useSearchParams();
  const currentYear = new Date().getFullYear();
  const [collectionOperationGoal, setCollectionOperationGoal] = useState();
  const [adjustedGoal, setAdjustedGoal] = useState();
  const [lockingDiffrence, setLockingDiffrence] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const debouncedFetch = useRef(null);
  const years = Array.from({ length: 51 }, (_, index) => {
    return {
      label: (currentYear + index).toString(),
      value: (currentYear + index).toString(),
    };
  });
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [months] = useState([
    {
      value: 0,
      label: 'January',
    },
    {
      value: 1,
      label: 'February',
    },
    {
      value: 2,
      label: 'March',
    },
    {
      value: 3,
      label: 'April',
    },
    {
      value: 4,
      label: 'May',
    },
    {
      value: 5,
      label: 'June',
    },
    {
      value: 6,
      label: 'July',
    },
    {
      value: 7,
      label: 'August',
    },
    {
      value: 8,
      label: 'September',
    },
    {
      value: 9,
      label: 'October',
    },
    {
      value: 10,
      label: 'November',
    },
    {
      value: 11,
      label: 'December',
    },
  ]);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const [daysValues, setDaysValues] = useState({});
  const [lockedDaysValues, setLockedDaysValues] = useState({});
  const [dailyGoalsCalendarData, setDailyGoalsCalendarData] = useState();
  const [allocatedDiffrenceOver, setAllocateDiffrenceOver] = useState({
    label: 'Month',
    value: 'month',
  });

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: 'Edit Daily Goals Calendar',
      class: 'active-label',
      link: `/organizational-administration/goals/daily-goals-calender/${id}/edit`,
    },
  ];

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

  const fetchCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.data;
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

  const archieveHandle = async () => {
    setModalPopUp(false);
  };

  const saveAndClose = async () => {
    const requestData = {
      month: month?.value,
      year: year?.value,
      procedureType: procedureType?.value,
      collectionOperation: collectionOperation?.value,
      isLocked,
      daysValues: isLocked ? lockedDaysValues : daysValues,
      allocatedDiffrenceOver: allocatedDiffrenceOver.value,
      diffrence: collectionOperationGoal - adjustedGoal,
    };
    const result = await makeAuthorizedApiRequestAxios(
      'PUT',
      `${BASE_URL}/daily-goals-calender`,
      JSON.stringify(requestData)
    );
    const { status, response } = result.data;
    if (status === 'error') {
      toast.error(response);
    }
    if (status === 'success') {
      setModalPopUp(true);
      fetchDailyGoalsCalendar();
    }
  };

  const saveChanges = async () => {
    const requestData = {
      month: month?.value,
      year: year?.value,
      procedureType: procedureType?.value,
      collectionOperation: collectionOperation?.value,
      isLocked,
      daysValues: isLocked ? lockedDaysValues : daysValues,
      allocatedDiffrenceOver: allocatedDiffrenceOver.value,
      diffrence: collectionOperationGoal - adjustedGoal,
    };
    const result = await makeAuthorizedApiRequestAxios(
      'PUT',
      `${BASE_URL}/daily-goals-calender`,
      JSON.stringify(requestData)
    );
    const { status, response } = result.data;
    if (status === 'error') {
      toast.error(response);
    }
    if (status === 'success') {
      toast.success(response);
      fetchDailyGoalsCalendar();
    }
  };

  const handleProcedureType = (item) => {
    setProcedureType(item);
  };

  const handleCollectionOperation = (item) => {
    setCollectionOperation(item);
  };

  const handleYear = (item) => {
    setYear(item);
  };

  const handleMonth = (item) => {
    setMonth(item);
  };

  useEffect(() => {
    fetchProcedureData();
    fetchCollectionOperations();
  }, []);

  const handleFormInput = (event) => {
    const { value, name } = event.target;
    switch (name) {
      case 'collection_operation_goal':
        setCollectionOperationGoal(value);
        break;
      case 'adjusted_goal':
        setAdjustedGoal(value);
        break;
      default:
        if (isLocked)
          debouncedFetchCalendarDiffrence({
            ...daysValues,
            [name]: value != '' ? parseInt(value) : 0,
          });
        setDaysValues({
          ...daysValues,
          [name]: value != '' ? parseInt(value) : 0,
        });
        break;
    }
  };

  const debouncedFetchCalendarDiffrence = async (dailyData) => {
    if (debouncedFetch.current) {
      clearTimeout(debouncedFetch.current);
    }
    // Debounce the fetch function
    debouncedFetch.current = setTimeout(() => {
      // Your fetchStaffSetups logic goes here
      // Remember to handle cleanup and setStaffSetupShiftOptions accordingly
      fetchDailyGoalsCalendarDiffrence(dailyData);
    }, 1000); // Adjust the timeout as needed

    return () => {
      // Clear the timeout on component unmount or when the dependencies change
      clearTimeout(debouncedFetch.current);
    };
  };

  const fetchDailyGoalsCalendarDiffrence = async (dailyData) => {
    const adjustmentGoal = Object.values(dailyData).reduce(
      (accumulator, currentValue) => accumulator + parseFloat(currentValue),
      0
    );
    const requestData = {
      month: month?.value,
      year: year?.value,
      procedureType: procedureType?.value,
      collectionOperation: collectionOperation?.value,
      isLocked,
      daysValues: dailyData,
      allocatedDiffrenceOver: allocatedDiffrenceOver.value,
      diffrence: collectionOperationGoal - adjustmentGoal - lockingDiffrence,
    };
    const result = await makeAuthorizedApiRequest(
      'POST',
      `${BASE_URL}/daily-goals-calender/allocation`,
      JSON.stringify(requestData)
    );
    const { data } = await result.json();
    setLockedDaysValues(data);
  };

  const getDaysItems = () => {
    const dateCalendar = new Date(year?.value, month?.value, 1);
    const days = [];
    const currentMonth = dateCalendar.getMonth();
    const firstDay = new Date(dateCalendar.getFullYear(), currentMonth, 1);
    const lastDay = new Date(dateCalendar.getFullYear(), currentMonth + 1, 0);
    const prevLastDay = new Date(dateCalendar.getFullYear(), currentMonth, 0);
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
    const nextDays = 7 - lastDayIndex - 1;
    for (let x = firstDayIndex; x > 0; x--) {
      const currDateItem = new Date(prevLastDay);
      currDateItem.setDate(prevLastDay.getDate() - x + 1);
      days.push(
        <div key={`prev-${x}`} className={`${styles.goalvalue}`}>
          <FormInput
            type="number"
            required={false}
            disabled={true}
            classes={{ root: 'w-100', label: 'goalsLabel' }}
            disable
            name={prevLastDay.getDate() - x + 1}
            displayName={`${currDateItem.getDate()} ${
              daysOfWeek[currDateItem.getDay()]
            }`}
          />
        </div>
      );
    }
    let firstDayIterator = new Date(firstDay);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const hasDiffrence =
        !isNaN(lockedDaysValues?.[i] - daysValues?.[i]) &&
        lockedDaysValues?.[i] - daysValues?.[i] !== 0;
      days.push(
        <>
          <div className="d-flex flex-column">
            <div key={`prev-${i}`} className={`${styles.goalvalue}`}>
              <FormInput
                type="number"
                required={false}
                classes={{
                  root: 'w-100',
                  text: 'goalsActiveItem',
                  label: 'goalsLabel',
                }}
                disabled={
                  dailyGoalsCalendarData === null ||
                  daysValues?.[i] === undefined
                }
                name={i}
                displayName={`${firstDayIterator.getDate()} ${
                  daysOfWeek[firstDayIterator.getDay()]
                }`}
                onWheel={(e) => {
                  e.target.blur();
                }}
                onKeyUp={(e) => {
                  if (e.which === 38 || e.which === 40) {
                    e.preventDefault();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.which === 38 || e.which === 40) {
                    e.preventDefault();
                  }
                }}
                value={daysValues?.[i]}
                handleChange={handleFormInput}
              />
            </div>
            <p
              className={`ps-3 ${
                hasDiffrence
                  ? lockedDaysValues?.[i] - daysValues?.[i] > 0
                    ? styles.goalOver
                    : styles.goalUnder
                  : ''
              }`}
            >
              {hasDiffrence &&
                lockedDaysValues?.[i] - daysValues?.[i] > 0 &&
                '+'}
              {hasDiffrence && lockedDaysValues?.[i] - daysValues?.[i]}
            </p>
          </div>
        </>
      );
      firstDayIterator.setDate(firstDayIterator.getDate() + 1);
    }
    let lastDayIterator = new Date(lastDay);
    lastDayIterator.setDate(lastDayIterator.getDate() + 1);
    for (let j = 1; j <= nextDays; j++) {
      days.push(
        <div key={`prev-${j}`} className={`${styles.goalvalue}`}>
          <FormInput
            type="number"
            required={false}
            disabled={true}
            classes={{ root: 'w-100', label: 'goalsLabel' }}
            name={prevLastDay.getDate() + j}
            displayName={`${lastDayIterator.getDate()} ${
              daysOfWeek[lastDayIterator.getDay()]
            }`}
            // value={daysValues?.[prevLastDay.getDate() + j]}
            handleChange={handleFormInput}
          />
        </div>
      );
      lastDayIterator.setDate(lastDayIterator.getDate() + 1);
    }
    return (
      <>
        <div className={styles.goalvalueparent}>{days}</div>
      </>
    );
  };

  useEffect(() => {
    const selected = months?.filter(
      (item) => item.value === parseInt(searchParams.get('month'))
    );
    setMonth(selected[0]);
  }, [searchParams]);

  useEffect(() => {
    const selected = years?.filter(
      (item) => item.value === searchParams.get('year')
    );
    setYear(selected[0]);
  }, [searchParams]);

  useEffect(() => {
    const selected = collectionOperationData?.filter(
      (item) => item.value === searchParams.get('collectionOperation')
    );
    setCollectionOperation(selected[0]);
  }, [collectionOperationData, searchParams]);

  useEffect(() => {
    const selected = procedureTypeData?.filter(
      (item) => item.value === searchParams.get('procedureType')
    );
    setProcedureType(selected[0]);
  }, [procedureTypeData, searchParams]);

  const calculation = useMemo(
    () => getDaysItems(),
    [daysValues, isLocked, lockedDaysValues]
  );

  const fetchDailyGoalsCalendar = async () => {
    if (
      procedureType?.value &&
      collectionOperation?.value &&
      !isEmpty(procedureType?.value) &&
      !isEmpty(collectionOperation?.value) &&
      month &&
      year
    ) {
      const result = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/daily-goals-calender?procedure_type=${
          procedureType?.value || ''
        }&collection_operation=${collectionOperation?.value || ''}&month=${
          month?.value
        }&year=${year?.value}`
      );
      let { data, monthly_value } = result.data;
      if (result.ok || result.status === 200) {
        setDailyGoalsCalendarData(data);
        setCollectionOperationGoal(monthly_value);
        const goal_amounts = data?.map((item) => item.goal_amount);
        const isLockeds = data?.map((item) => item.is_locked);
        const isLocked = isLockeds?.filter((item) => item === true) ?? false;
        if (isLocked.length > 0) {
          setIsLocked(isLocked);
        }
        setAdjustedGoal(
          parseInt(goal_amounts?.reduce((partialSum, a) => partialSum + a, 0))
        );
        setLockingDiffrence(
          monthly_value -
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
    fetchDailyGoalsCalendar();
  }, [procedureType, month, year, collectionOperation]);

  const getdataByDay = (date) => {
    return dailyGoalsCalendarData?.filter((item) => {
      return item.date === moment(date).format('YYYY-MM-DD');
    });
  };

  useEffect(() => {
    const daysData = {};
    dailyGoalsCalendarData?.map((item) => {
      const dailyData = getdataByDay(item.date);
      daysData[new Date(dailyData[0].date).getDate().toString()] = parseInt(
        dailyData[0].goal_amount
      );
    });
    if (Object.keys(daysData).length > 0) {
      setDaysValues((prevData) => ({
        ...daysData,
      }));
    } else {
      setDaysValues({});
    }
  }, [dailyGoalsCalendarData]);

  useEffect(() => {
    const sum = Object.values(daysValues).reduce(
      (accumulator, currentValue) => accumulator + parseFloat(currentValue),
      0
    );
    setAdjustedGoal(sum);
  }, [daysValues]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Goals Calendar'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className={styles.goalcalender}>
          <form>
            <div className={`formGroup ${styles.editformcontainer}`}>
              <h5>Edit Daily Goals Calendar</h5>
              <div className="form-field ">
                <div className="field ">
                  <div className="position-relative">
                    <SelectDropdown
                      placeholder={'Collection Operation*'}
                      defaultValue={collectionOperation}
                      selectedValue={collectionOperation}
                      removeDivider
                      showLabel={!isEmpty(collectionOperation)}
                      removeTheClearCross
                      onChange={handleCollectionOperation}
                      options={collectionOperationData}
                      styles={{ root: 'w-100' }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-field ">
                <div className="field ">
                  <div className="position-relative">
                    <SelectDropdown
                      placeholder={'Procedure Type*'}
                      defaultValue={procedureType}
                      selectedValue={procedureType}
                      removeDivider
                      showLabel={!isEmpty(procedureType)}
                      removeTheClearCross
                      onChange={handleProcedureType}
                      options={procedureTypeData}
                      styles={{ root: 'w-100' }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-field ">
                <div className="field ">
                  <div className="position-relative">
                    <SelectDropdown
                      placeholder={'Select Year*'}
                      defaultValue={year}
                      selectedValue={year}
                      showLabel={!isEmpty(year)}
                      removeDivider
                      removeTheClearCross
                      onChange={handleYear}
                      options={years}
                      styles={{ root: 'w-100' }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-field ">
                <div className="field ">
                  <div className="position-relative">
                    <SelectDropdown
                      placeholder={'Month*'}
                      defaultValue={month}
                      selectedValue={month}
                      showLabel={!isEmpty(month)}
                      removeDivider
                      removeTheClearCross
                      onChange={handleMonth}
                      options={months}
                      styles={{ root: 'w-100' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
          <form className={styles.detailsgoaldiv}>
            <div className={` ${styles.detailsformcontainer} formGroup`}>
              <div className="d-flex justify-content-between align-items-center w-100">
                <h5>Daily Goals Details</h5>
              </div>
              <div className="form-field ">
                <div className="field ">
                  <div className="position-relative">
                    <FormInput
                      disabled={true}
                      type="number"
                      required={false}
                      classes={{ root: 'w-100' }}
                      name={'collection_operation_goal'}
                      displayName={'Collection Operation Goal'}
                      value={collectionOperationGoal}
                      handleChange={handleFormInput}
                    />
                  </div>
                </div>
              </div>
              <div className="form-field ">
                <div className="field ">
                  <div className="position-relative">
                    <FormInput
                      disabled={true}
                      type="number"
                      required={false}
                      classes={{ root: 'w-100' }}
                      name={'adjusted_goal'}
                      displayName={'Adjusted Goal'}
                      value={adjustedGoal}
                      handleChange={handleFormInput}
                    />
                  </div>
                </div>
              </div>
              <div className="w-100">
                <div className="form-field ">
                  <div className="field ">
                    <div className="position-relative">
                      <FormInput
                        type="number"
                        required={false}
                        disabled={true}
                        classes={{ root: 'w-100', label: 'goals' }}
                        name={'diffrence'}
                        displayName={'Difference'}
                        value={
                          collectionOperationGoal - adjustedGoal === 0
                            ? '0'
                            : parseInt(collectionOperationGoal - adjustedGoal)
                        }
                        handleChange={handleFormInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center w-100">
                <h6>Automatic Redistribution</h6>
              </div>
              <div className="form-field">
                <div className="field ">
                  <div className="position-relative">
                    <FormToggle
                      name="is_locked"
                      displayName="Lock Goal"
                      checked={isLocked}
                      classes={{ root: 'pt-2' }}
                      handleChange={(event) => {
                        setLockingDiffrence(
                          collectionOperationGoal - adjustedGoal
                        );
                        setIsLocked(event.target.checked);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-field ">
                <div className="field ">
                  <div className="position-relative">
                    <SelectDropdown
                      styles={{ root: 'w-100' }}
                      showLabel={true}
                      placeholder={'Allocate Difference Over'}
                      defaultValue={allocatedDiffrenceOver}
                      selectedValue={allocatedDiffrenceOver}
                      removeDivider
                      removeTheClearCross
                      onChange={(item) => {
                        setAllocateDiffrenceOver(item);
                      }}
                      options={[
                        {
                          label: 'Month',
                          value: 'month',
                        },
                        {
                          label: 'Week',
                          value: 'week',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
          <form className={`${styles.enterdetailsgoaldiv} mb-4`}>
            <div className={`formGroup ${styles.entergoalscontainer}`}>
              <div className="d-flex justify-content-between align-items-center w-100">
                <h5>Enter Daily Goals Values</h5>
              </div>
              <div className={styles.goalvalueparent}>{calculation}</div>
            </div>
          </form>
          <div className="form-footer position-absolute bottom-0">
            <p
              className={`mb-0 flex-shrink-0 ${styles.cancelbutton}`}
              onClick={() => setCloseModal(true)}
            >
              Cancel
            </p>
            <p
              className={`mb-0 flex-shrink-0 ${styles.saveandclose}`}
              onClick={() => {
                if (!isLocked && collectionOperationGoal - adjustedGoal !== 0) {
                  setSave('saveAndClose');
                  setWarningModal(true);
                } else {
                  saveAndClose();
                }
              }}
            >
              Save & Close
            </p>
            <p
              type="button"
              className={`mb-0 flex-shrink-0 ${styles.mrbtn} ${styles.saveandclose} ${styles.savechange}`}
              onClick={() => {
                if (!isLocked && collectionOperationGoal - adjustedGoal !== 0) {
                  setSave('save');
                  setWarningModal(true);
                } else {
                  saveChanges();
                }
              }}
            >
              Save Changes
            </p>
          </div>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Daily Goals updated.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        archived={archieveHandle}
        redirectPath={`${DAILY_GOALS_CALENDAR.VIEW}?month=${
          month?.value?.toString() || ''
        }&year=${year?.value || ''}&collectionOperation=${
          collectionOperation?.value
        }&procedureType=${procedureType?.value}`}
        isNavigate={true}
        showActionBtns={true}
      />

      <WarningModalPopUp
        title="Warning!"
        message={`There is a diffrence of ${
          collectionOperationGoal - adjustedGoal
        } in Allocation for the month.
        Are you sure you want to save changes?`}
        modalPopUp={warningModal}
        isNavigate={false}
        setModalPopUp={setWarningModal}
        showActionBtns={true}
        confirmAction={() => {
          save == 'save' ? saveChanges() : saveAndClose();
          setWarningModal(false);
        }}
      />

      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={`${DAILY_GOALS_CALENDAR.VIEW}?month=${
          month?.value?.toString() || ''
        }&year=${year?.value || ''}&collectionOperation=${
          collectionOperation?.value
        }&procedureType=${procedureType?.value}`}
      />
    </div>
  );
};
export default EditGoalsCalender;
