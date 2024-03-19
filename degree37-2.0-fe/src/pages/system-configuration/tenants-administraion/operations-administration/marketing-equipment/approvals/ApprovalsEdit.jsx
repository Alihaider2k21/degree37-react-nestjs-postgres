import React from 'react';
import EditApproval from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/approvals/EditApprovals';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ApprovalsEdit = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.APPROVALS.WRITE,
  ]) ? (
    <Layout>
      <EditApproval />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ApprovalsEdit;
