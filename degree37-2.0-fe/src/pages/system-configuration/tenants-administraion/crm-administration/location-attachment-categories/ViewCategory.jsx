import React from 'react';
import ViewCategory from '../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/location-attachment-categories/ViewCategory';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../components/common/layout';

const ViewAttachment = () => {
  const { id } = useParams();
  return (
    <Layout>
      <ViewCategory categoryId={id} />
    </Layout>
  );
};

export default ViewAttachment;
