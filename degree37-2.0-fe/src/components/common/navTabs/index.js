import React from 'react';
import { Link } from 'react-router-dom';
import SvgComponent from '../SvgComponent';

const NavTabs = ({
  tabs,
  currentLocation,
  editLink,
  editLinkName,
  buttonRight,
  marginBtmZero,
}) => {
  return (
    <div className={`tabs ${marginBtmZero ? 'mb-0' : ''}`}>
      <div className="d-flex justify-content-between">
        <ul>
          {tabs?.map((tab, index) =>
            tab ? (
              <li key={index}>
                <Link
                  to={tab.link}
                  className={`${
                    currentLocation === tab.link ||
                    tab?.relevantLinks?.some((link) =>
                      window.location.pathname.includes(link)
                    )
                      ? 'active'
                      : ''
                  } ${tab.className || ''}`}
                >
                  {tab.label}
                </Link>
              </li>
            ) : (
              ''
            )
          )}
        </ul>
        {editLink && (
          <div className="buttons">
            <Link to={editLink}>
              <span className="icon">
                <SvgComponent name="EditIcon" />
              </span>
              <span className="text">{editLinkName}</span>
            </Link>
          </div>
        )}
        {buttonRight && buttonRight}
      </div>
    </div>
  );
};

export default NavTabs;
