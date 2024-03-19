// Custom function to format the date Now we use this function

export const dateFormat = (dateStr, format = null) => {
  let dateString = '';
  const date = new Date(dateStr);
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  month = month && +month > 9 ? +month : month;
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  switch (format) {
    // handle other cases
    case 1:
      // code block to execute if expression equals value1
      dateString = `${month}-${day}-${year}`;
      break;
    case 2:
      // code block to execute if expression equals value1
      dateString = `${month}-${day}-${year}`;
      break;
    default:
      dateString = `${month} ${day} ${year} | ${
        hours.toString().padStart(2, '0') || ''
      }:${minutes.toString().padStart(2, '0') || ''} `;
      break;
  }
  return dateStr ? dateString : '';
};

// Dash Date Format like (30-10-2023)
export const DashDateFormat = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
  const day = date.getDate().toString().padStart(2, '0');

  return `${month}-${day}-${year}`;
};

// Custom function to format the date
export const formatCustomDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so we add 1
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedDate = `${month}-${day
    .toString()
    .padStart(2, '0')}-${year} | ${
    hours === 0
      ? 12
      : hours > 12
      ? (hours - 12).toString().padStart(2, '0')
      : hours.toString().padStart(2, '0')
  }:${minutes.toString().padStart(2, '0')} ${ampm}`;

  return isNaN(month) ? '' : formattedDate;
};

// Custom function to format the date Monday , 30-10-2023
export const customDateformat = (dateStr) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const date = new Date(dateStr);
  const dayOfWeek = days[date.getDay()];
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so we add 1
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${dayOfWeek}, ${month}-${day
    .toString()
    .padStart(2, '0')}-${year}`;
  console.log({ formattedDate });
  return isNaN(month) ? '' : formattedDate;
};
// Custom function to format the date

export const formatDate = (dateStr, format = null) => {
  let dateString = '';
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  month =
    (month && +month > 9 ? +month : month).toString().padStart(2, '0') || '';
  const day = date.getDate().toString().padStart(2, '0') || '';
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  switch (format) {
    case 'MM-DD-YYYY':
      dateString = `${month}-${day}-${year}`;
      break;
    case 'YYYY-MM-DD':
      dateString = `${year}-${month}-${day}`;
      break;
    default:
      dateString = `${month}-${day}-${year} | ${
        hours === 0
          ? 12
          : hours > 12
          ? (hours - 12).toString().padStart(2, '0')
          : hours.toString().padStart(2, '0')
      }:${minutes.toString().padStart(2, '0')} ${ampm} `;
      break;
  }
  return dateStr ? dateString : 'N/A';
};

export const ordinalSuffix = (day) => {
  if (day === 1 || day === 21 || day === 31) {
    return `${day}st`;
  } else if (day === 2 || day === 22) {
    return `${day}nd`;
  } else if (day === 3 || day === 23) {
    return `${day}rd`;
  } else {
    return `${day}th`;
  }
};

// TIME FORMAT FUNCTION
export const formatTime = (dateStr, format = null) => {
  let timeString = '';
  if (!dateStr) return 'N/A';

  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  switch (format) {
    case 'HH:mm':
      timeString = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      break;
    case 'hh:mm AM/PM':
      timeString = `${
        hours === 0
          ? 12
          : hours > 12
          ? (hours - 12).toString().padStart(2, '0')
          : hours.toString().padStart(2, '0')
      }:${minutes.toString().padStart(2, '0')} ${ampm}`;
      break;
    default:
      timeString = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${ampm}`;
      break;
  }

  return timeString;
};
