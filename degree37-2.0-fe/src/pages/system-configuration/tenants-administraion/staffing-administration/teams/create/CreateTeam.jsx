import React from 'react';
import AddTeam from '../../../../../../components/system-configuration/tenants-administration/staffing-administration/teams/AddTeam';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateTeam = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.WRITE,
  ]) ? (
    <Layout>
      <AddTeam />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateTeam;
