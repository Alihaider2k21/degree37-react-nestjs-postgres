import React, { useEffect, useState } from 'react';
import Header from '../../common/header';
import styles from './index.module.scss';
import SvgComponent from '../../common/SvgComponent';
import IconBox from '../../common/IconBox';
import jwtDecode from 'jwt-decode';
import { jwtDecodeSuperAdmin } from '../../../helpers/jwtDecodeSuperAdmin';
import { useNavigate } from 'react-router-dom';
import {
  CRM_ACCOUNTS_PATH,
  STAFFING_MANAGEMENT_STAFF_LIST,
} from '../../../routes/path';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
import Permissions from '../../../enums/PermissionsEnum';
import ApplicationPermissions from '../../../enums/ApplicationPermissionsEnum';
// import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const TenantDashboard = () => {
  const [application, setApplication] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [DashboardBoxes, setDashboardBoxes] = useState([
    {
      iconName: 'CRMIcon',
      boxName: 'CRM ',
      link: CRM_ACCOUNTS_PATH,
      key: 'CRM',
      permission: [CrmPermissions.CRM.APPLICATION_CODE],
    },
    {
      iconName: 'CallCenterIcon',
      boxName: 'Call Center',
      link: '#',
      key: 'Call Center Manager',
      permission: [ApplicationPermissions.CALL_CENTER_MANAGER],
    },
    {
      iconName: 'StaffingManagementIcon',
      boxName: 'Staffing Management',
      link: STAFFING_MANAGEMENT_STAFF_LIST,
      key: 'Staffing Management',
      permission: [ApplicationPermissions.STAFFING_MANAGEMENT],
    },
    {
      iconName: 'OperationsCenterIcon',
      boxName: 'Operations Center',
      link: '/operations-center',
      key: 'Operations Center',
      permission: [ApplicationPermissions.OPERATION_CENTER],
    },
    {
      iconName: 'ManagementIcon',
      boxName: 'Donor Portal',
      link: '#',
      key: 'Donor Portal',
      permission: [ApplicationPermissions.DONOR_PORTAL],
    },
    {
      iconName: 'ManagementIcon',
      boxName: 'Flow',
      link: '#',
      key: 'Flow',
      permission: [ApplicationPermissions.Flow],
    },
    {
      iconName: 'ManagementIcon',
      boxName: 'System Configurations',
      link: '/system-configuration',
      key: 'System Configuration',
      permission: [Permissions.SYSTEM_CONFIGURATION.APPLICATION_CODE],
    },
    {
      iconName: 'ManagementIcon',
      boxName: 'Reports',
      link: '#',
      key: 'Reports',
      permission: [ApplicationPermissions.REPORTS],
    },
  ]);

  const bearerToken = localStorage.getItem('token');
  const jwt = jwtDecode(bearerToken);

  useEffect(() => {
    getData(jwt?.tenantId);
  }, [jwt && jwt?.id]);

  useEffect(() => {
    if (application?.length > 0) {
      filterArray();
    }
  }, [application]);

  const filterArray = () => {
    const filteredBoxes = DashboardBoxes;
    const data2 = application;
    const data = filteredBoxes.filter((dash) => {
      return data2.some((app) => app?.name === dash?.key);
    });
    setDashboardBoxes(data);
  };

  const getData = async (id) => {
    if (id) {
      try {
        setIsloading(true);
        const result = await fetch(`${BASE_URL}/tenants/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        });
        let { data } = await result.json();
        setIsloading(false);
        if (data?.applications?.length) {
          setApplication(data?.applications);
        }
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  const status = jwtDecodeSuperAdmin();
  // const [render,setRender]= useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (status) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <>
      <Header />
      <div className={styles.dashboardMain}>
        <div className="container-fluid">
          <div className={styles.dashboardBoxesMain}>
            {application.length > 0 && DashboardBoxes.length > 0
              ? DashboardBoxes?.map((box, key) => {
                  if (box?.permission) {
                    const hasPermission = CheckPermission(
                      null,
                      null,
                      box?.permission
                    );
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
                  } else {
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
                })
              : !isLoading && (
                  <div className={styles.productNotes}>
                    <h6 className="mb-0">
                      {"You don't have any application licensed."}
                    </h6>
                  </div>
                )}
          </div>
        </div>
        <div className={styles.footerLogo}>
          <SvgComponent name={'FooterLogoWhite'} />
        </div>
      </div>
    </>
  );
};

export default TenantDashboard;
