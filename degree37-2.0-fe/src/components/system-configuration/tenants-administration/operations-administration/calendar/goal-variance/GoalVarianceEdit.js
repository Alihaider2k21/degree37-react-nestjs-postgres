import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import ConfirmModal from '../../../../../common/confirmModal';
import CalendarNavigationTabs from '../navigationTabs';
import styles from './index.module.scss';
import ToolTip from '../../../../../common/tooltip';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import FormInput from '../../../../../common/form/FormInput';
import { Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { CalendarBreadCrumbsData } from '../CalendarBreadCrumbsData';

const GoalVarianceEdit = () => {
  const [existingGoalVarianceId, setExistingGoalVarianceId] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    over_goal: null,
    under_goal: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const jwtToken = localStorage.getItem('token');

  const fetchGoalVariance = async () => {
    console.log('Fetch Goal variance');
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/goal_variance`
      );
      const data = await response.json();

      if (data?.status === 200 && data.data) {
        const existingData = data.data;
        setFormData((prevFormData) => ({
          ...prevFormData,
          over_goal: existingData.over_goal,
          under_goal: existingData.under_goal,
        }));
        setExistingGoalVarianceId(existingData.id);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchGoalVariance();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (parseInt(value.replace(/\D/g, '')) > 100) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: 100,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parseInt(value.replace(/\D/g, '')) || 0,
      }));
    }
    setUnsavedChanges(true);
  };

  const handleBlurOverGoal = () => {
    console.log(formData.over_goal);
    if (formData.over_goal > 0 && formData.over_goal <= 100) {
      console.log('handle Blur');
      setFormErrors({ ...formErrors, over_goal: '' });
    }
  };

  const handleBlurUnderGoal = () => {
    if (formData.under_goal > 0 && formData.under_goal <= 100) {
      setFormErrors({ ...formErrors, under_goal: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    setFormErrors(errors);
    let flag = true;
    if (!formData.over_goal) {
      errors.over_goal = 'Over goal percentage is required.';
      flag = false;
    }
    if (!formData.under_goal) {
      errors.under_goal = 'Under goal percentage is required.';
      flag = false;
    }
    setFormErrors(errors);

    if (existingGoalVarianceId && flag) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`, // Include the token here
      };
      const updateBody = {
        over_goal: formData.over_goal,
        under_goal: formData.under_goal,
      };

      try {
        const response = await fetch(`${BASE_URL}/goal_variance`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(updateBody),
        });
        let data = await response.json();
        if (data.status === 200) {
          toast.success(`${data.message}`, {
            autoClose: 3000,
          });
          navigate(
            '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance'
          );
        } else {
          toast.error(`Something went wrong.`, { autoClose: 3000 });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: 'Edit Goal Variance',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance/edit',
    },
  ];

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance'
      );
    }
  };

  const preventNegative = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    const parsedValue = parseInt(value);
    if (isEmpty(value)) {
      setFormErrors({ ...formErrors, [name]: '' });
    } else if (parsedValue < 0 || isNaN(parsedValue)) {
      setFormErrors({
        ...formErrors,
        [name]: 'Please enter a positive value.',
      });
      console.log({ formData, formErrors });
    } else if (parsedValue > 100) {
      setFormErrors({
        ...formErrors,
        [name]: `${
          name == 'over_goal' ? 'Over Goal' : 'Under Goal'
        } must be between 1 and 100.`,
      });
      console.log({ formData, formErrors });
    } else {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  return (
    <div className={`${styles.mainContent} mainContent`}>
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Goal Variance'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="filterBar">
        <CalendarNavigationTabs />
      </div>

      <div className="mainContentInner">
        <form className={`${styles.goalVarianceForm}`}>
          <div className="formGroup">
            <div className="heading-group">
              <h5>Edit Goal Variance</h5>
              <ToolTip
                text={
                  'These two settings inform the visual indication for over or under goal on the calendar. (Examples 115%, 85%)'
                }
              />
            </div>
            <Col lg={6}>
              <FormInput
                name="over_goal"
                classes={{ root: 'w-90 mb-3' }}
                onInput={preventNegative}
                displayName="Over Goal (Percentage)"
                value={formData.over_goal}
                error={formErrors.over_goal}
                handleChange={(e) => {
                  handleInputChange(e);
                }}
                onBlur={handleBlurOverGoal}
              />
            </Col>
            <Col lg={6}>
              <FormInput
                name="under_goal"
                classes={{ root: 'w-90 mb-3' }}
                onInput={preventNegative}
                displayName="Under Goal (Percentage)"
                value={formData.under_goal}
                error={formErrors.under_goal}
                handleChange={(e) => {
                  handleInputChange(e);
                }}
                onBlur={handleBlurUnderGoal}
              />
            </Col>{' '}
          </div>
        </form>
        <div className="form-footer">
          <button className="btn btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>
          <button
            type="button"
            className={` ${`btn btn-primary`}`}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <ConfirmModal
          showConfirmation={showConfirmationDialog}
          onCancel={() => handleConfirmationResult(false)}
          onConfirm={() => handleConfirmationResult(true)}
          icon={CancelIconImage}
          heading={'Confirmation'}
          description={'Unsaved changes will be lost. Do you want to continue?'}
        />
      </div>
    </div>
  );
};

export default GoalVarianceEdit;
