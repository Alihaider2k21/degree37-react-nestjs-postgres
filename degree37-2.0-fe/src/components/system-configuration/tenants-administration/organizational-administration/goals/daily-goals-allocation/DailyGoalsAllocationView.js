import React, { useEffect, useState } from 'react';
import { DAILY_GOALS_ALLOCATION_PATH } from '../../../../../../routes/path';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const DailyGoalsAllocationView = ({ goalId }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [goalData, setGoalData] = useState({});
  const [userTimezone, setUserTimezone] = useState(''); // State to hold the user's timezone
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTimezone = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(timezone);
      } catch (error) {
        console.error('Error getting timezone:', error);
      }
    };

    getTimezone();
  }, []);

  useEffect(() => {
    const getData = async (goalId) => {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/daily-goals-allocation/${goalId}`
      );
      const data = result.data;
      setGoalData({
        ...data?.data,
        collection_operation: data?.data?.collection_operation
          ?.map((item) => item.name)
          .join(','),
        effective_date: format(
          new Date(
            new Date(data?.data?.effective_date).getTime() +
              Math.abs(
                new Date(data?.data?.effective_date).getTimezoneOffset() * 60000
              )
          ),
          'MM-yyyy',
          {
            locale: enUS,
            timeZone: userTimezone,
          }
        ),
        sunday: `${data?.data?.sunday}%`,
        monday: `${data?.data?.monday}%`,
        tuesday: `${data?.data?.tuesday}%`,
        wednesday: `${data?.data?.wednesday}%`,
        thursday: `${data?.data?.thursday}%`,
        friday: `${data?.data?.friday}%`,
        saturday: `${data?.data?.saturday}%`,
        total_goal: `${
          data?.data?.sunday +
          data?.data?.monday +
          data?.data?.tuesday +
          data?.data?.wednesday +
          data?.data?.thursday +
          data?.data?.friday +
          data?.data?.saturday
        }%`,
      });
      setIsLoading(false);
    };
    if (goalId) {
      getData(goalId);
    }
  }, [goalId]);

  const BreadcrumbsData = [
    ...GoalsBreadCrumbsData,
    {
      label: 'View Daily Goals Allocation',
      class: 'active-label',
      link: `${DAILY_GOALS_ALLOCATION_PATH.VIEW.replace(':id', goalId)}`,
    },
  ];

  const config = [
    {
      section: 'Daily Goals Allocation Details',
      fields: [
        { label: 'Effective Month', field: 'effective_date' },
        { label: 'Collection Operation', field: 'collection_operation' },
        { label: 'Procedure Type', field: 'procedure_type.name' },
        { label: 'Sunday', field: 'sunday' },
        { label: 'Monday', field: 'monday' },
        { label: 'Tuesday', field: 'tuesday' },
        { label: 'Wednesday', field: 'wednesday' },
        { label: 'Thursday', field: 'thursday' },
        { label: 'Friday', field: 'friday' },
        { label: 'Saturday', field: 'saturday' },
        { label: 'Daily Goals Percentage', field: 'total_goal' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Created',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'modified_by',
        },
      ],
    },
  ];

  return (
    <ViewForm
      permission={CheckPermission([
        Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_ALLOCATION
          .WRITE,
      ])}
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Daily Goals Allocation'}
      editLink={DAILY_GOALS_ALLOCATION_PATH.EDIT.replace(':id', goalId)}
      data={goalData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default DailyGoalsAllocationView;
