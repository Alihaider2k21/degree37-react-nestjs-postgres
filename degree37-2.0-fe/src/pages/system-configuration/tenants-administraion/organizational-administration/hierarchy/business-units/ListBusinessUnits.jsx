import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListBusinessUnit from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/ListBusinessUnits';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
import Permissions from '../../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../../helpers/CheckPermissions';

const BusinessUnitList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.BUSINESS_UNITS
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListBusinessUnit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
export default BusinessUnitList;
