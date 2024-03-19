import React from 'react';
import styles from '../index.module.scss';

const DetailView = ({ title, data, isLoading }) => {
  return (
    <div className="col-sm-12 col-md-12 col-l-6 col-xl-6">
      <table className={`viewTables ${styles.viewusertable}`}>
        <thead>
          <tr>
            <th colSpan="2">{title}</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td className="col2 text-center">Data Loading</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td className="col1">{item?.label}</td>
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
