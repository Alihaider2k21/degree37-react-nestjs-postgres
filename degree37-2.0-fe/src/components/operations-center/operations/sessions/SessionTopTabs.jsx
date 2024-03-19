// import React, { useEffect, useState } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../../../styles/Global/Global.scss';
import '../../../../styles/Global/Global.scss';
// import Session from './Session';
import NavTabs from '../../../common/navTabs';
const SessionTopTabs = ({
  editLink,
  editName,
  custLeftComp = null,
  buttonRight,
  marginBtmZero,
  tabs,
}) => {
  const location = useLocation();
  const currentLocation = location.pathname;
  return (
    <div className="imageMainContent">
      {/* <Session /> */}
      <div
        className={custLeftComp ? `d-flex justify-content-between mb-2` : ''}
      >
        <div className="crmTabBar">
          <NavTabs
            marginBtmZero={marginBtmZero}
            tabs={tabs}
            currentLocation={currentLocation}
            isedit={true}
            editLink={editLink}
            editLinkName={editName}
            buttonRight={buttonRight}
          />
        </div>
        {custLeftComp && custLeftComp}
      </div>
    </div>
  );
};

export default SessionTopTabs;
