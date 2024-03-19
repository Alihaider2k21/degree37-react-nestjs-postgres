import React from 'react';
import styles from '../index.module.scss';
import ToolTip from '../../../../../common/tooltip';

const DetailView = ({ title, data, isMulti, colSpan = '2', isLoading }) => {
  return (
    <div className="col-sm-12 col-md-12 col-lg-7 col-xl-7">
      <table className={`viewTables ${styles.viewusertable}`}>
        <thead>
          <tr>
            <th colSpan={colSpan}>{title}</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <td className="col2 no-data text-center">Data Loading</td>
          </tbody>
        ) : isMulti ? (
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                {item?.rowData?.map((row, index) => (
                  <td
                    key={index}
                    className={`${styles.tdBorder} ${
                      row?.class ? styles.bgTransparent : ''
                    }`}
                  >
                    {row?.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td className="col1">
                  {item?.icon ? (
                    <div className="d-flex align-items-center">
                      <span className="me-2">{item?.label}</span>{' '}
                      <div className="icon" style={{ zIndex: 1000000000 }}>
                        <ToolTip
                          text={item?.icon}
                          isDailyCapacity={true}
                          staffSetupTooltip={true}
                        />
                      </div>
                    </div>
                  ) : (
                    item?.label
                  )}
                </td>
                <td className="col2">
                  {' '}
                  {typeof item?.value === 'boolean' ? (
                    item?.value ? (
                      <span className="badge active"> Active </span>
                    ) : (
                      <span className="badge inactive"> Inactive </span>
                    )
                  ) : (
                    item?.value
                  )}{' '}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default DetailView;
