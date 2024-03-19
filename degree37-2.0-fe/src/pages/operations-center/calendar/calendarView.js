import React from 'react';
import Layout from '../../../components/common/layout';
// import DonorCentersList from '../../../components/crm/donors_centers/DonorCentersList';
// import CheckPermission from '../../../helpers/CheckPermissions';
// import CrmPermissions from '../../../enums/CrmPermissionsEnum';
// import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';
import ViewCalendar from '../../../components/operations-center/calendar/calendarView';

const CalendarView = () => {
  return (
    <Layout>
      <ViewCalendar />
    </Layout>
  );
};

export default CalendarView;
