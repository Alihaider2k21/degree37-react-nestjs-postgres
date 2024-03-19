import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AffiliationsList from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/affiliations/AffiliationsList';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const ListAffiliations = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AffiliationsList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListAffiliations;
