/* eslint-disable */

import React from 'react';
import TopBar from '../../common/Topbar';
import { BuildSchduleBreadCrumbData } from './BuildScheduleBreadCrumbData';
import { STAFFING_MANAGEMENT_BUILD_SCHEDULE } from '../../../routes/path';
import { useNavigate } from 'react-router-dom';
const BuildSchedule = () => {
  const navigate = useNavigate();

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BuildSchduleBreadCrumbData}
        BreadCrumbsTitle={'Build Schedule'}
      />
      <div className="buttons">
        <button
          style={{
            minHeight: '0px',
            padding: '12px 32px 12px 32px',
          }}
          className="btn btn-primary"
          onClick={() => navigate(STAFFING_MANAGEMENT_BUILD_SCHEDULE.CREATE)}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default BuildSchedule;
