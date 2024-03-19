import React from 'react';
import Layout from '../../../../../components/common/layout';
import ViewStage from '../../../../../components/system-configuration/tenants-administration/crm-administration/account/stage/view/ViewStage';
import NotFoundPage from '../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
const View = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewStage />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default View;
