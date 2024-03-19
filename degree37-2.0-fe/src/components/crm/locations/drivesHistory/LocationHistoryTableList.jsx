import React from 'react';
import SvgComponent from '../../../common/SvgComponent';
import { formatDate } from '../../../../helpers/formatDate';
import ScheduleShiftIcon from '../../../../assets/images/sessions/schedule-shift.svg';
import ScheduleShiftModalIcon from '../../../../assets/images/sessions/schedule-shift-modal.svg';
import ToolTip from '../../../common/tooltip';
import ConfirmModal from '../../../common/confirmModal';
import { OperationStatus } from '../../donors_centers/sessionHistory/SessionHistoryUtils';
import styles from './index.module.scss';

export default function LocationHistoryTableList({
  isLoading,
  data,
  headers,
  onRowClick,
  handleSort,
}) {
  const handleRowClick = (index, headerName, rowData) => {
    if (onRowClick && headerName !== 'tooltip') {
      onRowClick(rowData, index);
    }
  };
  const [isConfirmationVisible, setConfirmationVisibility] =
    React.useState(false);

  const handleConfirmation = (value) => {
    setConfirmationVisibility(value);
  };

  return (
    <div className="table-listing-main">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {headers?.map((header, index) => (
                <th
                  key={`${header?.name}-${header?.label}-${index}`}
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
                    {header?.sortable && (
                      <div
                        className="sort-icon"
                        onClick={() => handleSort(header.name)}
                      >
                        {header.name !== 'tooltip' && (
                          <SvgComponent name={'SortIcon'} />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="no-data" colSpan={headers?.length + 1}>
                  Data Loading
                </td>
              </tr>
            ) : data?.length ? (
              data.map((rowData, indexX) => {
                return (
                  <tr key={rowData.id}>
                    {headers.map((header, indexY) => (
                      <td
                        key={`${rowData.id}-${header.name}-${header.label}-${indexY}`}
                        onClick={() => {
                          handleRowClick(indexX, header.name, rowData);
                        }}
                      >
                        {header.name === 'status' ? (
                          <span
                            className={`badge ${
                              OperationStatus[rowData?.status?.toLowerCase()]
                            }`}
                          >
                            {rowData?.status}
                          </span>
                        ) : header.name === 'date' ? (
                          formatDate(rowData[header.name], 'MM-DD-YYYY')
                        ) : header.name === 'noofshifts' ? (
                          <div
                            className="d-flex gap-5"
                            onClick={() => {
                              handleRowClick(indexX, header.name);
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: '#72A3D0',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                color: 'white',
                                width: 'fit-content',
                                cursor: 'pointer',
                              }}
                            >
                              {rowData[header.name]}
                            </div>
                          </div>
                        ) : header.name === 'tooltip' ? (
                          <ToolTip
                            icon={
                              <img
                                src={ScheduleShiftIcon}
                                alt="Schedule Shift"
                              />
                            }
                            text={'Copy Drive'}
                            css={{
                              root: {
                                width: '30px',
                              },
                            }}
                            onTooltipClick={handleConfirmation}
                          />
                        ) : (
                          rowData[header.name]
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="no-data" colSpan={headers?.length + 1}>
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        classes={{
          inner: styles.scheduleShiftPopup,
          btnGroup: 'gap-4',
          btn: 'w-50',
        }}
        showConfirmation={isConfirmationVisible}
        onCancel={() => setConfirmationVisibility(false)}
        onConfirm={() => setConfirmationVisibility(false)}
        icon={ScheduleShiftModalIcon}
        heading={'Confirmation'}
        description={
          <>
            <p>
              This will copy all drive parameters to a newly scheduled drive.
              You will be redirected to the create drive process.
            </p>
            <p className="mt-2">Are you sure you want to continue?`</p>
          </>
        }
      />
    </div>
  );
}
