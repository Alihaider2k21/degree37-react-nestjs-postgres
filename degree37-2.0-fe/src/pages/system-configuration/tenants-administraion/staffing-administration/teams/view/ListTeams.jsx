import React from 'react';
import TeamsList from '../../../../../../components/system-configuration/tenants-administration/staffing-administration/teams/TeamsList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const ListTeams = () => {
  return CheckPermission(null, [
    Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.MODULE_CODE,
  ]) ? (
    <Layout>
      <TeamsList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default ListTeams;
