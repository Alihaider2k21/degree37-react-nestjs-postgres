import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AssignMembersList from '../../../../../../../components/system-configuration/tenants-administration/staffing-administration/teams/assign-members/AssignMembersList';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
const ListAssignMembers = () => {
  return CheckPermission(null, [
    Permissions.STAFF_ADMINISTRATION.TEAMS.ASSIGNED_MEMBER.MODULE_CODE,
  ]) ? (
    <Layout>
      <AssignMembersList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default ListAssignMembers;
