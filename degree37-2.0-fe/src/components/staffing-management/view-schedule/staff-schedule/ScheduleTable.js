import React from 'react';
import SvgComponent from '../../../common/SvgComponent';
import * as _ from 'lodash';

const ScheduleTable = ({ isLoading, data, headers, handleSort }) => {
  const compareDates = (scheduleDate, otherDate) => {
    const date1 = new Date(scheduleDate);
    let date2 = new Date(); // today's date
    if (!(otherDate instanceof Date)) {
      // date passed to function is header date, it needs to be formatted first
      formatHeaderDate(otherDate);
      date2 = new Date(otherDate);
    }

    const yearComparison = date1.getFullYear() - date2.getFullYear();
    const monthComparison = date1.getMonth() - date2.getMonth();
    const dayComparison = date1.getDate() - date2.getDate();
    if (
      dayComparison === 0 &&
      monthComparison === 0 && // january is represented with 0
      yearComparison === 0
    ) {
      // schedule is today
      return 0;
    } else if (
      yearComparison < 0 ||
      (yearComparison === 0 && monthComparison < 0) ||
      (yearComparison === 0 && monthComparison === 0 && dayComparison < 0)
    ) {
      // schedule is in the past / before other date
      return 1;
    } else {
      // schedule is in the future / after other date
      return 2;
    }
  };

  const formatHeaderDate = (date) => {
    const [month, day, year] = date
      .split('/')
      .map((part) => parseInt(part, 10));

    // Assuming that 2-digit years below 70 are in the 2000s and above or equal to 70 are in the 1900s
    const adjustedYear = year < 70 ? 2000 + year : 1900 + year;

    return `${adjustedYear}-${month}-${day}`;
  };

  return (
    <div className="table-listing-main">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {_.compact(headers).map((header) => (
                <th key={header.id} align="center">
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
              data.map((staff, index) => {
                return (
                  <tr key={`${index}`}>
                    {_.compact(headers).map((header, index) => (
                      <td
                        className={`${
                          header.id !== 1 && header.id !== 2
                            ? 'schedule-card-row'
                            : 'no-card-row'
                        }`}
                        key={`${staff.id}-${index}`}
                      >
                        {header.id === 1 && <p>{staff.staff_name}</p>}
                        {header.id === 2 && <p>{staff.total_hours}</p>}
                        {header.id !== 1 &&
                          header.id !== 2 &&
                          staff.schedules.map(
                            (schedule, index) =>
                              compareDates(
                                schedule.date,
                                formatHeaderDate(header.date)
                              ) === 0 && (
                                <div
                                  key={`${index}`}
                                  className={`${
                                    schedule.is_on_leave
                                      ? 'on-leave-schedule-card'
                                      : compareDates(
                                          schedule.date,
                                          new Date()
                                        ) < 2
                                      ? 'schedule-card'
                                      : 'future-schedule-card'
                                  }`}
                                >
                                  {schedule.is_on_leave ? (
                                    <p className="on-leave-text">ON LEAVE</p>
                                  ) : (
                                    <div>
                                      {' '}
                                      <p>{schedule.role_name}</p>
                                      <p>{schedule.account_name}</p>
                                      <p>{schedule.location_address}</p>
                                      <p>
                                        {schedule.shift_start_time} -{' '}
                                        {schedule.shift_end_time}
                                      </p>
                                      <p>Depart: {schedule.depart_time}</p>
                                      <p>Return: {schedule.return_time}</p>
                                      <p>{schedule.vehicle_name}</p>{' '}
                                    </div>
                                  )}
                                </div>
                              )
                          )}
                      </td>
                    ))}
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

export default ScheduleTable;
