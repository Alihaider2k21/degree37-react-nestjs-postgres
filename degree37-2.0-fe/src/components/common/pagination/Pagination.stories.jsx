import React, { useState } from 'react';
import Pagination from './index';

// Wrapper component for Pagination
const PaginationWrapper = ({
  limit: initialLimit,
  currentPage: initialPage,
  totalRecords,
  componentName,
}) => {
  const [limit, setLimit] = useState(initialLimit);
  const [currentPage, setCurrentPage] = useState(initialPage);

  return (
    <Pagination
      limit={limit}
      setLimit={setLimit}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalRecords={totalRecords}
      componentName={componentName}
    />
  );
};

export default {
  title: 'Components/Pagination',
  component: PaginationWrapper, // Use the wrapper component in your story
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const pagination = (args) => <PaginationWrapper {...args} />;

// Default args for the story
pagination.args = {
  currentPage: 1,
  totalRecords: 40,
  limit: 2,
  componentName: '',
};
