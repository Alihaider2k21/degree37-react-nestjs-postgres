import React from 'react';
import Approval from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/approvals/Approvals';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const Approvals = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.APPROVALS
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <Approval />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default Approvals;
