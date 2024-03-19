import React from 'react';
import swap_icon from '../../../../../../assets/Swap.svg';
import calendar from '../../../../../../assets/calendar.svg';
import { Link } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import moment from 'moment';
import styles from './dailyHour.module.scss';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import { fetchData } from '../../../../../../helpers/Api';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../../../common/confirmModal';
import SuccessPopUpModal from '../../../../../common/successModal';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import { DashDateFormat } from '../../../../../../helpers/formatDate';

const DailyHourListTable = ({ data, isLoading, handleSort, setRefresh }) => {
  const [showConfirmation, setConfirmation] = React.useState(null);
  const [dailyHourId, setDailyHourId] = React.useState('');
  const [archiveSuccess, setArchiveSuccess] = React.useState(false);
  const headers = [
    { name: 'Collection Operation', isSortable: true },
    { name: '', isSortable: false },
    { name: 'Mon', isSortable: false },
    { name: 'Tue', isSortable: false },
    { name: 'Wed', isSortable: false },
    { name: 'Thu', isSortable: false },
    { name: 'Fri', isSortable: false },
    { name: 'Sat', isSortable: false },
    { name: 'Sun', isSortable: false },
    { name: 'Effective Date', isSortable: true },
    { name: 'End Date', isSortable: true },
    { name: 'Actions', isSortable: false },
  ];

  const frontendToBackendColumnMapping = {
    'Collection Operation': 'name',
    Mon: 'mon_earliest_depart_time',
    Tue: 'tue_earliest_depart_time',
    Wed: 'wed_earliest_depart_time',
    Thu: 'thu_earliest_depart_time',
    Fri: 'fri_earliest_depart_time',
    Sat: 'sat_earliest_depart_time',
    Sun: 'sun_earliest_depart_time',
    'Effective Date': 'effective_date',
    'End Date': 'end_date',
  };
  const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const handleArchive = async () => {
    try {
      const result = await fetchData(
        `/booking-drive/daily-hour/${dailyHourId}`,
        'PATCH'
      );
      const { status_code, status, response } = result;

      if (status_code === 204 && status === 'success') {
        setConfirmation(null);
        setArchiveSuccess(true);
        setRefresh(true);
      } else {
        toast.error(response, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(error?.response, { autoClose: 3000 });
    }
    setConfirmation(null);
  };
  return (
    <div>
      <div
        style={{ backgroundColor: '#CFD8E5', overflowX: 'visible' }}
        className="table-responsive"
      >
        <table
          style={{ width: '100%', whiteSpace: 'nowrap', overflowX: 'auto' }}
        >
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    backgroundColor: '#CFD8E5',
                    height: '72px',
                    borderBottom: '1px solid #C6C6C6',
                  }}
                >
                  {header ? (
                    <div
                      style={{
                        justifyContent: 'center',
                        color: '#2D2D2E',
                        fontSize: '16px',
                        display: 'flex',
                        textAlign: 'center',
                        gap: '5px',
                      }}
                    >
                      <span>{header?.name}</span>{' '}
                      {header?.isSortable ? (
                        <img
                          src={swap_icon}
                          alt=""
                          onClick={() => {
                            const backendColumn =
                              frontendToBackendColumnMapping[header?.name];
                            if (backendColumn) {
                              handleSort(backendColumn);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      ) : null}{' '}
                    </div>
                  ) : (
                    ''
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className={styles.dataLoading} colSpan={headers.length + 1}>
                  Data Loading
                </td>
              </tr>
            ) : data?.length ? (
              data?.map((item, index) => (
                <React.Fragment key={index}>
                  <tr style={{ height: '50px' }}>
                    <td>
                      <div
                        style={{
                          height: '10px',
                          backgroundColor: '#CFD8E5',
                          paddingLeft: '20px',
                          width: '210px',
                        }}
                      >
                        <h1
                          style={{
                            padding: '0',
                            margin: '0',
                            fontSize: '16px',
                            color: '#2D2D2E',
                            fontStyle: 'normal',
                          }}
                        >
                          {item.collection_operation[0].name}
                        </h1>
                        <label style={{ fontSize: '12px', color: '#2D2D2E' }}>
                          {item.is_current
                            ? 'Current'
                            : item.end_date &&
                              new Date(item.end_date) < new Date()
                            ? 'Past'
                            : item?.effective_date &&
                              new Date(item.effective_date) <= new Date()
                            ? 'Current'
                            : item?.effective_date &&
                              new Date(item.effective_date) > new Date()
                            ? 'Scheduled'
                            : 'Current'}
                        </label>
                      </div>
                    </td>
                    <td
                      style={{
                        backgroundColor: '#E6ECF5',
                        fontSize: '14px',
                        color: '#2D2D2E',
                        fontWeight: '400',
                        textAlign: 'center',
                        width: '140px',
                        height: '55px',
                      }}
                    >
                      Earliest Depart Time
                    </td>
                    {daysOfWeek.map((day, index) => (
                      <td
                        key={index}
                        style={{
                          backgroundColor: '#FFF',
                          fontSize: '14px',
                          color: '#2D2D2E',
                          fontWeight: '400',
                          textAlign: 'center',
                        }}
                      >
                        {moment(item[`${day}_earliest_depart_time`]).format(
                          'hh:mm A'
                        )}
                      </td>
                    ))}
                    <td
                      rowSpan="2"
                      style={{
                        backgroundColor: '#FFF',
                        fontSize: '14px',
                        color: '#2D2D2E',
                        fontWeight: '400',
                        textAlign: 'center',
                      }}
                    >
                      {item?.effective_date ? (
                        <>
                          {' '}
                          <span
                            style={{
                              display: 'flex',
                              gap: '12px',
                              justifyContent: 'center',
                            }}
                          >
                            {' '}
                            <img src={calendar} alt="calendar" />{' '}
                            {DashDateFormat(item.effective_date)}
                          </span>{' '}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td
                      rowSpan="2"
                      style={{
                        backgroundColor: '#FFF',
                        fontSize: '14px',
                        color: '#2D2D2E',
                        fontWeight: '400',
                        textAlign: 'center',
                      }}
                    >
                      {item?.end_date ? (
                        <>
                          {' '}
                          <span
                            style={{
                              display: 'flex',
                              gap: '12px',
                            }}
                          >
                            {' '}
                            <img src={calendar} alt="calendar" />{' '}
                            {DashDateFormat(item.end_date)}
                          </span>{' '}
                        </>
                      ) : (
                        'N/A'
                      )}{' '}
                    </td>
                    <td
                      rowSpan="2"
                      style={{
                        backgroundColor: '#FFF',
                        fontSize: '14px',
                        color: '#2D2D2E',
                        fontWeight: '400',
                        textAlign: 'center',
                      }}
                    >
                      <div className="dropdown-center">
                        <div
                          className="optionsIcon"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ cursor: 'pointer' }}
                        >
                          <SvgComponent name={'ThreeDots'} />
                        </div>
                        <ul className="dropdown-menu custom-translate p-0">
                          {CheckPermission([
                            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                              .DAILY_HOURS.WRITE,
                          ]) && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/system-configuration/operations-admin/booking-drives/daily-hours/${item.id}`}
                              >
                                Edit
                              </Link>
                            </li>
                          )}
                          {CheckPermission([
                            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                              .DAILY_HOURS.SCHEDULE,
                          ]) && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/system-configuration/operations-admin/booking-drives/daily-hours/:schedule/${item.id}`}
                              >
                                Schedule
                              </Link>
                            </li>
                          )}
                          {CheckPermission([
                            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                              .DAILY_HOURS.ARCHIVE,
                          ]) && (
                            <li>
                              <a
                                className="dropdown-item"
                                onClick={(e) => {
                                  setDailyHourId(item.id);
                                  setConfirmation(true);
                                }}
                              >
                                Archive
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* </td> */}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #C6C6C6' }}>
                    <td></td>
                    <td
                      style={{
                        backgroundColor: '#E6ECF5',
                        fontSize: '14px',
                        color: '#2D2D2E',
                        fontWeight: '400',
                        width: '140px',
                        height: '55px',
                      }}
                    >
                      Latest Return Time
                    </td>
                    {daysOfWeek.map((day, index) => (
                      <td
                        key={index}
                        style={{
                          backgroundColor: '#FFF',
                          fontSize: '14px',
                          color: '#2D2D2E',
                          fontWeight: '400',
                          textAlign: 'center',
                        }}
                      >
                        {moment(item[`${day}_latest_return_time`]).format(
                          'hh:mm A'
                        )}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td className={styles.dataLoading} colSpan={headers.length + 1}>
                  {' '}
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        showConfirmation={showConfirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => handleArchive(showConfirmation)}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Daily Hour is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/operations-admin/booking-drives/daily-hours'
        }
      />
    </div>
  );
};

export default DailyHourListTable;
