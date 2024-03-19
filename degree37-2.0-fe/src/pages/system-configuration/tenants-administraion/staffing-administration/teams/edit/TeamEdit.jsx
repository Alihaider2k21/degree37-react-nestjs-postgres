import React from 'react';
import Layout from '../../../../../../components/common/layout';
import EditTeam from '../../../../../../components/system-configuration/tenants-administration/staffing-administration/teams/EditTeam';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const TeamEdit = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.WRITE,
  ]) ? (
    <Layout>
      <EditTeam />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default TeamEdit;
