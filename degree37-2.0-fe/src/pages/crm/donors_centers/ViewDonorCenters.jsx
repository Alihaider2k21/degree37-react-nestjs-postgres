import React from 'react';
import Layout from '../../../components/common/layout';
import DonorCentersView from '../../../components/crm/donors_centers/DonorCentersView';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const ViewDonorCenters = () => {
  const { id } = useParams();

  const hasPermission = CheckPermission([
    CrmPermissions.CRM.DONOR_CENTERS.READ,
    CrmPermissions.CRM.DONOR_CENTERS.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DonorCentersView id={id} />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewDonorCenters;
