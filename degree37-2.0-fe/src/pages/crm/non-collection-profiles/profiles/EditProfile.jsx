import React from 'react';
import Layout from '../../../../components/common/layout';
import ProfileEdit from '../../../../components/crm/non-collection-profiles/profiles/ProfileEdit';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const EditProfile = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ProfileEdit />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default EditProfile;
