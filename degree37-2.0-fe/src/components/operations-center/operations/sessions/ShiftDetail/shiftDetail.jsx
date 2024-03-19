import moment from 'moment';
import React from 'react';
import styles from '../Session.module.scss';

export default function shiftDetail({ shiftDetailsData }) {
  return (
    <table className="viewTables w-100 ">
      <thead>
        <tr>
          <th colSpan="2" className={styles.projectionTableHeading}>
            Shift Details
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            Start Time
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {shiftDetailsData?.start_time
              ? moment(shiftDetailsData?.start_time).local().format('hh:mm A')
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            End Time
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {shiftDetailsData?.end_time
              ? moment(shiftDetailsData?.end_time).local().format('hh:mm A')
              : 'N/A'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
