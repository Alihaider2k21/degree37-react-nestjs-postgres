import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AssignMembers from '../../../../../../../components/system-configuration/tenants-administration/staffing-administration/teams/assign-members/AssignMembers';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const AssignMembersCreate = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.TEAMS.ASSIGNED_MEMBER.WRITE,
  ]) ? (
    <Layout>
      <AssignMembers />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default AssignMembersCreate;
