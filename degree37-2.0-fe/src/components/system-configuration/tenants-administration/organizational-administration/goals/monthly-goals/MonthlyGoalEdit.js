import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { MONTHLY_GOALS_PATH } from '../../../../../../routes/path';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import SelectDropdown from '../../../../../common/selectDropdown';
import FormInput from '../../../../../common/form/FormInput';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import { Col } from 'react-bootstrap';
import axios from 'axios';

const MonthlyGoalEdit = ({ goalId }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isNavigate, setIsNavigate] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [procedureTypeData, setProcedureTypeData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [archivePopup, setArchivePopup] = useState(false);
  const [arSuccessPopup, setArSuccessPopup] = useState(false);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);

  const years = Array.from({ length: 51 }, (_, index) => {
    return {
      label: (currentYear + index).toString(),
      value: (currentYear + index).toString(),
    };
  });
  const [recruiterData, setRecruiterData] = useState([]);
  const [donorsCenterData, setDonorsCenterData] = useState([]);
  const bearerToken = localStorage.getItem('token');

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
      setCollectionOperationData([
        ...data.map((item) => {
          return { value: item.id, label: item.name };
        }),
      ]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const handleProcedureType = (item) => {
    setMonthlyGoalsData({
      ...monthlyGoalsData,
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

  const handleCollectionOperation = (item) => {
    setMonthlyGoalsData({
      ...monthlyGoalsData,
      collection_operation: item,
    });
    if (!item?.value) {
      setErrors({
        ...errors,
        collection_operation: 'Collection operation is required.',
      });
    } else {
      setErrors({
        ...errors,
        collection_operation: '',
      });
    }
  };

  const handleYear = (item) => {
    setMonthlyGoalsData({
      ...monthlyGoalsData,
      year: item,
    });
    if (!item?.value) {
      setErrors({
        ...errors,
        year: 'Year is required.',
      });
    } else {
      setErrors({
        ...errors,
        year: '',
      });
    }
  };

  const handleRecruiter = (item) => {
    setMonthlyGoalsData({
      ...monthlyGoalsData,
      recruiter: item,
    });
    if (!item?.value) {
      setErrors({
        ...errors,
        recruiter: 'Recruiter is required.',
        donor_center: '',
      });
    } else {
      setErrors({
        ...errors,
        recruiter: '',
        donor_center: '',
      });
    }
  };

  const handleDonorCenter = (item) => {
    setMonthlyGoalsData({
      ...monthlyGoalsData,
      donor_center: item,
    });
    if (!item?.value) {
      setErrors({
        ...errors,
        recruiter: '',
        donor_center: 'Donor center is required.',
      });
    } else {
      setErrors({
        ...errors,
        donor_center: '',
        recruiter: '',
      });
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
      console.error(error);
    }
  };
  const [closeModal, setCloseModal] = useState(false);
  const [monthlyGoalsData, setMonthlyGoalsData] = useState({
    collection_operation: '',
    procedure_type: '',
    year: '',
    recruiter: '',
    donor_center: '',
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
  });
  const [errors, setErrors] = useState({
    collection_operation: '',
    procedure_type: '',
    year: '',
    recruiter: '',
    donor_center: '',
    january: '',
    february: '',
    march: '',
    april: '',
    may: '',
    june: '',
    july: '',
    august: '',
    september: '',
    october: '',
    november: '',
    december: '',
  });
  const [modalPopUp, setModalPopUp] = useState(false);

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: 'Edit Monthly Goals',
      class: 'active-label',
      link: `${MONTHLY_GOALS_PATH.EDIT}`,
    },
  ];

  useEffect(() => {
    fetchProcedureData();
    fetchCollectionOperations();
    fetchMonthlyGoalData();
  }, []);

  const getRecruitersandDonors = async (collectionId = null) => {
    try {
      const response = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/monthly_goals/donors_recruiters?collectionOperation=${monthlyGoalsData?.collection_operation?.value}`
      );
      const data = response.data;
      if (data?.data?.recruiters?.length) {
        setRecruiterData([
          ...(data?.data?.recruiters.map((item) => {
            return {
              value: item.id,
              label: item?.first_name + ' ' + item?.last_name,
            };
          }) || []),
        ]);
      }

      if (data?.data?.donorCenter?.length) {
        setDonorsCenterData([
          ...(data?.data?.donorCenter.map((item) => {
            return {
              value: item.id,
              label: item?.name,
            };
          }) || []),
        ]);
      }
    } catch (error) {
      console.error('Error Donor centers:', error);
    }
  };
  const preventNegative = (e) => {
    const { name, value } = e.target;
    if (isEmpty(value)) {
      setErrors({ ...errors, [name]: '' });
    } else if (value < 0 || isNaN(parseInt(value))) {
      setMonthlyGoalsData({ ...monthlyGoalsData, [name]: 0 });
      setErrors({ ...errors, [name]: 'Please enter a positive value.' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const total = useMemo(() => {
    let total = 0;
    if (!isNaN(parseInt(monthlyGoalsData.january)))
      total += monthlyGoalsData.january;
    if (!isNaN(parseInt(monthlyGoalsData.february)))
      total += monthlyGoalsData.february;
    if (!isNaN(parseInt(monthlyGoalsData.march)))
      total += monthlyGoalsData.march;
    if (!isNaN(parseInt(monthlyGoalsData.april)))
      total += monthlyGoalsData.april;
    if (!isNaN(parseInt(monthlyGoalsData.may))) total += monthlyGoalsData.may;
    if (!isNaN(parseInt(monthlyGoalsData.june))) total += monthlyGoalsData.june;
    if (!isNaN(parseInt(monthlyGoalsData.july))) total += monthlyGoalsData.july;
    if (!isNaN(parseInt(monthlyGoalsData.august)))
      total += monthlyGoalsData.august;
    if (!isNaN(parseInt(monthlyGoalsData.september)))
      total += monthlyGoalsData.september;
    if (!isNaN(parseInt(monthlyGoalsData.october)))
      total += monthlyGoalsData.october;
    if (!isNaN(parseInt(monthlyGoalsData.november)))
      total += monthlyGoalsData.november;
    if (!isNaN(parseInt(monthlyGoalsData.december)))
      total += monthlyGoalsData.december;
    return total;
  }, [monthlyGoalsData]);

  const fetchMonthlyGoalData = async () => {
    const result = await axios.get(`${BASE_URL}/monthly_goals/${goalId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });

    const { data } = result.data;
    if (result.ok || result.status === 200) {
      setMonthlyGoalsData({
        collection_operation: {
          value: data?.collection_operation?.[0].id,
          label: data?.collection_operation?.[0].name,
        },
        procedure_type: {
          value: data?.procedure_type?.id,
          label: data?.procedure_type?.name,
        },
        year: {
          value: data.year,
          label: data.year,
        },
        donor_center: data?.donor_center?.id
          ? {
              value: data?.donor_center?.id,
              label: data?.donor_center?.name,
            }
          : '',
        recruiter: data?.recruiter?.id
          ? {
              value: data?.recruiter?.id,
              label:
                data?.recruiter?.first_name + ' ' + data?.recruiter?.last_name,
            }
          : '',
        january: data?.january,
        february: data?.february,
        march: data?.march,
        april: data?.april,
        may: data?.may,
        june: data?.june,
        july: data?.july,
        august: data?.august,
        september: data?.september,
        october: data?.october,
        november: data?.november,
        december: data?.december,
      });
      if (data?.collection_operation?.length) {
        getRecruitersandDonors(data?.collection_operation);
      }
    } else {
      toast.error('Error Fetching Monthly Goal Details', { autoClose: 3000 });
    }
  };

  const handleFormInput = (event) => {
    const { value, name } = event.target;
    setMonthlyGoalsData({
      ...monthlyGoalsData,
      [name]: parseInt(value.replace(/\D/g, '')),
    });
  };

  const handleInputBlur = (event, state_value, state_name) => {
    const name = event?.target?.name || state_name;
    const value = event?.target?.value || state_value;

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
      if (
        state_value ||
        (monthlyGoalsData[state_name] &&
          monthlyGoalsData[state_name]['value'] !== undefined)
      ) {
        setError(state_name, '');
      } else {
        let error;
        switch (state_name) {
          case 'collection_operation':
            error = 'Collection operation is required.';
            break;
          case 'procedure_type':
            error = 'Procedure type is required.';
            break;
          case 'year':
            error = 'Year is required.';
            break;
          case 'donor_center':
            error = 'Donor center is required.';
            break;
          case 'recruiter':
            error = 'Recruiter is required.';
            break;
        }
        setError(state_name, error);
      }
      if (state_name === 'recruiter') setError('donor_center', '');
      if (state_name === 'donor_center') setError('recruiter', '');
    }
  };
  const checkErrors = (name, value) => {
    switch (name) {
      case 'collection_operation':
        if (!value) {
          return 'Collection operation is required.';
        }
        return '';

      case 'procedure_type':
        if (!value) {
          return 'Procedure type is required.';
        }
        return '';

      case 'year':
        if (!value) {
          return 'Year is required.';
        }
        return '';
      case 'donor_center':
        if (!value) {
          return 'Either donor center or recruiter is required.';
        }
        return '';
      case 'recruiter':
        if (!value) {
          return 'Either donor center or recruiter is required.';
        }
        return '';
    }
  };

  const validateForm = () => {
    let err = {};
    if (
      !monthlyGoalsData.recruiter?.value &&
      !monthlyGoalsData.donor_center?.value
    ) {
      err = {
        recruiter: checkErrors('recruiter', monthlyGoalsData.recruiter?.value),
        donor_center: checkErrors(
          'donor_center',
          monthlyGoalsData.donor_center?.value
        ),
      };
    } else {
      err = monthlyGoalsData?.recruiter?.value
        ? {
            recruiter: checkErrors(
              'recruiter',
              monthlyGoalsData.recruiter?.value
            ),
            donor_center: '',
          }
        : {
            donor_center: checkErrors(
              'donor_center',
              monthlyGoalsData.donor_center?.value
            ),
            recruiter: '',
          };
    }
    const copy = {
      ...errors,
      collection_operation: checkErrors(
        'collection_operation',
        monthlyGoalsData.collection_operation?.value
      ),
      procedure_type: checkErrors(
        'procedure_type',
        monthlyGoalsData.procedure_type?.value
      ),
      year: checkErrors('year', monthlyGoalsData.year?.value),
      ...err,
    };
    setErrors({ ...copy });
    return copy;
  };

  const handleSubmit = async (e, redirect = false) => {
    e.preventDefault();
    const errObject = validateForm();
    if (Object.values(errObject).every((value) => value == '')) {
      if (
        monthlyGoalsData.recruiter?.value &&
        monthlyGoalsData.donor_center?.value
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          recruiter: 'Either donor center or recruiter is required.',
          donor_center: 'Either donor center or recruiter is required.',
        }));
        return;
      }
      try {
        const requestData = {
          ...monthlyGoalsData,
          collection_operation: [
            parseInt(monthlyGoalsData?.collection_operation?.value),
          ],
          procedure_type: parseInt(monthlyGoalsData.procedure_type?.value),
          year: parseInt(monthlyGoalsData.year?.value),
          donor_center: parseInt(monthlyGoalsData.donor_center?.value),
          recruiter: parseInt(monthlyGoalsData.recruiter?.value),
          total_goal: total,
        };
        const response = await axios.put(
          `${BASE_URL}/monthly_goals/${goalId}`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        const resJson = response.data;
        let { data, status, message } = resJson;

        if (status === 204) {
          // Handle successful response
          setIsNavigate(redirect);
          setModalPopUp(true);
        } else if (status === 400) {
          toast.error(`${message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
          // Handle bad request
        } else {
          toast.error(`${message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  const archive = async () => {
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
        setTimeout(() => {
          setArSuccessPopup(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setArchivePopup(false);
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setArchivePopup(false);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
      setArchivePopup(false);
    }
  };

  useEffect(() => {
    if (monthlyGoalsData?.collection_operation?.length) {
      getRecruitersandDonors();
    } else {
      setRecruiterData([]);
      setDonorsCenterData([]);
    }
  }, [monthlyGoalsData?.collection_operation]);

  const handleTab = (e, ref) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      ref && ref.current && ref.current.focus();
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Monthly Goals'}
      />
      <div className="mainContentInner form-container">
        <form className={` ${styles.formcontainer}`}>
          <div className="formGroup">
            <h5>Edit Monthly Goals</h5>
            <div className="form-field">
              <div className="field">
                <div className="position-relative">
                  <SelectDropdown
                    removeDivider
                    disabled
                    name={'collection_operation'}
                    styles={{ root: 'w-100' }}
                    showLabel={monthlyGoalsData.collection_operation?.value}
                    placeholder={'Collection Operation*'}
                    defaultValue={monthlyGoalsData.collection_operation}
                    selectedValue={monthlyGoalsData.collection_operation}
                    onChange={handleCollectionOperation}
                    options={collectionOperationData}
                    error={errors.collection_operation}
                    onBlur={(e) =>
                      handleInputBlur(
                        null,
                        e?.target?.value,
                        'collection_operation'
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="form-field">
              <div className="field">
                <div className="position-relative">
                  <SelectDropdown
                    removeDivider
                    disabled
                    showLabel={monthlyGoalsData.procedure_type?.value}
                    placeholder={'Procedure Type*'}
                    defaultValue={monthlyGoalsData.procedure_type}
                    selectedValue={monthlyGoalsData.procedure_type}
                    onChange={(e) => {
                      handleProcedureType(e);
                    }}
                    options={procedureTypeData}
                    error={errors.procedure_type}
                    onBlur={(e) =>
                      handleInputBlur(null, e.target?.value, 'procedure_type')
                    }
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
                    disabled
                    showLabel={monthlyGoalsData.year?.value}
                    placeholder={'Year*'}
                    defaultValue={monthlyGoalsData.year}
                    selectedValue={monthlyGoalsData.year}
                    onChange={(e) => {
                      handleYear(e);
                    }}
                    options={years}
                    error={errors.year}
                    onBlur={(e) =>
                      handleInputBlur(null, e.target?.value, 'year')
                    }
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
                    showLabel={monthlyGoalsData.recruiter?.value}
                    placeholder={'Recruiter*'}
                    defaultValue={monthlyGoalsData.recruiter}
                    selectedValue={monthlyGoalsData.recruiter}
                    disabled={
                      recruiterData.length === 0 ||
                      monthlyGoalsData?.donor_center?.value
                    }
                    onChange={handleRecruiter}
                    options={recruiterData}
                    // error={errors.recruiter}
                    onBlur={(e) =>
                      handleInputBlur(null, e.target?.value, 'recruiter')
                    }
                    styles={{ root: 'w-100' }}
                  />
                  {errors?.recruiter && (
                    <div className="error" style={{ marginTop: '-10px' }}>
                      <div className="error">
                        <p>{errors?.recruiter}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-field">
              <div className="field ">
                <div className="position-relative">
                  <SelectDropdown
                    removeDivider
                    placeholder={'Donors Center*'}
                    showLabel={monthlyGoalsData.donor_center?.value}
                    defaultValue={monthlyGoalsData.donor_center}
                    selectedValue={monthlyGoalsData.donor_center}
                    disabled={
                      donorsCenterData.length === 0 ||
                      monthlyGoalsData?.recruiter?.value
                    }
                    onChange={(e) => {
                      handleDonorCenter(e);
                    }}
                    options={donorsCenterData}
                    // error={errors.donor_center}
                    onBlur={(e) =>
                      handleInputBlur(null, e.target?.value, 'donor_center')
                    }
                    styles={{ root: 'w-100' }}
                  />
                  {errors?.donor_center && (
                    <div className="error" style={{ marginTop: '-10px' }}>
                      <div className="error">
                        <p>{errors?.donor_center}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="formGroup">
            <h5>Monthly Value</h5>

            <Col lg={4}>
              <FormInput
                name="january"
                onInput={preventNegative}
                classes={{ root: 'w-90 mb-3' }}
                displayName="January"
                value={monthlyGoalsData.january || ''}
                error={errors.january}
                required={false}
                handleChange={handleFormInput}
                ref={input1Ref}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                onInput={preventNegative}
                name="february"
                displayName="February"
                value={monthlyGoalsData.february || ''}
                error={errors.february}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                onInput={preventNegative}
                name="march"
                displayName="March"
                value={monthlyGoalsData.march || ''}
                error={errors.march}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="april"
                onInput={preventNegative}
                displayName="April"
                value={monthlyGoalsData.april || ''}
                error={errors.april}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="may"
                displayName="May"
                onInput={preventNegative}
                value={monthlyGoalsData.may || ''}
                error={errors.may}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="june"
                displayName="June"
                onInput={preventNegative}
                value={monthlyGoalsData.june || ''}
                error={errors.june}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="july"
                onInput={preventNegative}
                displayName="July"
                value={monthlyGoalsData.july || ''}
                error={errors.july}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="august"
                onInput={preventNegative}
                displayName="August"
                value={monthlyGoalsData.august || ''}
                error={errors.august}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="september"
                onInput={preventNegative}
                displayName="September"
                value={monthlyGoalsData.september || ''}
                error={errors.september}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="october"
                onInput={preventNegative}
                displayName="October"
                value={monthlyGoalsData.october || ''}
                error={errors.october}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="november"
                displayName="November"
                onInput={preventNegative}
                value={monthlyGoalsData.november || ''}
                error={errors.november}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <Col lg={4}>
              <FormInput
                classes={{ root: 'w-90 mb-3' }}
                name="december"
                displayName="December"
                onInput={preventNegative}
                value={monthlyGoalsData.december || ''}
                error={errors.december}
                required={false}
                handleChange={handleFormInput}
              />
            </Col>
            <p className="w-100">
              Total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {total}
            </p>
          </div>
          <div className="form-footer-custom">
            <div
              className="archived"
              onClick={() => {
                setArchivePopup(true);
              }}
            >
              Archive
            </div>
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
              className={`btn btn-md me-4 ${styles.saveandclose}  btn-secondary`}
              onClick={(e) => handleSubmit(e, true)}
            >
              Save & Close
            </button>

            <button
              type="button"
              className={`btn btn-primary btn btn-md me-4`}
              onClick={(e) => handleSubmit(e)}
              ref={input2Ref}
              onKeyDown={(e) => handleTab(e, input1Ref)}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Monthly Goal updated."
        modalPopUp={modalPopUp}
        isNavigate={isNavigate}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        redirectPath={MONTHLY_GOALS_PATH.LIST}
      />
      <SuccessPopUpModal
        title="Success!"
        message={`Monthly Goal is archived.`}
        modalPopUp={arSuccessPopup}
        isNavigate={true}
        setModalPopUp={setArSuccessPopup}
        showActionBtns={true}
        redirectPath={MONTHLY_GOALS_PATH.LIST}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={MONTHLY_GOALS_PATH.LIST}
      />
      <section className={`popup full-section ${archivePopup ? 'active' : ''}`}>
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
              <button className="btn btn-primary" onClick={() => archive()}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonthlyGoalEdit;
