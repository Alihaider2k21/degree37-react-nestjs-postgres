import React from 'react';
import Layout from '../../../../../components/common/layout';
import DrivesListStaffing from '../../../../../components/operations-center/operations/drives/staffing/DrivesListStaffing';
import NotFoundPage from '../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import OcPermissions from '../../../../../enums/OcPermissionsEnum';

const DrivesStaffingList = () => {
  const hasPermission = CheckPermission(null, [
    OcPermissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.STAFFING,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DrivesListStaffing />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default DrivesStaffingList;
