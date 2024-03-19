import React from 'react';
import StageListing from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/stage/StageListing';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const StagingList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <StageListing />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default StagingList;
