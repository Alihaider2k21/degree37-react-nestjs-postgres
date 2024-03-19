import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import { GOALS_PERFORMANCE_RULES } from '../../../../../../routes/path';
import { useNavigate } from 'react-router-dom';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import GoalsNavigationTabs from '../navigationTabs';
import CancelModalPopUp from '../../../../../common/cancelModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const GoalsPerformanceRules = ({ editMode }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [closeModal, setCloseModal] = useState(false);

  const [performanceRuleData, setPerformanceRuleData] = useState({
    projection_accuracy_minimum: '',
    projection_accuracy_maximum: '',
    projection_accuracy_ref: {
      value: 'P/A Applies to*',
      label: 'P/A Applies to*',
    },
    is_include_qns: false,
  });
  const [errors, setErrors] = useState({
    projection_accuracy_minimum: '',
    projection_accuracy_maximum: '',
    projection_accuracy_ref: '',
    is_include_qns: false,
  });
  const [modalPopUp, setModalPopUp] = useState(false);

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: editMode ? 'Set Performance Rule' : 'Performance Rule',
      class: 'active-label',
      link: editMode
        ? `${GOALS_PERFORMANCE_RULES.EDIT}`
        : `${GOALS_PERFORMANCE_RULES.VIEW}`,
    },
  ];

  useEffect(() => {
    fetchPerformanceRuleData();
  }, []);

  const fetchPerformanceRuleData = async () => {
    // TODO : Add API
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/goals_performance_rules/`
    );
    let { data } = result.data;
    if (result.ok || result.status === 200) {
      data &&
        setPerformanceRuleData({
          id: data?.id,
          projection_accuracy_minimum: data?.projection_accuracy_minimum,
          projection_accuracy_maximum: data?.projection_accuracy_maximum,
          projection_accuracy_ref: {
            label: data?.projection_accuracy_ref,
            value: data?.projection_accuracy_ref,
          },
          is_include_qns: data?.is_include_qns,
        });
    }
  };

  const handleFormInput = (event) => {
    const { value, name } = event.target;
    if (name === 'projection_accuracy_ref') {
      setPerformanceRuleData({ ...performanceRuleData, [name]: value });
    } else if (name === 'is_include_qns')
      setPerformanceRuleData({
        ...performanceRuleData,
        [name]: event.target.checked,
      });
    else
      setPerformanceRuleData({
        ...performanceRuleData,
        [name]: parseInt(value),
      });
  };

  const handleInputBlur = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };
    switch (name) {
      case 'projection_accuracy_minimum':
        if (!value) {
          setError(name, 'Projection accuracy minimum is required.');
        } else {
          setError(name, '');
        }
        break;
      case 'projection_accuracy_maximum':
        if (!value) {
          setError(name, 'Projection accuracy maximum is required.');
        } else {
          setError(name, '');
        }
        break;
      case 'projection_accuracy_ref':
        if (!value || value === 'P/A Applies to*') {
          setError(name, 'P/A applies to is required.');
        } else {
          setError(name, '');
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (
      editMode &&
      performanceRuleData.projection_accuracy_minimum >
        performanceRuleData.projection_accuracy_maximum
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        projection_accuracy_minimum:
          'Should be less than project accuracy maximum',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        projection_accuracy_minimum: '',
      }));
    }
  }, [
    performanceRuleData.projection_accuracy_maximum,
    performanceRuleData.projection_accuracy_minimum,
  ]);

  const validateForm = () => {
    const copy = {
      ...errors,
      projection_accuracy_minimum:
        !performanceRuleData.projection_accuracy_minimum
          ? 'Projection accuracy minimum is required.'
          : performanceRuleData.projection_accuracy_minimum >
            performanceRuleData.projection_accuracy_maximum
          ? 'Should be less than project accuracy maximum.'
          : '',
      projection_accuracy_maximum:
        !performanceRuleData.projection_accuracy_maximum
          ? 'Projection accuracy maximum is required.'
          : '',
      projection_accuracy_ref:
        !performanceRuleData.projection_accuracy_ref.value ||
        performanceRuleData.projection_accuracy_ref.value == 'P/A Applies to*'
          ? 'Projection accuracy ref is required.'
          : '',
    };

    setErrors({ ...copy });
    return copy;
  };
  const handleSubmit = async (e, redirect = false) => {
    const errObject = validateForm();
    e.preventDefault();
    if (Object.values(errObject).every((value) => value == '')) {
      try {
        const res = await makeAuthorizedApiRequestAxios(
          performanceRuleData.id ? 'PUT' : 'POST',
          performanceRuleData.id
            ? `${BASE_URL}/goals_performance_rules/${performanceRuleData.id}`
            : `${BASE_URL}/goals_performance_rules/`,
          JSON.stringify({
            ...performanceRuleData,
            projection_accuracy_ref:
              performanceRuleData.projection_accuracy_ref.value,
          })
        );
        let resJson = res.data;
        let { data, status, message } = resJson;

        if (status === 201 || status === 200) {
          // Handle successful response
          if (redirect) setModalPopUp(true);
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

  const handleProjectionAccuracyRef = (item) => {
    handleInputBlur({
      target: { value: item.value, name: 'projection_accuracy_ref' },
    });
    setPerformanceRuleData({
      ...performanceRuleData,
      projection_accuracy_ref: item,
    });
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Performance Rules'}
      />
      <div className="filterBar">
        <GoalsNavigationTabs />
      </div>
      <div className="mainContentInner form-container">
        {!editMode &&
          CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.PERFORMANCE_RULES
              .WRITE,
          ]) && (
            <div className="buttons">
              <button
                className="btn btn-primary position-btn right-btn"
                onClick={() => {
                  navigate(GOALS_PERFORMANCE_RULES.EDIT);
                }}
              >
                Set Performance Rule
              </button>
            </div>
          )}
        <form className={`${styles.formcontainer}`}>
          <div className="formGroup">
            <h5>{editMode ? 'Set Performance Rule' : 'Performance Rule'}</h5>

            <div className="form-field">
              <div className="field">
                <div className="position-relative">
                  <input
                    type="number"
                    className="form-control"
                    placeholder=" "
                    name="projection_accuracy_minimum"
                    disabled={!editMode}
                    onBlur={handleInputBlur}
                    onChange={(e) => {
                      handleFormInput(e);
                      handleInputBlur(e);
                    }}
                    value={performanceRuleData?.projection_accuracy_minimum}
                    required
                  />
                  <label className="text-secondary">
                    Projection Accuracy Minimum*
                  </label>
                </div>
              </div>
              {errors?.projection_accuracy_minimum && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.projection_accuracy_minimum}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <div className="position-relative">
                  <input
                    type="number"
                    className="form-control"
                    name="projection_accuracy_maximum"
                    placeholder=" "
                    onBlur={handleInputBlur}
                    disabled={!editMode}
                    onChange={(e) => {
                      handleFormInput(e);
                      handleInputBlur(e);
                    }}
                    value={performanceRuleData?.projection_accuracy_maximum}
                    required
                  />
                  <label className="text-secondary">
                    Projection Accuracy Maximum*
                  </label>
                </div>
                {errors?.projection_accuracy_maximum && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.projection_accuracy_maximum}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-field">
              <div className="field">
                <div className="position-relative">
                  <SelectDropdown
                    disabled={!editMode}
                    styles={{ root: 'w-100' }}
                    // placeholder={'P/A Applies to*'}
                    defaultValue={performanceRuleData.projection_accuracy_ref}
                    selectedValue={performanceRuleData.projection_accuracy_ref}
                    removeDivider
                    showLabel={
                      performanceRuleData.projection_accuracy_ref.value ==
                      'P/A Applies to*'
                        ? false
                        : true
                    }
                    placeholder={'P/A Applies to*'}
                    removeTheClearCross
                    onChange={handleProjectionAccuracyRef}
                    options={[
                      { label: 'Product', value: 'Product' },
                      { label: 'Procedures', value: 'Procedures' },
                    ]}
                    error={errors.projection_accuracy_ref}
                    onBlur={(e) => {}}
                  />
                </div>
              </div>
            </div>
            <div className="form-field w-100">
              <div className="field">
                <div className="position-relative">
                  <input
                    className={`form-check-input p-0 ${
                      performanceRuleData.is_include_qns ? styles.checked : ''
                    }`}
                    checked={performanceRuleData.is_include_qns}
                    disabled={!editMode}
                    type="checkbox"
                    name="is_include_qns"
                    onChange={(e) => {
                      handleFormInput(e);
                    }}
                  />
                  <label className="text-dark ms-3">Include QNS</label>
                </div>
              </div>
            </div>
          </div>
        </form>
        {editMode && (
          <div className="form-footer-custom">
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
              Save
            </button>
          </div>
        )}
      </div>
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={GOALS_PERFORMANCE_RULES.VIEW}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Performance Rules updated."
        modalPopUp={modalPopUp}
        isNavigate={true}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        redirectPath={GOALS_PERFORMANCE_RULES.VIEW}
      />
    </div>
  );
};

export default GoalsPerformanceRules;
