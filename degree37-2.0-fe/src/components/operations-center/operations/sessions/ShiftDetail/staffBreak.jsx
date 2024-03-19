import moment from 'moment';
import React from 'react';
import styles from '../Session.module.scss';

export default function StaffBreak({ shiftDetailsData }) {
  return (
    <table className="viewTables w-100 mt-3">
      <thead>
        <tr>
          <th colSpan="2" className={styles.projectionTableHeading}>
            Staff Break
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            Start Time
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {shiftDetailsData?.break_start_time
              ? moment(shiftDetailsData?.break_start_time)
                  .local()
                  .format('hh:mm A')
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            End Time
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {shiftDetailsData?.break_start_time
              ? moment(shiftDetailsData?.break_end_time)
                  .local()
                  .format('hh:mm A')
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            Reduce Slots
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {' '}
            {shiftDetailsData?.reduce_slots ? 'Yes' : 'No'}
          </td>
        </tr>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            Appointment Reduction
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {shiftDetailsData?.reduction_percentage
              ? `${Math.round(shiftDetailsData?.reduction_percentage)}%`
              : 'N/A'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
