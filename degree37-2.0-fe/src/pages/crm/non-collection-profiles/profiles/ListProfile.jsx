import React from 'react';
import Layout from '../../../../components/common/layout';
import ProfileList from '../../../../components/crm/non-collection-profiles/profiles/ProfileList';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ListProfile = () => {
  const hasPermission = CheckPermission(null, [
    CrmPermissions.CRM.NON_COLLECTION_PROFILES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ProfileList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListProfile;
