import React from 'react';
import styles from '../index.module.scss';

export default function Resources({ shiftDetailsData }) {
  return (
    <table className="viewTables w-100 ">
      <thead>
        <tr>
          <th colSpan="2" className={styles.projectionTableHeading}>
            Resources
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            Staff Setup
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {shiftDetailsData?.staff_setup?.length
              ? shiftDetailsData?.staff_setup?.map((item, index) => (
                  <>
                    {item?.name}
                    {index !== shiftDetailsData?.staff_setup?.length - 1
                      ? ', '
                      : ''}
                  </>
                ))
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            Vehicles
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {' '}
            {shiftDetailsData?.vehicle?.length
              ? shiftDetailsData?.vehicle?.map((item, index) => (
                  <>
                    {item?.name}
                    {index !== shiftDetailsData?.vehicle?.length - 1
                      ? ', '
                      : ''}
                  </>
                ))
              : 'N/A'}
          </td>
        </tr>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            Devices
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {shiftDetailsData?.device?.length
              ? shiftDetailsData?.device?.map((item, index) => (
                  <>
                    {item?.name}
                    {index !== shiftDetailsData?.device?.length - 1 ? ', ' : ''}
                  </>
                ))
              : 'N/A'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
