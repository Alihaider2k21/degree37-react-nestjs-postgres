import React from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { DONOR_DONATION_HISTORY_PATH } from '../../../../../routes/path';
import DonorNavigation from '../DonorNavigation';
import { DonorBreadCrumbsData } from '../../donor/DonorBreadCrumbsData';
import ListDonationHistory from '../../../../common/donationHistory/ListDonationHistory';
import { useEffect } from 'react';

const DonorListDonationHistory = () => {
  const { donorId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...DonorBreadCrumbsData,
      {
        label: 'View Donor',
        class: 'active-label',
        link: `/crm/contacts/donor/${donorId}/view`,
      },
      {
        label: 'Donation History',
        class: 'active-label',
        link: DONOR_DONATION_HISTORY_PATH.LIST.replace(':donorId', donorId),
      },
    ]);
  }, []);

  return (
    <ListDonationHistory
      show={false}
      search={context?.search}
      donorId={donorId}
      customTopBar={<DonorNavigation />}
      breadCrumbsData={context?.breadCrumbsData}
      createTaskUrl={DONOR_DONATION_HISTORY_PATH.LIST.replace(
        ':donorId',
        donorId
      )}
    />
  );
};

export default DonorListDonationHistory;
