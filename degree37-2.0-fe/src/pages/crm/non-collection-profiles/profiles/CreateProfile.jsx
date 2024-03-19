import React from 'react';
import Layout from '../../../../components/common/layout';
import ProfileCreate from '../../../../components/crm/non-collection-profiles/profiles/ProfileCreate';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const CreateProfile = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ProfileCreate />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateProfile;
