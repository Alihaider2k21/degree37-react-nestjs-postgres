import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import styles from './index.module.scss';
import { ContentManagementSystemBreadCrumbsData } from '../ContentManagementSystemBreadCrumbsData';
import axios from 'axios';
import { BASE_URL } from '../../../../../../helpers/constants';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import './editor-style.scss';

const ViewTemplate = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState({});
  const token = localStorage.getItem('token');

  const getTemplate = async () => {
    const { data, status } = await axios.get(
      `${BASE_URL}/email-templates/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (status === 200) {
      setTemplate(data?.data);
    } else {
      setTemplate({});
    }
  };

  useEffect(() => {
    getTemplate();
  }, []);

  const BreadcrumbsData = [
    ...ContentManagementSystemBreadCrumbsData,
    {
      label: 'View Template',
      class: 'disable-label',
      link: `/system-configuration/platform-admin/email-template/view/${id}`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Email Templates'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="tableView">
          <div className="buttons">
            <Link
              to={`/system-configuration/platform-admin/email-template/edit/${id}`}
            >
              <span className="icon">
                <SvgComponent name="EditIcon" />
              </span>
              <span className="text">Edit</span>
            </Link>
          </div>
          <div className={`${styles.tableViewInner} w-100`}>
            <div className="row">
              <div className="col-md-6">
                <div className={`${styles.group}`}>
                  <div className={`${styles.group_head}`}>
                    <h2>Template Type Details</h2>
                  </div>
                  <div className={`${styles.group_body}`}>
                    <ul>
                      <li>
                        <span className={`${styles.left_heading}`}>Name</span>
                        <span className={`${styles.right_data}`}>
                          {template?.name}
                        </span>
                      </li>
                      <li>
                        <span className={`${styles.left_heading}`}>
                          Subject
                        </span>
                        <span className={`${styles.right_data}`}>
                          {template?.subject}
                        </span>
                      </li>
                      <li>
                        <span className={`${styles.left_heading}`}>Type</span>
                        <span className={`${styles.right_data}`}>
                          {template?.type}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={`${styles.group}`}>
                  <div className={`${styles.group_head}`}>
                    <h2>Insights</h2>
                  </div>
                  <div className={`${styles.group_body}`}>
                    <ul>
                      <li>
                        <span className={`${styles.left_heading}`}>Status</span>
                        <span className={`${styles.right_data}`}>
                          {template?.status ? (
                            <span
                              className={`${styles.badge} ${styles.active}`}
                            >
                              {' '}
                              Active{' '}
                            </span>
                          ) : (
                            <span
                              className={`${styles.badge} ${styles.inactive}`}
                            >
                              {' '}
                              Inactive{' '}
                            </span>
                          )}
                        </span>
                      </li>

                      <li>
                        <span className={`${styles.left_heading}`}>
                          Created by
                        </span>
                        <span className={`${styles.right_data}`}>
                          {template &&
                          template?.created_by &&
                          template?.created_at ? (
                            <>
                              {formatUser(template?.created_by)}
                              {formatDate(template?.created_at)}
                            </>
                          ) : (
                            ''
                          )}
                        </span>
                      </li>
                      <li>
                        <span className={`${styles.left_heading}`}>
                          Modified
                        </span>
                        <span className={`${styles.right_data}`}>
                          {formatUser(
                            template?.modified_by
                              ? template?.modified_by
                              : template?.created_by
                          )}
                          {formatDate(
                            template?.modified_at
                              ? template?.modified_at
                              : template?.created_at
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={`${styles.group}`}>
                  <div className={`${styles.group_head}`}>
                    <h2>Message</h2>
                  </div>
                  <div
                    className={`${styles.group_body} ${styles.message_border}`}
                  >
                    <div
                      className={`${styles.right_data} ck-content`}
                      dangerouslySetInnerHTML={{ __html: template?.content }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTemplate;
