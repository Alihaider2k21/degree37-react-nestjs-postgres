/* eslint-disable */

import React, { useEffect, useState } from 'react';
import styles from '../../index.module.scss';
import SelectDropdown from '../../../common/selectDropdown';
import FormInput from '../../../common/form/FormInput';
import FormText from '../../../common/form/FormText';
import ReactDatePicker from 'react-datepicker';
import SuccessPopUpModal from '../../../common/successModal';
import CancelModalPopUp from '../../../common/cancelModal';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import { formatUser } from '../../../../helpers/formatUser';
import FormFooter from '../../../common/FormFooter';
import Topbar from '../../../common/Topbar';
import { CreateScheduleBreadCrumbData } from '../BuildScheduleBreadCrumbData';
import ScheduleStatusEnum from '../schedule.enum';

const ScheduleCreate = ({
  formHeading,
  collectionOperation,
  operationStatusList,
  user,
  taskListUrl,
}) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [operationStatusError, setOperationStatusError] = useState('');
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [errors, setErrors] = useState({
    operation_status: '',
    collection_operation: '',
    start_date: '',
  });
  const [CreateScheduleData, setCreateScheduleData] = useState({
    operation_status: [],
    collection_operation: null,
    start_date: null,
    end_date: null,
  });

  const calculateEndDate = (startDate) => {
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(
      startDateObject.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const endDateString = endDateObject.toISOString().split('T')[0];
    return new Date(endDateString);
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'operation_status':
        if (!value) {
          setError(name, 'Operation status is required.');
        } else if (value.length > 50) {
          setError(name, 'Maximum 50 characters are allowed.');
        } else {
          setError(name, '');
        }
        break;
      case 'collection_operation':
        if (!value) {
          setError(name, 'Collection Operation is required.');
        } else {
          setError(name, '');
        }
        break;
      case 'start_date':
        if (!CreateScheduleData.start_date) {
          setError(name, 'Start date is required.');
        } else {
          setError(name, '');
        }
        break;
      default:
        break;
    }
  };

  const handleOperationStatusDropdownFocus = () => {
    if (!CreateScheduleData.operation_status) {
      setOperationStatusError('Operation Status to is required.');
    }
  };

  const handleCollectionOperationDropdownFocus = () => {
    if (!CreateScheduleData.collection_operation) {
      setCollectionOperationError('Collection Operation by is required.');
    }
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    if (
      name === 'operation_status' ||
      name === 'collection_operation' ||
      name === 'start_date'
    ) {
      if (
        (name === 'operation_status' && value?.length > 50) ||
        (name === 'collection_operation' && value?.length > 500)
      ) {
        return;
      }

      setCreateScheduleData({ ...CreateScheduleData, [name]: value });
    }
  };

  const handleChangeSelectOperationStatus = (val) => {
    if (!val) {
      setOperationStatusError('Operation Stats is required.');
      setStatus([]);
    } else {
      setOperationStatusError('');
      setStatus(val);
    }
  };
  const handleChangeSelectCollectionOperation = (val) => {
    if (!val) {
      setCollectionOperationError('Collection Operation is required.');
      CreateScheduleData.collection_operation = null;
    } else {
      setCollectionOperationError('');
      CreateScheduleData.collection_operation = val;
    }
  };
  const handleChangeSelectStartDate = (val) => {
    if (!val) {
      setStartDateError('Start Date is required.');
      CreateScheduleData.start_date = '';
    } else {
      setStartDateError('');
      CreateScheduleData.start_date = val;
    }
  };

  let isDisabled =
    CreateScheduleData.operation_status &&
    CreateScheduleData.collection_operation &&
    CreateScheduleData.start_date &&
    !operationStatusError &&
    !collectionOperationError &&
    !startDateError;

  isDisabled = Boolean(isDisabled);

  const handleSubmit = async () => {
    status.forEach((val) =>
      CreateScheduleData.operation_status.push(Number(val.value))
    );

    if (!CreateScheduleData.collection_operation) {
      setCollectionOperationError('Collection Operation is required.');
    }
    if (!CreateScheduleData.operation_status) {
      setOperationStatusError('Operation Status is required.');
    }
    if (!CreateScheduleData.start_date) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        start_date: 'Start Date is required.',
      }));
    }
    if (isDisabled) {
      setLoading(true);
      const formattedDate = new Date(
        CreateScheduleData.start_date
      ).toLocaleDateString('en-US');
      const accessToken = localStorage.getItem('token');
      let body = {
        start_date: new Date(CreateScheduleData.start_date),
        end_date: new Date(CreateScheduleData.end_date),
        operation_status: CreateScheduleData?.operation_status,
        collection_operation_id: Number(
          CreateScheduleData?.collection_operation?.value
        ),
        schedule_status: ScheduleStatusEnum.DRAFT,
        is_archived: false,
        is_locked: false,
        is_flagged: false,
        is_paused: false,
        created_by: Number(user.id),
      };
      try {
        const response = makeAuthorizeRequest(
          `${BASE_URL}/staffing-management/schedules`
        );
        let data = await response.json();
        setTimeout(() => {
          setLoading(false);
        }, 10000);
        if (data?.status === 'success') {
          setModalPopUp(true);
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
        setLoading(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };
  return (
    <>
      <Topbar
        BreadCrumbsData={CreateScheduleBreadCrumbData}
        BreadCrumbsTitle={'Create Schedule'}
      />
      <div className="mainContentInner">
        <form className={styles.formcontainer}>
          <div className="formGroup">
            <h5 className={styles.heading}>{formHeading}</h5>
            <SelectDropdown
              label="Operation Status*"
              options={
                operationStatusList?.length
                  ? operationStatusList.map((item) => ({
                      value: item?.id,
                      label: item?.name,
                    }))
                  : []
              }
              selectedValue={status}
              onChange={handleChangeSelectOperationStatus}
              removeDivider
              showLabel
              isMulti={true}
              error={operationStatusError}
              onBlur={(e) => handleInputBlur(e, true)}
              onFocus={handleOperationStatusDropdownFocus}
              placeholder="Operation Status"
            />
            <SelectDropdown
              label="Collection Operation*"
              options={collectionOperation.map((item) => ({
                value: item?.id,
                label: item?.name,
              }))}
              defaultValue={CreateScheduleData.collection_operation}
              selectedValue={CreateScheduleData.collection_operation}
              onChange={handleChangeSelectCollectionOperation}
              removeDivider
              showLabel
              error={collectionOperationError}
              onBlur={(e) => handleInputBlur(e, true)}
              onFocus={handleCollectionOperationDropdownFocus}
              placeholder="Collection Operation"
            />
            <div className="form-field">
              <div className="field">
                {CreateScheduleData?.start_date ? (
                  <label
                    style={{
                      fontSize: '12px',
                      top: '24%',
                      color: '#555555',
                      zIndex: 1,
                    }}
                  >
                    Start Date*
                  </label>
                ) : (
                  ''
                )}
                <ReactDatePicker
                  wrapperClassName={styles.secondDate}
                  minDate={new Date()}
                  dateFormat="MM/dd/yyyy"
                  className={`custom-datepicker ${styles.datepicker} ${
                    CreateScheduleData?.start_date ? '' : ''
                  }`}
                  placeholderText="Start Date*"
                  selected={CreateScheduleData.start_date}
                  onChange={(date) => {
                    handleChangeSelectStartDate(date);
                    let endDate = calculateEndDate(date);
                    CreateScheduleData.end_date = endDate;
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      start_date: '',
                    }));
                  }}
                  onBlur={(date) => {
                    handleInputBlur({
                      target: { value: date, name: 'start_date' },
                    });
                  }}
                />
              </div>
              {errors.start_date && (
                <div className={`error ml-1`}>
                  <p>{errors.start_date}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <ReactDatePicker
                wrapperClassName={styles.secondDate}
                label="Collection Operation*"
                minDate={new Date()}
                dateFormat="MM/dd/yyyy"
                className={`custom-datepicker ${styles.datepicker} ${
                  CreateScheduleData?.start_date ? '' : ''
                }`}
                placeholderText="End Date*"
                selected={CreateScheduleData.end_date}
                disabled
              />
            </div>
          </div>
        </form>
        <FormFooter
          enableCancel={true}
          onClickCancel={(e) => {
            e.preventDefault();
            setCloseModal(true);
          }}
          enableCreate={true}
          onCreateType={'submit'}
          onClickCreate={handleSubmit}
          disabled={loading}
        />
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Task created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={true}
        redirectPath={taskListUrl}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost. Do you want to continue?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={taskListUrl}
      />
    </>
  );
};

export default ScheduleCreate;
