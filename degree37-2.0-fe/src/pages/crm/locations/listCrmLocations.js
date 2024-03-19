import React from 'react';
import ListCrmLocation from '../../../components/crm/locations/listCrmLocations';
import Layout from '../../../components/common/layout';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const ListCrmLocations = () => {
  const hasPermission = CheckPermission(null, [
    CrmPermissions.CRM.LOCATIONS.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListCrmLocation />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListCrmLocations;
