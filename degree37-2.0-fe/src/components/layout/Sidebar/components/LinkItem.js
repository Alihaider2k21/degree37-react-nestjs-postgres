import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import sidebar from '../../../../styles/sidebar.module.scss';

const LinkItem = ({ title, icon, isActive, onClick, component }) => {
  return (
    <>
      <li className="nav-item fs-4">
        <a
          href="#"
          className={
            isActive
              ? `nav-link ${sidebar.active}`
              : `nav-link ${sidebar.sidebarText}`
          }
          aria-current="page"
          onClick={onClick}
        >
          <FontAwesomeIcon
            icon={icon}
            className={`fs-4 fas fa-lg me-3 fa-fw fa-gauge`}
          />
          <span className="fs-5 ms-1 d-none d-sm-inline">{title}</span>
        </a>
      </li>
      {isActive && component}
    </>
  );
};

export default LinkItem;
