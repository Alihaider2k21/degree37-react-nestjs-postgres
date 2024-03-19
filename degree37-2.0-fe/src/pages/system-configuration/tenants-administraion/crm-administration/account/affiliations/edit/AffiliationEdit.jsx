import React from 'react';
import EditAffiliation from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/affiliations/EditAffiliation';
import Layout from '../../../../../../../components/common/layout';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const AffiiliationEdit = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditAffiliation />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default AffiiliationEdit;
