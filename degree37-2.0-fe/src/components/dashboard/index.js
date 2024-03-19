import React, { useEffect, useState } from 'react';
import Header from '../common/header';
import styles from './index.module.scss';
import SvgComponent from '../common/SvgComponent';
import IconBox from '../common/IconBox';
import { useNavigate } from 'react-router-dom';
import { jwtDecodeSuperAdmin } from '../../helpers/jwtDecodeSuperAdmin';
// import jwtDecode from "jwt-decode";
import Permissions from '../../enums/PermissionsEnum';
import CheckPermission from '../../helpers/CheckPermissions';

const DashboardBoxes = [
  {
    iconName: 'TenetOnboardingIcon',
    boxName: 'Tenants Onboarding',
    link: '/system-configuration/platform-admin/tenant-management/create',
    permission: [Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.WRITE],
  },
  {
    iconName: 'TenetManagementIcon',
    boxName: 'Tenant Management',
    link: '/system-configuration/platform-admin/tenant-management',
    permission: [
      Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.MODULE_CODE,
    ],
  },
  {
    iconName: 'UserAdministrationIcon',
    boxName: 'User Administration',
    link: '/system-configuration/platform-admin/user-administration/users',
    permission: [
      Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.MODULE_CODE,
    ],
  },
  {
    iconName: 'RolesAdministrationIcon',
    boxName: 'Roles Administration',
    link: '/system-configuration/platform-admin/roles-admin',
    permission: [
      Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.MODULE_CODE,
    ],
  },
  {
    iconName: 'ManagementIcon',
    boxName: 'Log and Event Management',
    link: '/system-configuration/reports',
    permission: [
      Permissions.SYSTEM_CONFIGURATION.LOG_AND_EVENT_MANAGEMENT.MODULE_CODE,
    ],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const status = jwtDecodeSuperAdmin();
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(false);

  useEffect(() => {
    if (status) {
      setLoading(true);
    } else {
      navigate('/tenant-dashboard');
    }
  }, []);

  useEffect(() => {
    let hasPermission = false;

    for (const box of DashboardBoxes) {
      if (box.iconName === 'TenetOnboardingIcon') {
        hasPermission = CheckPermission(box?.permission);
      } else {
        hasPermission = CheckPermission(null, box?.permission);
      }

      if (hasPermission) {
        setPermissionStatus(true);
        break;
      }
    }
  }, []);

  return (
    <>
      <Header />
      {loading === true ? (
        <div className={styles.dashboardMain}>
          <div className="container-fluid">
            <div className={styles.dashboardBoxesMain}>
              {DashboardBoxes.map((box, key) => {
                let hasPermission;
                if (box.iconName === 'TenetOnboardingIcon') {
                  hasPermission = CheckPermission(box?.permission);
                } else {
                  hasPermission = CheckPermission(null, box?.permission);
                }
                if (hasPermission) {
                  return (
                    <div key={key} className={styles.dashboardBoxes}>
                      <IconBox
                        iconName={box.iconName}
                        boxName={box.boxName}
                        link={box.link}
                      />
                    </div>
                  );
                }
              })}
              {permissionStatus === false ? (
                <div className={styles.productNotes}>
                  <h6 className="mb-0">
                    {"You don't have an access to any module"}
                  </h6>
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.footerLogo}>
            <SvgComponent name={'FooterLogoWhite'} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
