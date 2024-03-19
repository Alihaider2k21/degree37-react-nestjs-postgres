import React from 'react';
import Layout from '../../../../components/common/layout';
import ViewAbout from '../../../../components/crm/non-collection-profiles/about/ViewAbout';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const AboutView = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE,
    CrmPermissions.CRM.NON_COLLECTION_PROFILES.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewAbout />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default AboutView;
