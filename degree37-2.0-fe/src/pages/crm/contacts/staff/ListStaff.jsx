import React from 'react';
import Layout from '../../../../components/common/layout';
import StaffList from '../../../../components/crm/contacts/staff/StaffList';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ListStaff = () => {
  const hasPermission = CheckPermission(null, [
    CrmPermissions.CRM.CONTACTS.STAFF.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <StaffList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListStaff;
