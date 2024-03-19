import React, { useEffect, useState } from 'react';
import { MONTHLY_GOALS_PATH } from '../../../../../../routes/path';
import ViewForm from '../../../../../common/ViewForm';
import { GoalsBreadCrumbsData } from '../GoalsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import axios from 'axios';

const config = [
  {
    section: 'Owner Details',
    fields: [
      { label: 'Procedure Type', field: 'procedure_type.name' },
      { label: 'Year', field: 'year' },
      { label: 'Owner', field: 'owner' },
      { label: 'Total goal', field: 'total_goal' },
    ],
  },
  {
    section: 'Monthly Goals',
    fields: [
      { label: 'January', field: 'january' },
      { label: 'February', field: 'february' },
      { label: 'March', field: 'march' },
      { label: 'April', field: 'april' },
      { label: 'May', field: 'may' },
      { label: 'June', field: 'june' },
      { label: 'July', field: 'july' },
      { label: 'August', field: 'august' },
      { label: 'September', field: 'september' },
      { label: 'October', field: 'october' },
      { label: 'November', field: 'november' },
      { label: 'December', field: 'december' },
    ],
  },
  {
    section: 'Insights',
    fields: [
      {
        label: 'Collection Operation',
        field: 'collection_operation',
      },
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
const MonthlyGoalView = ({ goalId }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [goalData, setGoalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (goalId) => {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/monthly_goals/${goalId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });

      const data = response.data;
      setGoalData({
        ...data?.data,
        owner:
          data?.data?.donor_center?.name ||
          '' ||
          `${data?.data?.recruiter?.first_name || ''} ${
            data?.data?.recruiter?.last_name || ''
          }`,
        collection_operation: data?.data?.collection_operation?.[0]?.name || '',
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
      label: 'View Monthly Goals',
      class: 'active-label',
      link: `${MONTHLY_GOALS_PATH.VIEW.replace(':id', goalId)}`,
    },
  ];

  return (
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Monthly Goals'}
      editLink={
        CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.MONTHLY_GOALS.WRITE,
        ]) && MONTHLY_GOALS_PATH.EDIT.replace(':id', goalId)
      }
      isLoading={isLoading}
      data={goalData}
      config={config}
    />
  );
};

export default MonthlyGoalView;
