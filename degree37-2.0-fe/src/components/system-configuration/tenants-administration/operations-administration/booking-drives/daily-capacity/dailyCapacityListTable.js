import React from 'react';
import swap_icon from '../../../../../../assets/Swap.svg';
import calendar from '../../../../../../assets/calendar.svg';
import { Link } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import styles from './dailyCapacity.module.scss';
// import ConfirmModal from '../../../../../common/confirmModal';
// import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import { fetchData } from '../../../../../../helpers/Api';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import { DashDateFormat } from '../../../../../../helpers/formatDate';

const DailyCapacityListTable = ({
  data,
  isLoading,
  handleSort,
  setRefresh,
}) => {
  const [showConfirmation, setConfirmation] = React.useState(null);
  const [dailyCapacityId, setDailyCapacityId] = React.useState('');
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
    Mon: 'mon_max_drives',
    Tue: 'tue_max_drives',
    Wed: 'wed_max_drives',
    Thu: 'thur_max_drives',
    Fri: 'fri_max_drives',
    Sat: 'sat_max_drives',
    Sun: 'sun_max_drives',
    'Effective Date': 'effective_date',
    'End Date': 'end_date',
  };
  const daysOfWeek = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'];

  const handleArchive = async () => {
    try {
      const result = await fetchData(
        `/booking-drive/daily-capacity/${dailyCapacityId}`,
        'PATCH'
      );
      const { status_code, status, response } = result;
      setConfirmation(null);

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
  };

  return (
    <div>
      <div style={{ backgroundColor: '#CFD8E5' }}>
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
                        paddingLeft: '25px',
                        width: '140px',
                        height: '55px',
                      }}
                    >
                      Max Drives
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
                        {item[`${day}_max_drives`]}
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
                      <div>
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
                      </div>
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
                              .DAILY_CAPACITY.WRITE,
                          ]) && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/system-configuration/operations-admin/booking-drives/daily-capacities/${item.id}`}
                              >
                                Edit
                              </Link>
                            </li>
                          )}
                          {CheckPermission([
                            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                              .DAILY_CAPACITY.SCHEDULE,
                          ]) && (
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/system-configuration/operations-admin/booking-drives/daily-capacities/:schedule/${item.id}`}
                              >
                                Schedule
                              </Link>
                            </li>
                          )}
                          {CheckPermission([
                            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                              .DAILY_CAPACITY.ARCHIVE,
                          ]) && (
                            <li>
                              <a
                                className="dropdown-item"
                                onClick={(e) => {
                                  setDailyCapacityId(item.id);
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
                        paddingLeft: '25px',
                        width: '140px',
                        height: '55px',
                      }}
                    >
                      Max Staff
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
                        {item[`${day}_max_staff`]}
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
      {/* <ConfirmModal
        showConfirmation={showConfirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => handleArchive(showConfirmation)}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      /> */}
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure you want to archive?'}
        modalPopUp={showConfirmation}
        setModalPopUp={setConfirmation}
        showActionBtns={false}
        isArchived={true}
        archived={handleArchive}
      />

      <SuccessPopUpModal
        title="Success!"
        message="Daily Capacity is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/operations-admin/booking-drives/daily-capacities'
        }
      />
    </div>
  );
};

export default DailyCapacityListTable;
