import React from 'react';
import CreateCrmLocations from '../../../components/crm/locations/createCrmLocations';
import Layout from '../../../components/common/layout';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const LocationsCreate = () => {
  const hasPermission = CheckPermission([CrmPermissions.CRM.LOCATIONS.WRITE]);
  if (hasPermission) {
    return (
      <div>
        <Layout>
          <CreateCrmLocations />
        </Layout>
      </div>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default LocationsCreate;
