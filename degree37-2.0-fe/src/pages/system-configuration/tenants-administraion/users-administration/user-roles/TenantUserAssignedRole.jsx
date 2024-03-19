import React from 'react';
import Layout from '../../../../../components/common/layout/index';

import { useParams } from 'react-router-dom';
import AssignedUsers from '../../../../../components/system-configuration/users-administration/user-roles/AssignedUsers';

const TenantUserAssignedRole = () => {
  const { id } = useParams();
  return (
    <Layout>
      <AssignedUsers roleId={id} />
    </Layout>
  );
};

export default TenantUserAssignedRole;
