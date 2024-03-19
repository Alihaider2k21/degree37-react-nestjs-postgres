import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TabNavigation } from './data';

const FilterTabs = ({ navLinks = TabNavigation }) => {
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
                className={
                  currentLocation === item?.link ||
                  currentLocation.includes(item?.link)
                    ? 'active'
                    : ''
                }
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

export default FilterTabs;
