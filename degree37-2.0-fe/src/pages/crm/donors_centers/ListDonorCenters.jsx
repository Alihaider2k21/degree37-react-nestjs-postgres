import React from 'react';
import Layout from '../../../components/common/layout';
import DonorCentersList from '../../../components/crm/donors_centers/DonorCentersList';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const ListDonorCenters = () => {
  const hasPermission = CheckPermission(null, [
    CrmPermissions.CRM.DONOR_CENTERS.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DonorCentersList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListDonorCenters;
