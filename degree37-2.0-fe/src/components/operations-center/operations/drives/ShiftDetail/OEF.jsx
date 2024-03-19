import React, { useState } from 'react';
import styles from '../index.module.scss';

export default function OperationalEfficiencyFactor({ shiftDetailsData }) {
  const [oefToggle, setOefToggle] = useState(false);

  return (
    <table className="viewTables w-100 ">
      <thead>
        <tr>
          <th colSpan="2" className={styles.projectionTableHeading}>
            <div className="d-flex align-items-center justify-content-between">
              <span className="left-heading">
                Operational Efficiency Factor (OEF)
              </span>
              <button
                onClick={() => setOefToggle(!oefToggle)}
                className="btn btn-link btn-md bg-transparent "
              >
                {oefToggle ? 'View As Products' : 'View As Procedures'}
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.projectName} style={{ width: '40%' }}>
            {oefToggle ? 'OEF (Procedures)' : 'OEF (Products)'}
          </td>
          <td className={`${styles.projectName} bg-white`}>
            {oefToggle
              ? shiftDetailsData?.oef_procedures
                ? Number(shiftDetailsData?.oef_procedures).toFixed(2)
                : 'N/A'
              : shiftDetailsData?.oef_products
              ? Number(shiftDetailsData?.oef_products).toFixed(2)
              : 'N/A'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
