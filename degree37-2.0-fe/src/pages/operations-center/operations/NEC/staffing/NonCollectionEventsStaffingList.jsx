import React from 'react';
import Layout from '../../../../../components/common/layout';
import NonCollectionEventsListStaffing from '../../../../../components/operations-center/operations/NCE/staffing/NonCollectionEventsListStaffing';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import OcPermissions from '../../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const NonCollectionEventsStaffingList = () => {
  const hasPermission = CheckPermission(null, [
    OcPermissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.STAFFING,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <NonCollectionEventsListStaffing />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default NonCollectionEventsStaffingList;
