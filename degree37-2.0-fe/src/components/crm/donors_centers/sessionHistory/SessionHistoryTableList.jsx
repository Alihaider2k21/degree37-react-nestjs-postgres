import React from 'react';
import SvgComponent from '../../../common/SvgComponent';
import { formatDate } from '../../../../helpers/formatDate';
import ScheduleShiftIcon from '../../../../assets/images/sessions/schedule-shift.svg';
import { Link } from 'react-router-dom';
import { OPERATIONS_CENTER_SESSIONS_PATH } from '../../../../routes/path';
import ToolTip from '../../../common/tooltip';
import { OperationStatus } from './SessionHistoryUtils';
import ConfirmModal from '../../../common/confirmModal';
import styles from './index.module.scss';
import ScheduleShiftModalIcon from '../../../../assets/images/sessions/schedule-shift-modal.svg';

export default function SessionHistoryTableList({
  isLoading,
  data,
  headers,
  handleSort,
  onRowClick,
}) {
  const [isConfirmationVisible, setConfirmationVisibility] =
    React.useState(false);

  const handleRowClick = (headerName, rowData) => {
    if (onRowClick && headerName !== 'tooltip') {
      onRowClick(rowData);
    }
  };

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
                        onClick={() => {
                          handleSort(header.name);
                        }}
                      >
                        {header?.name !== 'tooltip' && (
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
              data.map((rowData) => {
                return (
                  <tr key={rowData.id}>
                    {headers.map((header, index) => (
                      <td
                        key={`${rowData.id}-${header.name}-${header.label}-${index}`}
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
                          <Link
                            to={OPERATIONS_CENTER_SESSIONS_PATH.VIEW.replace(
                              ':id',
                              rowData?.id
                            ).replace(':slug', 'about')}
                          >
                            {formatDate(rowData[header.name], 'MM-DD-YYYY')}
                          </Link>
                        ) : header.name === 'noofshifts' ? (
                          <div
                            className="d-flex gap-5"
                            onClick={() =>
                              handleRowClick(header.name, rowData, index)
                            }
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
                            text={'Copy Session'}
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
