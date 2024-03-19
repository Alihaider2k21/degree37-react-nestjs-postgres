// Custom function to format the User details
export const formatUser = (userObject, format = null) => {
  let userData = '';
  switch (format) {
    case 1:
      // code block to execute if expression equals value1
      userData = userObject?.first_name
        ? `${userObject?.first_name || ''} ${
            userObject?.last_name || ''
          } ${' '}`
        : null;
      break;
    default:
      userData = userObject?.first_name
        ? `${userObject?.first_name || ''} ${
            userObject?.last_name || ''
          } | ${' '}`
        : null;
      break;
  }
  return userObject ? userData : format ? 'N/A' : 'N/A | ';
};
