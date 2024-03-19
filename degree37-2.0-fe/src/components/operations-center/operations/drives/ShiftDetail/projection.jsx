import React from 'react';
import styles from '../index.module.scss';

export default function Projection({ shiftDetailsData }) {
  return (
    <table className="viewTables w-100 mt-3">
      <thead>
        <tr>
          <th colSpan="5" className={styles.projectionTableHeading}>
            <span>Projection(s)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <table>
          <thead></thead>
          <tbody>
            <div className="d-flex">
              <div className="flex-grow-1">
                <table className="">
                  <thead>
                    <tr>
                      <th className={styles.projectionHeading}>
                        <span>Procedure Type</span>
                      </th>
                      <th className={styles.projectionHeading}>Qty</th>
                    </tr>
                  </thead>

                  <tbody>
                    {shiftDetailsData?.procedure_types?.length > 0 &&
                      shiftDetailsData?.procedure_types?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className={styles.projectName}>
                              {' '}
                              {item?.name}
                            </td>
                            <td className={styles.projectQty}>
                              {item?.procedure_type_qty}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="flex-grow-1">
                <table className="">
                  <thead>
                    <tr>
                      <th className={styles.projectionHeading}>Product Type</th>
                      <th className={styles.projectionHeading}>Qty</th>
                    </tr>
                  </thead>

                  <tbody>
                    {shiftDetailsData?.products?.length > 0 &&
                      shiftDetailsData?.products.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className={styles.projectName}>
                              {' '}
                              {item?.name}
                            </td>
                            <td className={styles.projectQty}>
                              {item?.product_qty}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </tbody>
        </table>
      </tbody>
    </table>
  );
}
