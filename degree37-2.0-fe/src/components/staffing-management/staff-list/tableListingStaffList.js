import React from 'react';
import SvgComponent from '../../common/SvgComponent';
import { useNavigate } from 'react-router-dom';
import * as _ from 'lodash';

const TableList = ({ isLoading, data, headers, handleSort, optionsConfig }) => {
  const navigate = useNavigate();

  const renderOptions = (rowData) => {
    return (
      <div className="dropdown-center">
        <div
          className="optionsIcon"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <SvgComponent name={'ThreeDots'} />
        </div>
        <ul className="dropdown-menu">
          {optionsConfig.map((option) =>
            option ? (
              <li key={option.label}>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    if (option.path) {
                      const path = option.path(rowData);
                      navigate(path);
                    } else if (option.action) {
                      option.action(rowData);
                    }
                  }}
                  href="javascript:void(0);"
                >
                  {option.label}
                </a>
              </li>
            ) : (
              ''
            )
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="table-listing-main">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {_.compact(headers)
                .filter((item) => item.checked)
                .map((header) => (
                  <th
                    key={header.name}
                    width={header.width}
                    style={{ minWidth: `${header.minWidth}` }}
                    align="center"
                  >
                    <div className="inliner">
                      <div className="title">
                        {header?.splitlabel ? (
                          header?.label.split(' ').map((word, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <br />} {word}
                            </React.Fragment>
                          ))
                        ) : (
                          <span className="title">{header.label}</span>
                        )}
                      </div>
                      {header.sortable && (
                        <div
                          className="sort-icon"
                          onClick={() => {
                            handleSort(header.name);
                          }}
                        >
                          <SvgComponent name={'SortIcon'} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}

              <th align="center">
                <div className="flex align-items-center justify-content-center">
                  <div className="account-list-header dropdown-center ">
                    {/* Empty Action Header */}
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="no-data" colSpan={headers.length + 1}>
                  Data Loading
                </td>
              </tr>
            ) : data?.length ? (
              data.map((rowData, index) => {
                return (
                  <tr key={`${rowData.staff_id}-${index}`}>
                    {_.compact(headers)
                      .filter((item) => item.checked)
                      .map((header, index) => (
                        <td key={`${rowData.staff_id}-${index}`}>
                          {header.name === 'status' ? (
                            rowData[header.name] ? (
                              <span className="badge active">Active</span>
                            ) : (
                              <span className="badge inactive">Inactive</span>
                            )
                          ) : (
                            rowData[header.name] || 'N/A'
                          )}
                        </td>
                      ))}
                    {optionsConfig && (
                      <td className="options">{renderOptions(rowData)}</td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="no-data" colSpan={headers.length + 1}>
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableList;
