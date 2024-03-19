import React from 'react';
import ViewSingleAffiliation from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/affiliations/ViewSingleAffiliation';
import Layout from '../../../../../../../components/common/layout';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const ViewAffiliations = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewSingleAffiliation />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewAffiliations;
