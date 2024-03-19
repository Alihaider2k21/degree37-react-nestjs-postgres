import React from 'react';
import Layout from '../../../components/common/layout';
import ViewCrmLocations from '../../../components/crm/locations/crmLocationsView';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

function ViewCrmLocartion() {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.LOCATIONS.WRITE,
    CrmPermissions.CRM.LOCATIONS.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewCrmLocations />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
}

export default ViewCrmLocartion;
