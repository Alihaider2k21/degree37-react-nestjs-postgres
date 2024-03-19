import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TabNavigation = [
  {
    link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
    title: 'Room Sizes',
  },
  {
    title: 'Attachment Categories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-categories',
  },
  {
    title: 'Attachment Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories',
  },
  {
    title: 'Note Categories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/note-categories',
  },
  {
    title: 'Note Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/note-subcategories/list',
  },
];

const FilterTab = ({ navLinks = TabNavigation }) => {
  const location = useLocation();
  const currentLocation = location.pathname;
  return (
    <div className="filterBar">
      <div className="tabs">
        <ul>
          {navLinks?.map((item, index) => (
            <li key={index}>
              <Link
                to={item?.link}
                className={currentLocation === item?.link ? 'active' : ''}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterTab;
