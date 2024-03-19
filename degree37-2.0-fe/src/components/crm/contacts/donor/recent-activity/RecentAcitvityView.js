import React, { useEffect, useState } from 'react';
import styles from '../donor.module.scss';
import { DonorBreadCrumbsData } from '../DonorBreadCrumbsData';
import { useOutletContext, useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';

const RecentActivityView = () => {
  const params = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...DonorBreadCrumbsData,
      {
        label: 'View Donor',
        class: 'disable-label',
        link: `/crm/contacts/donor/${params?.donorId}/view`,
      },
      {
        label: 'Recent Activity',
        class: 'active-label',
        link: `/crm/contacts/donor/${params?.donorId}/view/recent-activity`,
      },
    ]);
  }, []);
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [donorActivities, setDonorActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // const data = [
  //   {
  //     title: 'Store Order',
  //     activity: 'Ordered Store Item on',
  //     created_at: '12-29-2023, 11:39:22 PM',
  //   },
  //   {
  //     title: 'Store Order',
  //     activity: 'Ordered Store Item on',
  //     created_at: '12-29-2023, 11:39:22 PM',
  //   },
  //   {
  //     title: 'Store Order',
  //     activity: 'Ordered Store Item on',
  //     created_at: '12-29-2023, 11:39:22 PM',
  //   },
  // ];

  const getDonorActivities = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/donors/activities?resourceId=${params?.donorId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await res.data;
      if (res.status === 200) {
        setDonorActivities(data.data);
      } else {
        toast.error(`${data?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDonorActivities();
  }, []);

  return (
    <div className={styles.accountViewMain}>
      {loading ? (
        <div
          style={{
            padding: '30px',
          }}
        >
          <p
            style={{
              background: '#fff',
              textAlign: 'center',
              padding: '30px 0px',
              marginBottom: '0px',
              border: '1px solid #d9d9d9',
              borderRadius: '10px',
            }}
          >
            Data Loading
          </p>
        </div>
      ) : donorActivities?.length ? (
        <div className={styles.main}>
          {donorActivities?.map((item, index) => {
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
                        <g id="01 align center">
                          <path
                            id="Vector"
                            d="M0.970169 14.741L3.28653 6.39234C3.78116 4.60644 4.85894 3.0373 6.34833 1.93466C7.83773 0.832026 9.65314 0.259253 11.5056 0.307505C13.3581 0.355756 15.1413 1.02226 16.5713 2.20094C18.0012 3.37961 18.9959 5.00273 19.3968 6.81196L21.1885 14.8747C21.2752 15.2653 21.273 15.6704 21.1823 16.0601C21.0915 16.4498 20.9144 16.8141 20.664 17.1262C20.4137 17.4383 20.0964 17.6902 19.7357 17.8633C19.375 18.0365 18.98 18.1264 18.5799 18.1265H15.3664C15.1619 19.1335 14.6156 20.0388 13.82 20.6891C13.0244 21.3394 12.0285 21.6946 11.0009 21.6946C9.97338 21.6946 8.97744 21.3394 8.18185 20.6891C7.38626 20.0388 6.83994 19.1335 6.63546 18.1265H3.54401C3.13231 18.1263 2.72622 18.031 2.35742 17.8481C1.98861 17.6651 1.66706 17.3994 1.41784 17.0717C1.16862 16.744 0.99847 16.3632 0.920664 15.9589C0.842855 15.5546 0.859493 15.1378 0.969278 14.741H0.970169ZM11.0009 19.9083C11.5517 19.906 12.0884 19.7336 12.5375 19.4147C12.9865 19.0957 13.3261 18.6458 13.5097 18.1265H8.49212C8.67572 18.6458 9.01529 19.0957 9.46437 19.4147C9.91345 19.7336 10.4501 19.906 11.0009 19.9083ZM2.83573 15.9928C2.91885 16.103 3.02659 16.1922 3.15035 16.2533C3.27411 16.3144 3.41044 16.3457 3.54846 16.3447H18.5799C18.7133 16.3447 18.845 16.3147 18.9652 16.257C19.0855 16.1992 19.1913 16.1152 19.2747 16.0112C19.3582 15.9071 19.4172 15.7856 19.4475 15.6557C19.4777 15.5257 19.4784 15.3907 19.4494 15.2605L17.6578 7.19772C17.3421 5.7778 16.5608 4.50415 15.4381 3.57925C14.3155 2.65435 12.9158 2.13127 11.4617 2.09318C10.0076 2.05509 8.58252 2.50416 7.41295 3.36901C6.24339 4.23386 5.39649 5.46486 5.00688 6.8663L2.69052 15.215C2.65269 15.347 2.64613 15.486 2.67133 15.621C2.69654 15.756 2.75282 15.8833 2.83573 15.9928Z"
                            fill="#387DE5"
                          />
                        </g>
                      </svg>
                    </div>
                    {index !== donorActivities.length - 1 ? (
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
                      <span className={styles.heading}>{item?.title}</span>
                      <ul className={styles.listItem}>
                        <li key={index}>
                          {item?.activity}{' '}
                          <strong>
                            {moment(item.activity_at).format('MM-DD-YYYY')}
                          </strong>
                        </li>
                      </ul>
                    </div>
                    <div className="created">
                      <span className={styles.createdAt}>
                        {moment(item?.created_at).format(
                          'MM-DD-YYYY, h:mm:ss A'
                        )}
                        {/* {item?.created_at} */}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: '30px',
          }}
        >
          <p
            style={{
              background: '#fff',
              textAlign: 'center',
              padding: '30px 0px',
              marginBottom: '0px',
              border: '1px solid #d9d9d9',
              borderRadius: '10px',
            }}
          >
            No Data Found
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityView;
