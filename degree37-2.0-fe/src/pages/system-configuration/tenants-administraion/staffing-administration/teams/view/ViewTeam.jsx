import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ViewSingleTeam from '../../../../../../components/system-configuration/tenants-administration/staffing-administration/teams/ViewSingleTeam';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const ViewTeam = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.READ,
  ]) ? (
    <Layout>
      <ViewSingleTeam />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default ViewTeam;
