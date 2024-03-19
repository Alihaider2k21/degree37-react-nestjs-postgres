import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CalendarNavigationTabs from '../navigationTabs';
import styles from './index.module.scss';
import ToolTip from '../../../../../common/tooltip';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import { CalendarBreadCrumbsData } from '../CalendarBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const GoalVarianceView = () => {
  const [id, setId] = useState('');
  const [tenantId, setTenantId] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    over_goal: null,
    under_goal: null,
    created_by: +id,
    tenant_id: +tenantId,
  });

  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id && decodeToken?.tenantId) {
        setId(+decodeToken?.id);
        setTenantId(+decodeToken?.tenantId);
      }
    }

    const fetchGoalVariance = async () => {
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
          setIsEditMode(true);
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    };

    fetchGoalVariance();
  }, [BASE_URL, jwtToken]);

  const handleClick = () => {
    if (isEditMode) {
      navigate('edit'); // Redirect to edit page
    } else {
      navigate('create'); // Redirect to create page
    }
  };

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: 'Set Goal Variance',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance',
    },
  ];

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
      {CheckPermission([
        Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.GOAL_VARIANCE.WRITE,
      ]) && (
        <div className={`${styles.buttons} buttons`}>
          <button className="btn btn-primary" onClick={() => handleClick()}>
            {isEditMode ? 'Edit Goal Variance' : 'Create Goal Variance'}
          </button>
        </div>
      )}
      <div className="mainContentInner">
        <form className={`${styles.goalVarianceForm}`}>
          <div className="formGroup">
            <div className="heading-group">
              <h5>Set Goal Variance</h5>
              <ToolTip
                text={
                  'These two settings inform the visual indication for over or under goal on the calendar. (Examples 115%, 85%)'
                }
              />
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="number"
                  className="form-control"
                  name="over_goal"
                  placeholder=" "
                  required
                  min={1}
                  value={formData.over_goal}
                  disabled
                />

                <label>Over Goal (Percentage)</label>
              </div>
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="number"
                  className="form-control"
                  name="under_goal"
                  placeholder=" "
                  required
                  min={1}
                  value={formData.under_goal}
                  disabled
                />

                <label>Under Goal (Percentage)</label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalVarianceView;
