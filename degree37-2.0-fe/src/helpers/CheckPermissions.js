import jwt from 'jwt-decode';

const CheckPermission = (
  permissionsArray = null,
  modulePermission = null,
  applicationPermission = null
) => {
  const jwtToken = localStorage.getItem('token');
  let decodeToken = null;
  if (jwtToken) {
    decodeToken = jwt(jwtToken);
  }
  const token = decodeToken;
  if (permissionsArray) {
    const isPermission = permissionsArray?.some((perm) =>
      token?.permissions?.includes(perm)
    );
    if (isPermission) {
      return true;
    } else {
      return false;
    }
  }
  if (modulePermission) {
    const isPermission = modulePermission?.some((perm) =>
      token?.modules?.includes(perm)
    );
    if (isPermission) {
      return true;
    } else {
      return false;
    }
  }
  if (applicationPermission) {
    const isPermission = applicationPermission?.some((perm) =>
      token?.applications?.includes(perm)
    );
    if (isPermission) {
      return true;
    } else {
      return false;
    }
  }
};

export default CheckPermission;
