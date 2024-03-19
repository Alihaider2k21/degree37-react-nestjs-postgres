import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import styles from './index.module.scss';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { DAILY_GOALS_ALLOCATION_PATH } from '../../../../../../routes/path';
import 'react-datepicker/dist/react-datepicker.css';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import { isEmpty } from 'lodash';
import SelectDropdown from '../../../../../common/selectDropdown';
import FormInput from '../../../../../common/form/FormInput';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import moment from 'moment';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';

const AddDailyGoalsAllocation = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [procedureTypeData, setProcedureTypeData] = useState([]);
  const [showLimitExceedError, setShowLimitExceedError] = useState(false);
  const [collectionOperations, setCollectionOperations] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, index) => {
    return {
      label: (currentYear + index).toString(),
      value: (currentYear + index).toString(),
    };
  });
  const months = [
    { label: 'January', value: '0' },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 1 },
  ];
  const [disabled, setIsDisabled] = useState(false);
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

  const [closeModal, setCloseModal] = useState(false);
  const [dailyGoalsAllocationData, setDailyGoalsAllocationData] = useState({
    collection_operation: [],
    collection_operation_data: [],
    procedure_type: 'Procedure Type*',
    year: '',
    month: '',
  });
  const [errors, setErrors] = useState({
    collection_operation: '',
    collection_operation_data: '',
    procedure_type: '',
    sunday: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
  });

  const handleYear = (item) => {
    setDailyGoalsAllocationData({
      ...dailyGoalsAllocationData,
      year: item,
    });
    handleInputBlur(null, item?.value, 'year');
  };

  const handleMonth = (item) => {
    setDailyGoalsAllocationData({
      ...dailyGoalsAllocationData,
      month: item,
    });
    handleInputBlur(null, item?.value, 'month');
  };
  const [modalPopUp, setModalPopUp] = useState(false);
  const [isFouced, setIsFocused] = useState(false);

  const total = useMemo(() => {
    let total = 0;
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    for (const day of days) {
      if (!isNaN(parseInt(dailyGoalsAllocationData[day]))) {
        total += dailyGoalsAllocationData[day];
      }
    }

    total != 100 && total != 0
      ? setShowLimitExceedError(true)
      : setShowLimitExceedError(false);

    return total;
  }, [dailyGoalsAllocationData]);

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: 'Create Daily Goals Allocation',
      class: 'active-label',
      link: `${DAILY_GOALS_ALLOCATION_PATH.CREATE}`,
    },
  ];

  useEffect(() => {
    fetchProcedureData();
    fetchCollectionOperations();
  }, []);

  const handleFormInput = (event) => {
    const { value, name } = event.target;
    if (name === 'effective_date') {
      console.log(moment(value).utc().toDate());
      setDailyGoalsAllocationData({
        ...dailyGoalsAllocationData,
        [name]: value,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        effective_date: '',
      }));
    } else
      setDailyGoalsAllocationData({
        ...dailyGoalsAllocationData,
        [name]: parseInt(value.replace(/\D/g, '')) || 0,
      });
  };

  const handleInputBlur = (event, state_value, state_name) => {
    let errorMessage = '';
    const name = event?.target?.name || state_name;
    const value = event?.target?.value || state_value;
    if (!value) {
      errorMessage = 'Required';
    }
    if (name == 'procedure_type') {
      errorMessage = 'Procedure type is required.';
    }

    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    if (event) {
      if (isEmpty(value)) {
        setError(name, '');
      } else if (value < 0 || isNaN(parseInt(value))) {
        setError(name, 'Please enter a positive value.');
      } else {
        setError(name, '');
      }
    } else {
      if (state_value || dailyGoalsAllocationData[state_name]['value']) {
        setError(state_name, '');
      } else {
        setError(state_name, errorMessage);
      }
    }
  };

  useEffect(() => {
    if (
      dailyGoalsAllocationData.collection_operation_data.length === 0 &&
      isFouced
    )
      setErrors((prevErrors) => ({
        ...prevErrors,
        collection_operation_data: 'Collection operation is required.',
      }));
    else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        collection_operation_data: '',
      }));
    }
  }, [dailyGoalsAllocationData.collection_operation_data]);

  const validateForm = () => {
    const copy = {
      ...errors,
      month: !dailyGoalsAllocationData.month ? 'Month is required.' : '',
      year: !dailyGoalsAllocationData.year ? 'Year is required.' : '',
      collection_operation_data: !dailyGoalsAllocationData
        .collection_operation_data.length
        ? 'Collection operation is required.'
        : '',
      procedure_type: !dailyGoalsAllocationData?.procedure_type
        ? 'Procedure type is required.'
        : '',
    };
    setErrors({ ...copy });
    return copy;
  };

  const handleCollectionOperationChange = (collectionOperation) => {
    setIsFocused(true);
    setCollectionOperations((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };
  useEffect(() => {
    setDailyGoalsAllocationData({
      ...dailyGoalsAllocationData,
      collection_operation_data: collectionOperations,
    });
  }, [collectionOperations]);
  const handleCollectionOperationChangeAll = (data) => {
    setIsFocused(true);
    setCollectionOperations(data);
  };
  const handleSubmit = async (e) => {
    setIsDisabled(true);
    const errObject = validateForm();
    e.preventDefault();
    if (dailyGoalsAllocationData.procedure_type?.value == null) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        procedure_type: 'Procedure type is required.',
      }));
      setIsDisabled(false);
      return;
    }
    if (showLimitExceedError) {
      setIsDisabled(false);
      return;
    }
    if (Object.values(errObject).every((value) => value == '')) {
      try {
        const body = {
          collection_operation:
            dailyGoalsAllocationData.collection_operation_data.map((item) =>
              parseInt(item.id)
            ),
          procedure_type_id: parseInt(
            dailyGoalsAllocationData.procedure_type.value
          ),
          year: parseInt(dailyGoalsAllocationData.year.value),
          month: parseInt(dailyGoalsAllocationData.month.value),
          sunday: dailyGoalsAllocationData.sunday,
          monday: dailyGoalsAllocationData.monday,
          tuesday: dailyGoalsAllocationData.tuesday,
          wednesday: dailyGoalsAllocationData.wednesday,
          thursday: dailyGoalsAllocationData.thursday,
          friday: dailyGoalsAllocationData.friday,
          saturday: dailyGoalsAllocationData.saturday,
        };
        dailyGoalsAllocationData.collection_operation =
          dailyGoalsAllocationData.collection_operation_data.map((item) =>
            parseInt(item.id)
          );
        dailyGoalsAllocationData.procedure_type_id = parseInt(
          dailyGoalsAllocationData.procedure_type.value
        );
        const res = await makeAuthorizedApiRequestAxios(
          'POST',
          `${BASE_URL}/daily-goals-allocation`,
          JSON.stringify(body)
        );
        let resJson = res.data;
        let { data, status, response } = resJson;
        if (resJson?.statusCode === 400) {
          toast.error(`${resJson?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        } else if (status === 'success') {
          // Handle successful response
          setModalPopUp(true);
        } else if (status === 'error') {
          toast.error(response, {
            autoClose: 3000,
          });
        } else if (response?.status === 400) {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
          // Handle bad request
        } else {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        }
        setIsDisabled(false);
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
        setIsDisabled(false);
      }
    }
    setIsDisabled(false);
  };
  const preventNegative = (e) => {
    const { name, value } = e.target;
    if (isEmpty(value)) {
      setErrors({ ...errors, [name]: '' });
    } else if (value < 0 || isNaN(parseInt(value))) {
      setDailyGoalsAllocationData({ ...dailyGoalsAllocationData, [name]: 0 });
      setErrors({ ...errors, [name]: 'Please enter a positive value.' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleProcedureType = (item) => {
    setDailyGoalsAllocationData({
      ...dailyGoalsAllocationData,
      procedure_type: item,
    });
    if (!item?.value) {
      setErrors({
        ...errors,
        procedure_type: 'Procedure type is required.',
      });
    } else {
      setErrors({
        ...errors,
        procedure_type: '',
      });
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Goals Allocation'}
      />
      <div className="mainContentInner form-container">
        <form className={` ${styles.formcontainer}`}>
          <div className="formGroup">
            <h5>Create Daily Goals Allocation</h5>
            <div className="form-field">
              <div className="field">
                <GlobalMultiSelect
                  label="Collection Operation*"
                  data={collectionOperationData}
                  selectedOptions={collectionOperations}
                  onChange={handleCollectionOperationChange}
                  onSelectAll={handleCollectionOperationChangeAll}
                  error={errors?.collection_operation_data}
                />
              </div>
            </div>
            <div className="form-field ">
              <div className="field ">
                <div className="position-relative">
                  <SelectDropdown
                    removeDivider
                    placeholder={'Procedure Type*'}
                    name="procedure_type"
                    defaultValue={dailyGoalsAllocationData.procedure_type}
                    selectedValue={dailyGoalsAllocationData.procedure_type}
                    showLabel={dailyGoalsAllocationData.procedure_type?.value}
                    onChange={handleProcedureType}
                    options={procedureTypeData}
                    error={errors.procedure_type}
                    onBlur={(e) => handleInputBlur(e, null, 'procedure_type')}
                    styles={{ root: 'w-100' }}
                  />
                </div>
              </div>
            </div>
            <div className="form-field">
              <div className="field ">
                <div className="position-relative">
                  <SelectDropdown
                    removeDivider
                    showLabel={dailyGoalsAllocationData.month?.value}
                    placeholder={'Effective Month*'}
                    defaultValue={dailyGoalsAllocationData?.month}
                    selectedValue={dailyGoalsAllocationData?.month}
                    onChange={handleMonth}
                    options={months}
                    error={errors.month}
                    onBlur={(e) => handleInputBlur(e, e.target.value, 'month')}
                    styles={{ root: 'w-100' }}
                  />
                </div>
              </div>
            </div>
            <div className="form-field">
              <div className="field ">
                <div className="position-relative">
                  <SelectDropdown
                    removeDivider
                    showLabel={dailyGoalsAllocationData.year?.value}
                    placeholder={'Year*'}
                    defaultValue={dailyGoalsAllocationData?.year}
                    selectedValue={dailyGoalsAllocationData?.year}
                    onChange={handleYear}
                    options={years}
                    error={errors.year}
                    onBlur={(e) => handleInputBlur(e, e.target.value, 'year')}
                    styles={{ root: 'w-100' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="formGroup">
            <h5>Add Daily Percentage</h5>
            <Col lg={4}>
              <FormInput
                name="sunday"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="Sunday"
                value={dailyGoalsAllocationData.sunday}
                error={errors.sunday}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                name="monday"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="Monday"
                value={dailyGoalsAllocationData.monday}
                error={errors.monday}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                name="tuesday"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="Tuesday"
                value={dailyGoalsAllocationData.tuesday}
                error={errors.tuesday}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                name="wednesday"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="Wednesday"
                value={dailyGoalsAllocationData.wednesday}
                error={errors.wednesday}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                name="thursday"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="Thursday"
                value={dailyGoalsAllocationData.thursday}
                error={errors.thursday}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                name="friday"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="Friday"
                value={dailyGoalsAllocationData.friday}
                error={errors.friday}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                name="saturday"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="Saturday"
                value={dailyGoalsAllocationData.saturday}
                error={errors.saturday}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Row className={`mb-4 ${styles.rows}`}>
              <Col lg={3}>
                <div className="form-field w-100">
                  <div className={`field`}>
                    <p>Total</p>
                  </div>
                </div>
              </Col>
              <Col lg={3}>
                <div className="form-field w-100">
                  <div className={`field`}>
                    <p>{total}</p>
                  </div>
                </div>
              </Col>
            </Row>
            {showLimitExceedError === true && (
              <p style={{ color: 'red' }}>
                The daily percentage entries must total 100%.
              </p>
            )}
          </div>
        </form>
        <div className="form-footer">
          <p
            className={`mb-0 ${styles.cancelbutton}`}
            onClick={(e) => {
              e.preventDefault();
              setCloseModal(true);
            }}
          >
            Cancel
          </p>

          <button
            type="button"
            disabled={disabled}
            className={`btn btn-primary`}
            onClick={(e) => handleSubmit(e)}
          >
            Create
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Daily Goal Allocation created."
        modalPopUp={modalPopUp}
        isNavigate={true}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        redirectPath={DAILY_GOALS_ALLOCATION_PATH.LIST}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost. Do you want to continue?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={DAILY_GOALS_ALLOCATION_PATH.LIST}
      />
    </div>
  );
};

export default AddDailyGoalsAllocation;
