import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { DashDateFormat } from '../../../helpers/formatDate';
import styles from './index.module.scss';

const PrintTemplate = ({ scheduleData }) => {
  const printRef = useRef();

  useEffect(() => {
    if (scheduleData.length > 0) {
      handlePrint();
      console.log();
    }
  }, [scheduleData]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    scheduleData && (
      <div ref={printRef} className={styles.printTemplate}>
        <h2>Staff Schedule</h2>
        <div className="info">
          <div className="left-column">
            <h5>Start Date:</h5>
            <h5>End Date:</h5>
            <h5>Staff ID:</h5>
          </div>
          <div className="right-column">
            <h5>{DashDateFormat(scheduleData?.[0]?.start_date)}</h5>
            <h5>{DashDateFormat(scheduleData?.[0]?.end_date)}</h5>
            <h5>{scheduleData?.[0]?.staff_id}</h5>
          </div>
        </div>
        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width={'20%'} align="center">
                    Date
                  </th>
                  <th width={'20%'} align="center">
                    Description
                  </th>
                  <th width={'20%'} align="center">
                    Role
                  </th>
                  <th width={'20%'} align="center">
                    Start Time
                  </th>
                  <th width={'20%'} align="center">
                    End Time
                  </th>
                  <th width={'20%'} align="center">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {scheduleData?.map((item, key) => (
                  <tr key={key}>
                    <td>{item?.date}</td>
                    <td>{item?.date_description?.description}</td>
                    <td>{item?.role}</td>
                    <td>{item?.start_time}</td>
                    <td>{item?.end_time}</td>
                    <td>{item?.total_hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default PrintTemplate;
