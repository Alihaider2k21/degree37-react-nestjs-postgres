import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import SuccessConfirm from '../../../../../../assets/images/SuccessConfirm.png';
import DailyCapacityForm from './DailyCapacityForm';
import styles from './dailyCapacity.module.scss';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import ReactDatePicker from 'react-datepicker';
import ToolTip from '../../../../../common/tooltip';
import moment from 'moment';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import SuccessPopUpModal from '../../../../../common/successModal';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';

const DailyCapacityEdit = () => {
  const initialInputState = [
    {
      name: 'mon_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Monday',
    },
    { name: 'mon_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'tue_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Tuesday',
    },
    { name: 'tue_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'wed_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Wednesday',
    },
    { name: 'wed_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'thur_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Thursday',
    },
    { name: 'thur_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'fri_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Friday',
    },
    { name: 'fri_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'sat_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Saturday',
    },
    { name: 'sat_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'sun_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Sunday',
    },
    { name: 'sun_max_staff', label: ' Maximum Staff', value: '', error: '' },
  ];
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { id, schedule } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [token, setToken] = useState('');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [copyCollectionOperations, setCopyCollectionOperations] = useState([]);
  const [effectiveData, setEffectiveData] = useState();
  const [endate, setEndDate] = useState();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [copyDate, setCopyDate] = useState({
    effectiveData: '',
    endate: '',
  });
  const [errors, setErrors] = useState({
    collection_operations: '',
    formData: null,
    effetiveDate: '',
    endDate: '',
  });
  const [scheduleStatus, setScheduleStatus] = useState({
    current: '',
    schedule: '',
  });
  const [formData, setFormData] = useState(initialInputState);
  const [copyFormData, setCopyFormData] = useState([]);
  const [eventName, setEventName] = useState('');

  const [dailyCapacityFormData, setDailyCapacityFormData] = useState({
    collectionOperation: [],
    data: {},
    created_by: null,
  });

  const isFirstRender = useRef(true);

  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setDailyCapacityFormData((prevData) => ({
          ...prevData,
          created_by: decodeToken?.id,
        }));
      }
    }
    if (id) {
      fetchData(id);
    }
  }, [id, token]);
  function compareNames(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      const sortedData = data.sort(compareNames);
      setCollectionOperationData(sortedData);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  useEffect(() => {
    getCollectionOperations();
  }, []);
  const fetchData = async (id) => {
    try {
      let url = `${BASE_URL}/booking-drive/daily-capacity/${id}`;

      const result = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let res = await result.json();
      const data = res.data;
      const currentCapacityData = res?.currentData;
      setDailyCapacityFormData((prevData) => ({
        ...prevData,
        data: data,
      }));
      const formattedDate = (date) => moment(date).toDate();
      if (data.effective_date) {
        setEffectiveData(formattedDate(data.effective_date));
      }
      if (currentCapacityData) {
        if (currentCapacityData.effective_date) {
          setCopyDate((prev) => ({
            ...prev,
            effectiveData: formattedDate(currentCapacityData.effective_date),
          }));
        }
        if (currentCapacityData.end_date) {
          setCopyDate((prev) => ({
            ...prev,
            endate: formattedDate(currentCapacityData.end_date),
          }));
        }
      } else {
        setCopyDate({
          effectiveData: formattedDate(data.effective_date),
          endate: data.end_date ? formattedDate(data.end_date) : '',
        });
      }
      if (data.end_date) {
        setEndDate(formattedDate(data.end_date));
      }
      if (schedule) {
        setScheduleStatus({
          schedule: !!data.effective_date,
          current: !!data.end_date && !data.effective_date,
        });
      }
      setCollectionOperations(
        data.collection_operation?.map((item) => {
          return {
            name: item.name,
            id: item.id,
          };
        })
      );

      const updatedInputs = initialInputState.map((input) => ({
        ...input,
        value: data[input.name] || '',
      }));
      setFormData(updatedInputs);
      if (currentCapacityData) {
        const currentInputs = initialInputState.map((input) => ({
          ...input,
          value: currentCapacityData[input.name] || '',
        }));
        const shallowCopy = currentInputs.map((input) =>
          Object.assign({}, input)
        );
        setCopyFormData(shallowCopy);
      } else {
        const shallowCopy = updatedInputs.map((input) =>
          Object.assign({}, input)
        );
        setCopyFormData(shallowCopy);
      }
    } catch (error) {
      toast.error(`Failed to fetch data.`, { autoClose: 3000 });
    }
  };
  const handleSubmit = async (e, submitEventName) => {
    e.preventDefault();
    if (
      schedule &&
      effectiveData &&
      effectiveData <= new Date(dailyCapacityFormData.data.effective_date)
    ) {
      toast.error('Effective Date should be greater than current date', {
        autoClose: 3000,
      });
      return;
    }
    try {
      const selectedCollectionOperations = collectionOperations.map(
        (item) => item.id
      );
      const payload = {
        collection_operation: selectedCollectionOperations,
        data: {},
        created_by: +dailyCapacityFormData.created_by,
        copy_collection_operations: [],
        isScheduled: schedule ? true : false,
      };
      payload.effective_date = new Date(effectiveData).toDateString() || '';
      payload.end_date = endate || '';
      if (copyCollectionOperations?.length) {
        payload.copy_collection_operations = copyCollectionOperations.map(
          (item) => item.id
        );
      }
      formData.forEach((input) => {
        const { name, value, isDrive } = input;
        if (isDrive) {
          const dayKey = name.split('_')[0];
          payload.data[`${dayKey}_max_drives`] = +value;
        }
        if (name.endsWith('staff')) {
          const dayKey = name.split('_')[0];
          payload.data[`${dayKey}_max_staff`] = +value;
        }
      });
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/booking-drive/daily-capacity/${id}`,
        JSON.stringify(payload)
      );
      let data = await response.json();
      if (data?.status === 'Success' && data.status_code === 204) {
        setShowSuccessDialog(true);
        setEventName(submitEventName);
        setUnsavedChanges(false);
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
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const saveAndClose = async (e, submitName) => {
    if (validateForm()) {
      await handleSubmit(e, submitName);
    }
  };
  const handleArchive = async () => {
    // debugger; // eslint-disable-line no-debugger
    try {
      const result = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/booking-drive/daily-capacity/${id}`
      );
      const { status_code, status, response } = await result.json();

      if (status_code === 204 && status === 'success') {
        setModalPopUp(false);
        setTimeout(() => {
          setConfirmationModal(true);
        }, 600);
      } else {
        toast.error(response, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(error?.response, { autoClose: 3000 });
    }
  };
  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Edit Daily Capacity',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/daily-capacity/${id}/edit`,
    },
  ];
  const existingValues = new Set(collectionOperations.map((item) => item.id));
  const filteredOptions = collectionOperationData
    ?.filter(
      (collectionOperationItem) =>
        !existingValues.has(collectionOperationItem.id)
    )
    .map((collectionOperationItem) => ({
      id: collectionOperationItem.id,
      name: collectionOperationItem.name,
    }));
  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/operations-admin/booking-drives/daily-capacities'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/operations-admin/booking-drives/daily-capacities'
      );
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    if (eventName === 'saveAndClose' || schedule) {
      navigate(
        '/system-configuration/operations-admin/booking-drives/daily-capacities'
      );
    }
  };
  const handleOnBlur = async (key, value) => {
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
          /_/g,
          ' '
        )} is required.`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: '',
      }));
    }
  };
  const validateForm = () => {
    let flag = true;
    const copy = [...formData];
    copy.forEach((field) => {
      if (field.value === '') {
        field.error = `${(
          field.name.charAt(0).toUpperCase() + field.name.slice(1)
        ).replace(/_/g, ' ')} is required.`;
        flag = false;
      } else {
        field.error = '';
      }
    });
    setFormData([...copy]);
    return flag;
  };

  const handleCollectionOperationChange = (collectionOperation) => {
    isFirstRender.current = false;
    setCollectionOperations((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };
  const handleCopyCollectionOperationChange = (collectionOperation) => {
    isFirstRender.current = false;
    setCopyCollectionOperations((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      if (collectionOperations.length === 0) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            collection_operations: 'Collection Operations is required.',
          };
        });
      } else {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            collection_operations: '',
          };
        });
      }
    }
  }, [collectionOperations]);

  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperations(data);
  };
  const handleCopyCollectionOperationChangeAll = (data) => {
    setCopyCollectionOperations(data);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Capacity'}
      />

      <div className="mainContentInner">
        <form className={styles.addAdminRoles}>
          <div className="formGroup d-block">
            <div>
              <h5 style={{ display: 'flex', gap: '13px' }}>
                {schedule ? 'Schedule' : 'Edit'} Daily Capacity
                <ToolTip
                  text={
                    'Please enter the maximum capacities for each day of the week.'
                  }
                  isDailyCapacity={true}
                />
              </h5>
            </div>

            <div className={`w-50 field row ${styles.rowP0}`}>
              <GlobalMultiSelect
                label="Collection Operations *"
                data={collectionOperationData?.map(
                  (collectionOperationItem) => {
                    return {
                      id: collectionOperationItem.id,
                      name: collectionOperationItem.name,
                    };
                  }
                )}
                disabled={true}
                selectedOptions={collectionOperations}
                error={errors?.collection_operations}
                onChange={handleCollectionOperationChange}
                onSelectAll={handleCollectionOperationChangeAll}
              />
            </div>
            {/* <div> */}

            {schedule ? (
              <>
                <p
                  style={{
                    fontSize: '14px',
                    marginTop: '4px',
                    color: '#A3A3A3',
                  }}
                >
                  {scheduleStatus.current
                    ? 'Select one to view Current Daily Capacity Plan or Make a Schedule.'
                    : 'Select one to plan Daily Capacity Schedule.'}
                </p>
                <div className="row w-100">
                  <div className="form-field checkbox cc">
                    <input
                      type="radio"
                      name="chip-color"
                      className="form-check-input"
                      checked={scheduleStatus.current}
                      required
                      onBlur={(e) => handleOnBlur('status', e.target.value)}
                      onChange={(e) => {
                        setScheduleStatus((prevStatus) => ({
                          ...prevStatus,
                          current: e.target.value,
                          schedule: false,
                        }));
                      }}
                    />
                    <label
                      className="form-check-label"
                      style={{ marginLeft: '4px' }}
                      htmlFor="is_goal_type"
                    >
                      <span>Current</span>
                    </label>
                  </div>
                  <div className="form-field checkbox cc">
                    <input
                      type="radio"
                      name="chip-color"
                      className="form-check-input"
                      checked={scheduleStatus.schedule}
                      required
                      onBlur={(e) => handleOnBlur('status', e.target.value)}
                      onChange={(e) => {
                        setScheduleStatus((prevStatus) => ({
                          ...prevStatus,
                          schedule: e.target.value,
                          current: false,
                        }));
                      }}
                    />
                    <label
                      className="form-check-label"
                      style={{ marginLeft: '4px' }}
                      htmlFor="is_goal_type"
                    >
                      <span>Schedule</span>
                    </label>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className="formGroup">
            {schedule ? (
              <>
                <h5 style={{ display: 'flex', gap: '13px' }}>
                  {scheduleStatus.current
                    ? 'Current Planning of Each Day of Week'
                    : 'Plan Each Day of Week'}
                </h5>
                {scheduleStatus.schedule ? (
                  <p
                    style={{
                      fontSize: '14px',
                      marginTop: '-15px',
                      color: '#A3A3A3',
                      marginBottom: '20px',
                    }}
                  >
                    Establish the maximum number of drives and maximum staff for
                    each day
                    <br />
                    of the week.Leave the entry blank if this does not apply.
                  </p>
                ) : (
                  <p
                    style={{
                      fontSize: '14px',
                      marginTop: '-15px',
                      color: '#A3A3A3',
                      marginBottom: '20px',
                    }}
                  >
                    Maximum number of drives and maximum staff planning
                    <br />
                    for each day of the week.
                  </p>
                )}
              </>
            ) : null}
            <DailyCapacityForm
              setUnsavedChanges={setUnsavedChanges}
              setFormData={setFormData}
              setErrors={setErrors}
              initialInputState={
                scheduleStatus.current ? copyFormData : formData
              }
              isDisabled={scheduleStatus.current || (effectiveData && endate)}
            />
            {/* {schedule ? ( */}
            <>
              <div className="form-field col-md-6 mt-4">
                <p>Adjust Settings</p>
                <div className="field">
                  <ReactDatePicker
                    wrapperClassName={styles.datePickerFirst}
                    disabled={
                      (effectiveData && endate) ||
                      scheduleStatus.current ||
                      !schedule
                    }
                    minDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker"
                    placeholderText="Set Effective Date"
                    selected={
                      scheduleStatus.current
                        ? dailyCapacityFormData?.data?.is_current
                          ? effectiveData
                          : copyDate.effectiveData
                        : effectiveData
                    }
                    onChange={(date) => {
                      handleOnBlur('effectiveDate', date);
                      setEffectiveData(date);
                    }}
                  />
                </div>
                {errors.effetiveDate && (
                  <div className={`error ml-1 mt-1`}>
                    <p>Effective Date required</p>
                  </div>
                )}
              </div>
              <div
                className="form-field col-md-6"
                style={{ marginTop: '56px' }}
              >
                <div className="field">
                  <ReactDatePicker
                    wrapperClassName={styles.secondDate}
                    disabled={true}
                    minDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker"
                    placeholderText="End Date"
                    selected={scheduleStatus.current ? copyDate.endate : endate}
                    onChange={(date) => {
                      handleOnBlur('endDate', date);
                      setEndDate(date);
                    }}
                  />
                </div>
                {errors.endDate && (
                  <div className={`error ml-1 mt-1`}>
                    <p>End Date required</p>
                  </div>
                )}
              </div>
            </>
            {/* ) : null} */}
          </div>
          {(effectiveData && endate) || scheduleStatus.current ? null : (
            <>
              <div className="formGroup">
                <div>
                  <h5 style={{ display: 'flex', gap: '13px' }}>
                    Copy Daily Capacity{' '}
                    {schedule ? (
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: 400,
                          marginTop: '8px',
                          marginLeft: '-9px',
                        }}
                      >
                        (Scheduled)
                      </span>
                    ) : (
                      <ToolTip
                        text={'Errors can be managed through archiving.'}
                        isDailyCapacity={true}
                      />
                    )}
                  </h5>
                  <p
                    style={{
                      fontSize: '14px',
                      marginTop: '-15px',
                      color: '#A3A3A3',
                      marginBottom: '20px',
                    }}
                  >
                    {schedule ? (
                      <p
                        style={{
                          fontSize: '14px',
                          marginTop: '-15px',
                          color: '#A3A3A3',
                          marginBottom: '20px',
                        }}
                      >
                        Select one or more collection operations to sechedule{' '}
                        <br />
                        this Daily Capacity to.
                      </p>
                    ) : (
                      <p
                        style={{
                          fontSize: '14px',
                          marginTop: '-15px',
                          color: '#A3A3A3',
                          marginBottom: '20px',
                        }}
                      >
                        Select one or more collection operations to copy <br />
                        this daily capacity to.
                      </p>
                    )}
                  </p>
                </div>

                <div className="row w-100">
                  <div className="form-field col-md-6 mt-4">
                    <GlobalMultiSelect
                      label="Collection Operations *"
                      data={filteredOptions}
                      selectedOptions={copyCollectionOperations}
                      onChange={handleCopyCollectionOperationChange}
                      onSelectAll={handleCopyCollectionOperationChangeAll}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
        <section
          className={`popup full-section ${
            showConfirmationDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={CancelIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Unsaved changes will be lost. Do you want to continue?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResult(true)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Confirmation Dialog */}
        <section
          className={`popup full-section ${showSuccessDialog ? 'active' : ''}`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={SuccessConfirm} alt="SuccessIcon" />
            </div>
            <div className="content">
              <h3>Success!</h3>
              <p>Daily Capacity updated.</p>
              <div className="buttons">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handleSuccessConfirm()}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={handleArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Daily Capacity is archived.'}
          modalPopUp={confirmationModal}
          isNavigate={true}
          setModalPopUp={setConfirmationModal}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/operations-admin/booking-drives/daily-capacities'
          }
        />

        <div className="form-footer">
          <div
            className="archived"
            onClick={(e) => {
              e.preventDefault();
              setModalPopUp(true);
            }}
          >
            Archive
          </div>
          <button
            className="btn btn-secondary border-0"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          {schedule ? (
            ''
          ) : (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={(e) => saveAndClose(e, 'saveAndClose')}
            >
              Save & Close
            </button>
          )}

          <button
            type="button"
            className={` ${`btn btn-primary`}`}
            onClick={(e) => saveAndClose(e, 'save')}
          >
            {schedule ? 'Schedule' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyCapacityEdit;
