import React from 'react';
import Layout from '../../../components/common/layout';
// import DonorCentersList from '../../../components/crm/donors_centers/DonorCentersList';
// import CheckPermission from '../../../helpers/CheckPermissions';
// import CrmPermissions from '../../../enums/CrmPermissionsEnum';
// import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';
import BeginApprovals from '../../../components/operations-center/approvals/beginApprovals';

const ApprovalsBeginApproval = () => {
  return (
    <Layout>
      <BeginApprovals />
    </Layout>
  );
};

export default ApprovalsBeginApproval;
