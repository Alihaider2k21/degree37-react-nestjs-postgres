import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import { SETTINGS_CLASSIFICATIONS_PATH } from '../../../../../../routes/path';
import { ClassificationsBreadCrumbsData } from '../ClassificationsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import TopBar from '../../../../../common/topbar/index';
import styles from './index.module.scss';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '@storybook/blocks';
import SvgComponent from '../../../../../common/SvgComponent';

const ViewSingleSetting = () => {
  const { id } = useParams();
  const [settingData, setSettingData] = useState({});
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        // setIsLoading(true);
        if (id) {
          const result = await fetchData(`/staffing-admin/setting/${id}`);
          let { data, status, code } = result;
          if ((status === 'success') & (code === 200)) {
            data.target_hours_per_week = data.target_hours_per_week.toString();
            data.min_hours_per_week = data.min_hours_per_week.toString();
            data.max_hours_per_week = data.max_hours_per_week.toString();
            data.min_days_per_week = data.min_days_per_week.toString();
            data.max_days_per_week = data.max_days_per_week.toString();
            data.max_consec_days_per_week =
              data.max_consec_days_per_week.toString();
            data.max_ot_per_week = data.max_ot_per_week.toString();
            data.max_weekend_hours = data.max_weekend_hours.toString();
            data.max_consec_weekends = data.max_consec_weekends.toString();
            data.max_weekends_per_months =
              data.max_weekends_per_months.toString();
            data.overtime_threshold = data.overtime_threshold.toString();
            data.min_recovery_time = data.min_recovery_time.toString();
            setSettingData(data);
            console.log(data);
          } else {
            toast.error('Error Fetching Classification Settings Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error Fetching Classification Settings Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('Error Fetching Classification Settings Details', {
          autoClose: 3000,
        });
      }
      //  finally {
      //   setIsLoading(false);
      // }
    };
    if (id) {
      getData(id);
    }
  }, [id]);

  const BreadcrumbsData = [
    ...ClassificationsBreadCrumbsData,
    {
      label: 'Settings',
      class: 'disable-label',
      link: SETTINGS_CLASSIFICATIONS_PATH.LIST,
    },
    {
      label: 'View Classification Setting',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/staffing-admin/classifications/settings/${id}/view`,
    },
  ];

  // const config = [
  //   {
  //     section: 'Classification Setting Details',
  //     fields: [
  //       { label: 'Classification', field: 'classification.name' },
  //       { label: 'Target Hours Per Week', field: 'target_hours_per_week' },
  //       { label: 'Minimum Hours Per Week', field: 'min_hours_per_week' },
  //       { label: 'Maximum Hours Per Week', field: 'max_hours_per_week' },
  //       { label: 'Minimum Days Per Week', field: 'min_days_per_week' },
  //       { label: 'Maximum Days Per Week', field: 'max_days_per_week' },
  //       {
  //         label: 'Maximum Consecutive Days Per Week',
  //         field: 'max_consec_days_per_week',
  //       },
  //       { label: 'Maximum OT per Week', field: 'max_ot_per_week' },
  //       { label: 'Maximum Weekend Hours', field: 'max_weekend_hours' },
  //       { label: 'Maximum Consecutive Weekends', field: 'max_consec_weekends' },
  //       {
  //         label: 'Maximum Weekends per Month',
  //         field: 'max_weekends_per_months',
  //       },
  //       { label: 'Overtime threshold', field: 'overtime_threshold' },
  //       { label: 'Minimum Recovery Time', field: 'min_recovery_time' },
  //     ],
  //   },
  //   {
  //     section: 'Insights',
  //     fields: [
  //       {
  //         label: 'Created By',
  //         field: 'created_by',
  //       },
  //       {
  //         label: 'Modified',
  //         field: 'updated_by',
  //       },
  //     ],
  //   },
  // ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Settings'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/staffing-admin/classifications/settings/${id}/edit`}
                className={`${styles.editBtn}`}
              >
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span className="text">Edit</span>
              </Link>
            </div>
          )}
          <div className="tableViewInner">
            <div className="group">
              <div className="group-head">
                <h2>Classification Setting Details</h2>
              </div>
              <div className={`group-body ${styles.groupBodyLarge}`}>
                <ul>
                  <li>
                    <span className="left-heading">Classification</span>
                    <span className="right-data">
                      {settingData?.classification?.name}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">
                      Maximum Consecutive Days per Week
                    </span>
                    <span className="right-data">
                      {settingData?.max_consec_days_per_week}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">
                      Maximum Consecutive Weekends
                    </span>
                    <span className="right-data">
                      {settingData?.max_consec_weekends}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Minimum Days per Week</span>
                    <span className="right-data">
                      {settingData?.min_days_per_week}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Maximum Days per Week</span>
                    <span className="right-data">
                      {settingData?.max_days_per_week}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Maximum Hours per Week</span>
                    <span className="right-data">
                      {settingData?.max_hours_per_week}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Maximum OT per Week</span>
                    <span className="right-data">
                      {settingData?.max_ot_per_week}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Maximum Weekend Hours</span>
                    <span className="right-data">
                      {settingData?.max_weekend_hours}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">
                      Maximum Weekends per Month
                    </span>
                    <span className="right-data">
                      {settingData?.max_weekends_per_months}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Minimum Recovery Time</span>
                    <span className="right-data">
                      {settingData?.min_recovery_time}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Overtime Threshold</span>
                    <span className="right-data">
                      {settingData?.overtime_threshold}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="group">
              <div className="group-head">
                <h2>Insights</h2>
              </div>
              <div className={`group-body ${styles.groupBodyLarge}`}>
                <ul>
                  <li>
                    <span className="left-heading">Created</span>
                    <span className="right-data">
                      {`${formatUser(settingData?.created_by)}`}
                      {formatDate(settingData?.created_at)}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Modified</span>
                    <span className="right-data">
                      {formatUser(
                        settingData?.modified_by !== null
                          ? settingData?.modified_by
                          : settingData?.created_by
                      )}{' '}
                      {formatDate(
                        settingData?.modified_at !== null
                          ? settingData?.modified_at
                          : settingData?.created_at
                      )}{' '}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleSetting;
