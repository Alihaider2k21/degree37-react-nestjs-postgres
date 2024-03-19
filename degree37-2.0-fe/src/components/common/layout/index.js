import React from 'react';
import Sidebar from '../sidebar';
import Header from '../header';
import styles from './index.module.scss';
import SystemConfigurationLeftNav from '../sidebar/systemConfigurationLeftNav';
import jwtDecode from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import CRMLeftNav from '../sidebar/crmLeftNav';
import OperationsCenterLeftNav from '../sidebar/operationsCenterLeftNav';
import StaffingManagementLeftNav from '../sidebar/staffingManagementLeftNav';

export default function Layout({ children, className = '' }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useMemo(() => {
    setUser(jwtDecode(localStorage.getItem('token')));
  }, []);

  const leftNavMap = {
    crm: <CRMLeftNav />,
    'call-center-manager': <SystemConfigurationLeftNav />,
    'staffing-management': <StaffingManagementLeftNav />,
    'operations-center': <OperationsCenterLeftNav />,
    'donor-portal': <SystemConfigurationLeftNav />,
    flow: <SystemConfigurationLeftNav />,
    'system-configuration': <SystemConfigurationLeftNav />,
    dashboard: <SystemConfigurationLeftNav />,
    reports: <SystemConfigurationLeftNav />,
  };

  return (
    <div className={`${styles.rootMain} ${className}`}>
      <Header />
      <div className={styles.layoutMain}>
        {user?.super_admin === true ? (
          <Sidebar />
        ) : (
          !location.pathname?.includes('/system-configuration/tasks') &&
          leftNavMap[location.pathname.split('/')[1]]
        )}
        <div className={styles.contentMain}>{children}</div>
      </div>
    </div>
  );
}
