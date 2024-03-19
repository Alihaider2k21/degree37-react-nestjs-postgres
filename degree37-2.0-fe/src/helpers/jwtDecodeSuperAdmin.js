import jwtDecode from 'jwt-decode';

export const jwtDecodeSuperAdmin = () => {
  const isPlatformAdmin = jwtDecode(localStorage.getItem('token'));
  return isPlatformAdmin?.super_admin;
};
