/* eslint-disable */

import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/common/layout';
import ScheduleCreate from '../../../../components/staffing-management/build-schedule/create-schedule/ScheduleCreate';
import { fetchData } from '../../../../helpers/Api';
import CheckPermission from '../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';
import StaffingPermissions from '../../../../enums/StaffingPermissionsEnum';
import { toast } from 'react-toastify';

const CreateSchedule = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [operationStatus, setOperationStatus] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const getCollectionOperation = async () => {
      try {
        const result = await fetch(
          `${BASE_URL}/tenant-users?keyword=${userName}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await result.json();
        if (data?.data) {
          setUser({
            id: data?.data[0].id,
            name: `${data?.data[0].first_name} ${data?.data[0].last_name}`,
          });
          const units = fetchData(
            `/business_units?parent_level_id=${data?.data[0]?.business_unit.id}`
          );
          units.then((val) => {
            if (val.data.length > 0) {
              const childUnits = val.data.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                };
              });
              setCollectionOperation(childUnits);
            } else {
              const parentUnit = [
                {
                  id: data?.data[0]?.business_unit.id,
                  name: data?.data[0]?.business_unit.name,
                },
              ];
              setCollectionOperation(parentUnit);
            }
          });
        }
      } catch (error) {
        toast.error(`Error fetching assignee users: ${error}`, {
          autoClose: 3000,
        });
      }
    };

    const getOperationStatus = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const userName = localStorage.getItem('user_name');
        const data = fetchData(
          '/booking-drive/operation-status?fetch_all=true'
        );
        if (data) {
          data.then((val) => setOperationStatus(val?.data));
        }
      } catch (error) {
        toast.error(`Error fetching assignee users: ${error}`, {
          autoClose: 3000,
        });
      }
    };

    getOperationStatus();
    getCollectionOperation();
  }, [BASE_URL]);

  const hasPermission = CheckPermission(null, [
    StaffingPermissions.STAFFING_MANAGEMENT.CREATE_SCHEDULE.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ScheduleCreate
          formHeading={'Create Schedule'}
          collectionOperation={collectionOperation}
          operationStatusList={operationStatus}
          user={user}
          taskListUrl={'/staffing-management/schedules'}
        />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateSchedule;
