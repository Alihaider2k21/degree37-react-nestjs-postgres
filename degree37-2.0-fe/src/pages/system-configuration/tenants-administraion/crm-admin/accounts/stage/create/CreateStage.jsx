import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import CreateNewStage from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/stage/create/CreateNewStage';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
const CreateStage = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <CreateNewStage />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateStage;
