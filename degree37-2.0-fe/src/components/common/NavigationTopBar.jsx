import React from 'react';

const NavigationTopBar = ({ img, data }) => {
  return (
    <div className="d-flex align-items-center gap-3 ">
      <div style={{ width: '62px', height: '62px' }}>
        <img src={img} style={{ width: '100%' }} alt="CancelIcon" />
      </div>
      <div className="d-flex flex-column">
        <h4 className="">{data?.account?.name || ''}</h4>
        <span style={{ fontSize: '20px' }}>
          {data?.crm_locations?.name || ''}
        </span>
      </div>
    </div>
  );
};

export default NavigationTopBar;
