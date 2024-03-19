import React from 'react';
import BreadCrumbs from './index';
export default {
  title: 'Components/Breadcrumb',
  component: BreadCrumbs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Breadcrumb = {
  render: ({ data, title }) => <BreadCrumbs data={data} title={title} />,
  args: {
    data: [
      { label: 'System Configuration', class: 'disable-label', link: '/' },
      {
        label: 'CRM Administration',
        class: 'disable-label',
        link: '#',
      },
      {
        label: 'Location',
        class: 'disable-label',
        link: '#',
      },
      {
        label: 'View Attachment Subcategory',
        class: 'disable-label',
        link: '#',
      },
    ],
    title: 'BreadCrumb',
  },
};
