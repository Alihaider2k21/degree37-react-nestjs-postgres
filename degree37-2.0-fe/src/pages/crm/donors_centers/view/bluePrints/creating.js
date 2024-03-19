import React from 'react';
import Layout from '../../../../../components/common/layout';
// import DonorCentersList from '../../../components/crm/donors_centers/DonorCentersList';
// import CheckPermission from '../../../helpers/CheckPermissions';
// import CrmPermissions from '../../../enums/CrmPermissionsEnum';
// import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';
// import DonorBluePrintListing from '../../../../../components/crm/donors_centers/view/bluePrints/lisiting';
import CreateDonorBluePrint from '../../../../../components/crm/donors_centers/view/bluePrints/create';

const CreateDonorCenterBluePrints = () => {
  return (
    <Layout>
      <CreateDonorBluePrint />
    </Layout>
  );
};

export default CreateDonorCenterBluePrints;
