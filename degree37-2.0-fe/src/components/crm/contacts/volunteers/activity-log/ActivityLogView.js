import React, { useEffect, useState } from 'react';
import styles from '../volunteer.module.scss';
import { VolunteersBreadCrumbsData } from '../VolunteersBreadCrumbsData';
import { useOutletContext, useParams } from 'react-router-dom';
import moment from 'moment';
import { fetchData } from '../../../../../helpers/Api';

const ActivityLogView = () => {
  const params = useParams();

  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...VolunteersBreadCrumbsData,
      {
        label: 'View Volunteers',
        class: 'disable-label',
        link: `/crm/contacts/volunteers/${params?.id}/view`,
      },
      {
        label: 'Activity Log',
        class: 'active-label',
        link: `/crm/contacts/volunteers/${params?.volunteerId}/view/activity`,
      },
    ]);
  }, []);

  const [activityLogData, setActivityLogData] = useState([]);

  useEffect(() => {
    const fetchActivityLogData = async () => {
      try {
        const response = await fetchData(
          `/contact-volunteer/activity-logs/${params?.volunteerId}`
        );
        if (response?.status === 200) {
          setActivityLogData(response?.data || []);
        } else {
          console.error('Failed to fetch activity logs:', response?.message);
        }
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };

    fetchActivityLogData();
  }, [params?.id]);
  return (
    <div className={styles.main}>
      {activityLogData?.length
        ? activityLogData?.map((item, index) => {
            return (
              <>
                <div className={styles.mainRecentList}>
                  <div className={styles.iconMain}>
                    <div className={styles.icon}>
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="fi-rs-user-time"
                          clipPath="url(#clip0_12694_87070)"
                        >
                          <path
                            id="Vector"
                            d="M7.54892 9.79917C6.57988 9.79917 5.63259 9.51181 4.82686 8.97344C4.02113 8.43507 3.39313 7.66986 3.0223 6.77458C2.65146 5.87929 2.55443 4.89415 2.74348 3.94372C2.93253 2.9933 3.39917 2.12028 4.08439 1.43506C4.76961 0.749838 5.64263 0.283198 6.59306 0.0941463C7.54349 -0.0949052 8.52863 0.00212293 9.42391 0.372961C10.3192 0.743799 11.0844 1.37179 11.6228 2.17752C12.1611 2.98326 12.4485 3.93054 12.4485 4.89959C12.4471 6.1986 11.9304 7.44401 11.0119 8.36255C10.0933 9.2811 8.84794 9.79776 7.54892 9.79917ZM7.54892 1.78167C6.93226 1.78167 6.32944 1.96453 5.8167 2.30713C5.30396 2.64973 4.90433 3.13669 4.66834 3.70641C4.43235 4.27614 4.37061 4.90304 4.49091 5.50786C4.61122 6.11268 4.90817 6.66824 5.34422 7.10429C5.78027 7.54033 6.33583 7.83729 6.94065 7.95759C7.54546 8.0779 8.17237 8.01615 8.7421 7.78017C9.31182 7.54418 9.79877 7.14455 10.1414 6.63181C10.484 6.11907 10.6668 5.51625 10.6668 4.89959C10.6668 4.07266 10.3383 3.27961 9.75362 2.69489C9.1689 2.11016 8.37584 1.78167 7.54892 1.78167ZM15.1442 21.38C13.9108 21.38 12.7052 21.0143 11.6797 20.3291C10.6542 19.6439 9.85498 18.67 9.38301 17.5305C8.91103 16.3911 8.78754 15.1373 9.02815 13.9276C9.26876 12.718 9.86267 11.6069 10.7348 10.7348C11.6069 9.86267 12.718 9.26877 13.9276 9.02816C15.1372 8.78755 16.3911 8.91104 17.5305 9.38301C18.67 9.85499 19.6439 10.6542 20.3291 11.6797C21.0143 12.7052 21.38 13.9108 21.38 15.1442C21.3781 16.7974 20.7205 18.3824 19.5515 19.5515C18.3824 20.7205 16.7974 21.3781 15.1442 21.38ZM15.1442 10.69C14.2632 10.69 13.402 10.9512 12.6696 11.4407C11.9371 11.9301 11.3662 12.6257 11.0291 13.4396C10.6919 14.2535 10.6037 15.1491 10.7756 16.0131C10.9474 16.8772 11.3717 17.6708 11.9946 18.2937C12.6175 18.9167 13.4112 19.3409 14.2752 19.5128C15.1392 19.6846 16.0348 19.5964 16.8487 19.2593C17.6626 18.9222 18.3582 18.3513 18.8477 17.6188C19.3371 16.8863 19.5983 16.0251 19.5983 15.1442C19.5969 13.9633 19.1272 12.8312 18.2922 11.9962C17.4572 11.1611 16.3251 10.6914 15.1442 10.69ZM17.5557 16.296L16.035 14.7754V12.4717H14.2533V15.513L16.296 17.5557L17.5557 16.296ZM7.97029 11.5808H4.45417C3.27328 11.5823 2.14117 12.052 1.30616 12.887C0.471146 13.722 0.00141452 14.8541 0 16.035L0 21.38H1.78167V16.035C1.78167 15.3262 2.06323 14.6465 2.56442 14.1453C3.06561 13.6441 3.74538 13.3625 4.45417 13.3625H7.33245C7.47277 12.7452 7.68692 12.147 7.97029 11.5808Z"
                            fill="#387DE5"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_12694_87070">
                            <rect width="21.38" height="21.38" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    {index !== activityLogData?.length - 1 ? (
                      <div>
                        <div className={`d-flex ${styles.lineDiv}`}>
                          <div className={`vr ${styles.line}`}></div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={styles.recentListData}>
                    <div className="data">
                      <span className={styles.heading}>
                        {item?.activity_title}
                      </span>
                      <div>
                        <div className={styles.listItem}>
                          <div>
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="7"
                                height="8"
                                viewBox="0 0 7 8"
                                fill="none"
                              >
                                <circle
                                  cx="3.5"
                                  cy="4"
                                  r="3.5"
                                  fill="#387DE5"
                                />
                              </svg>
                            </span>
                            <span className={styles.listLine} key={index}>
                              {item?.name}
                            </span>
                          </div>
                          <span>{moment(item?.date).format('MM-DD-YYYY')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="created">
                      <span className={styles.createdAt}>
                        {moment(item?.created_at).format(
                          'MM-DD-YYYY, h:mm:ss A'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          })
        : ''}
    </div>
  );
};

export default ActivityLogView;
