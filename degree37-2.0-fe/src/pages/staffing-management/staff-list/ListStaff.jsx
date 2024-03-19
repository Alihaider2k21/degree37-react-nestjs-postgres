import React from 'react';
import Layout from '../../../components/common/layout';
import StaffList from '../../../components/staffing-management/staff-list/StaffList';
import CheckPermission from '../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';
import StaffingPermissions from '../../../enums/StaffingPermissionsEnum';
const ListStaff = () => {
  const hasPermission = CheckPermission(null, [
    StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <StaffList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};
export default ListStaff;
