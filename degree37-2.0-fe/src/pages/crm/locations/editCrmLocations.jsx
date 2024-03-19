import React from 'react';
import Layout from '../../../components/common/layout';
import UpsetCrmLocations from '../../../components/crm/locations/upsetCrmLocations';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const EditCrmLocations = () => {
  const hasPermission = CheckPermission([CrmPermissions.CRM.LOCATIONS.WRITE]);
  if (hasPermission) {
    return (
      <div>
        <Layout>
          <UpsetCrmLocations />
        </Layout>
      </div>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default EditCrmLocations;
