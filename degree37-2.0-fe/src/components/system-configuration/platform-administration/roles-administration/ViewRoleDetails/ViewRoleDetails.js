import React, { useEffect, useState } from 'react';
import TopBar from '../../../../common/topbar/index';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import styles from './index.module.scss';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDate } from '../../../../../helpers/formatDate';
import { formatUser } from '../../../../../helpers/formatUser';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import axios from 'axios';

const ViewRoleDetails = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [sendData, setSendData] = useState({});
  const [permissionData, setPermissionData] = useState([]);
  const [formSetting, setFormSetting] = useState();
  const [formSettingVar, setFormSettingVar] = useState();
  const [array, setArray] = useState([]);
  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    getAllPermissions();
  }, []);

  const getAllPermissions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/permissions?isSuperAdminPermission=true`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = await res?.data;
      if (res.status === 200) {
        setPermissionData(data.data);
      } else {
        toast.error(`${data?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      toast.error(`${err}`, { autoClose: 3000 });
    }
  };
  useEffect(() => {
    getDataByid();
  }, [id]);

  const getDataByid = async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/roles/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      const data = await response?.data;
      if (data?.status_code === 200) {
        setFormSetting(data?.data?.permission?.application);
        setFormSettingVar(data?.data);
      } else {
        toast.error(`${data?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      //////console.log("err", err)
      toast.error(`${err}`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    { label: 'System Configuration', class: 'disable-label', link: '/' },
    {
      label: 'Roles Administration',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/roles-admin',
    },
    {
      label: 'View Role Details',
      class: 'disable-label',
      link: `/system-configuration/platform-admin/roles-admin/${id}/view`,
    },
  ];

  let stems = [];
  const getAllData = () => {
    formSetting?.length > 0 &&
      formSetting?.map((item, index) => {
        if (item?.modules || item?.modules?.length > 0) {
          iteration(item?.modules);
        }
      });
  };
  const iteration = (child) => {
    child?.length > 0 &&
      child?.map((item, index) => {
        if (item?.permissions?.length > 0) {
          item?.permissions?.map((per, indexing) => {
            stems.push(per.code);
          });
        } else {
          iteration(item?.child_modules);
        }
      });
  };
  useEffect(() => {
    getAllData();
    setArray(stems);
    setSendData((pre) => ({ ...pre, name: formSettingVar?.name }));
    setSendData((pre) => ({
      ...pre,
      description: formSettingVar?.description,
    }));
  }, [formSetting?.length > 0 && formSettingVar]);

  const recursiveFunction = (child) => {
    return (
      <>
        {child?.child_modules?.length > 0 ? (
          child?.child_modules?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item?.permissions && item?.permissions?.length > 0 && (
                  <div className="w-100 mt-4">
                    <p> {item.name}</p>
                  </div>
                )}

                {item?.permissions &&
                  item?.permissions?.length > 0 &&
                  item?.permissions?.map((per, index) => {
                    return (
                      <>
                        <div>
                          <div className="form-field checkbox">
                            <span className="toggle-text">{per.name}</span>
                            <label htmlFor={`${per.code}`} className="switch">
                              <input
                                style={{ width: '50px' }}
                                key={item.code}
                                type="checkbox"
                                id={`${per.code}`}
                                className={`toggle-input`}
                                name={per.name}
                                checked={
                                  array.includes(per.code) ? true : false
                                }
                              />
                              <span
                                className={`${styles.slider} slider round`}
                              ></span>
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  })}
                {item?.child_modules?.length > 0 && recursiveFunction(item)}
              </React.Fragment>
            );
          })
        ) : (
          <React.Fragment>
            {child?.permissions && child?.permissions?.length > 0 && (
              <div className="w-100 mt-4 fw-medium">
                <p> {child.name}</p>
              </div>
            )}
            {child?.permissions &&
              child?.permissions?.length > 0 &&
              child?.permissions?.map((per, index) => {
                return (
                  <>
                    <div>
                      <div className="form-field checkbox">
                        <span className="toggle-text">{per.name}</span>
                        <label htmlFor={`${per.code}`} className="switch">
                          <input
                            style={{ width: '50px' }}
                            key={child.code}
                            type="checkbox"
                            id={`${per.code}`}
                            className="toggle-input"
                            checked={array.includes(per.code) ? true : false}
                          />
                          <span
                            className={`${styles.slider} slider round`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </>
                );
              })}

            {child?.child_modules?.length > 0 && recursiveFunction(child)}
          </React.Fragment>
        )}
      </>
    );
  };

  return (
    <div>
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Roles Administration'}
      />

      {CheckPermission([
        Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.WRITE,
      ]) && (
        <div className="d-flex justify-content-end pe-3">
          <Link
            to={`/system-configuration/platform-admin/roles/${id}/edit`}
            className="pe-3"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_9340_8863)">
                <path
                  d="M19 20H5C4.73478 20 4.48043 20.1054 4.29289 20.2929C4.10536 20.4804 4 20.7348 4 21C4 21.2652 4.10536 21.5196 4.29289 21.7071C4.48043 21.8946 4.73478 22 5 22H19C19.2652 22 19.5196 21.8946 19.7071 21.7071C19.8946 21.5196 20 21.2652 20 21C20 20.7348 19.8946 20.4804 19.7071 20.2929C19.5196 20.1054 19.2652 20 19 20Z"
                  fill="#387DE5"
                ></path>
                <path
                  d="M5.0003 17.9999H5.0903L9.2603 17.6199C9.71709 17.5744 10.1443 17.3731 10.4703 17.0499L19.4703 8.04986C19.8196 7.68083 20.0084 7.18837 19.9953 6.68039C19.9822 6.17242 19.7682 5.69037 19.4003 5.33986L16.6603 2.59986C16.3027 2.26395 15.8341 2.07122 15.3436 2.05831C14.8532 2.0454 14.3751 2.21323 14.0003 2.52986L5.0003 11.5299C4.67706 11.8558 4.4758 12.2831 4.4303 12.7399L4.0003 16.9099C3.98683 17.0563 4.00583 17.204 4.05596 17.3422C4.10608 17.4805 4.1861 17.606 4.2903 17.7099C4.38374 17.8025 4.49455 17.8759 4.61639 17.9256C4.73823 17.9754 4.86869 18.0006 5.0003 17.9999ZM15.2703 3.99986L18.0003 6.72986L16.0003 8.67986L13.3203 5.99986L15.2703 3.99986ZM6.3703 12.9099L12.0003 7.31986L14.7003 10.0199L9.1003 15.6199L6.1003 15.8999L6.3703 12.9099Z"
                  fill="#387DE5"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_9340_8863">
                  <rect width="24" height="24" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
            <span style={{ fontSize: '20px' }}>Edit</span>
          </Link>
        </div>
      )}

      <Row className={`${styles.wideDetails}`}>
        <Col md={6}>
          <Card className={styles.cardContainer}>
            <Card.Header className={styles.cardHeader}>
              Role Details
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Row className={styles.cardRow}>
                <Col xs={4} className={`${styles.roleNameCol} fw-medium`}>
                  Role Name
                </Col>
                <Col xs={8} className={styles.supervisorCol}>
                  {sendData?.name}
                </Col>
              </Row>
              <div className={styles.divider}></div>
              <Row className={styles.cardRow}>
                <Col xs={4} className={`${styles.roleNameCol} fw-medium`}>
                  Role Description
                </Col>
                <Col xs={8} className={styles.supervisorCol}>
                  {sendData?.description}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card
            className={`${styles.insightsCardContainer} ${styles.cardContainer}`}
          >
            <Card.Header className={styles.cardHeader}>Insights</Card.Header>
            <Card.Body className={styles.cardBody}>
              <Row className={styles.cardRow}>
                <Col xs={4} className={`${styles.roleNameCol} fw-medium`}>
                  Created
                </Col>
                <Col xs={8} className={styles.supervisorCol}>
                  {formSettingVar?.created_at && formSettingVar?.created_by ? (
                    <>
                      {formatUser(formSettingVar?.created_by)}
                      {formatDate(formSettingVar?.created_at)}
                    </>
                  ) : null}
                </Col>
              </Row>
              <div className={styles.divider}></div>
              <Row className={styles.cardRow}>
                <Col xs={4} className={`${styles.roleNameCol} fw-medium`}>
                  Modified
                </Col>
                <Col xs={8} className={styles.supervisorCol}>
                  {formatUser(
                    formSettingVar?.modified_by ?? formSettingVar?.created_by
                  )}
                  {formatDate(
                    formSettingVar?.modified_at ?? formSettingVar?.created_at
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className={styles.cardContainer}>
            <Card.Header className={styles.cardHeader}>Permissions</Card.Header>
            <Card.Body className={styles.cardBody}>
              <form className={styles.ViewRoleDetails}>
                <div
                  className={`${styles.permissions} roles-veiw-form formGroup border-0 w-100 pt-0`}
                >
                  {permissionData &&
                    permissionData?.application?.length > 0 &&
                    permissionData?.application?.map((item, index) => {
                      return (
                        <>
                          {item?.modules &&
                            item?.modules?.length > 0 &&
                            item?.modules?.map((item, index) => {
                              return recursiveFunction(item);
                            })}
                        </>
                      );
                    })}
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewRoleDetails;
