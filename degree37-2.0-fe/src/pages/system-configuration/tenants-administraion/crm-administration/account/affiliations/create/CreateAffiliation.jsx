import React from 'react';
import AddAffiliation from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/affiliations/AddAffiliation';
import Layout from '../../../../../../../components/common/layout';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const CreateAffiliation = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddAffiliation />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateAffiliation;
