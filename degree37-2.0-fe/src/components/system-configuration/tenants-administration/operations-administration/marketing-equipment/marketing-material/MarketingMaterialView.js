import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import Card from 'react-bootstrap/Card';
import { Row, Col, Container } from 'react-bootstrap';
import styles from './index.module.scss';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { dateFormat, formatDate } from '../../../../../../helpers/formatDate';
import { formatUser } from '../../../../../../helpers/formatUser';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const MarketingMaterialView = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [marketingData, setMarketingData] = useState({});
  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    try {
      const getMarketById = async (id) => {
        const response = await fetch(
          `${BASE_URL}/marketing-equipment/marketing-material/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        let { data } = await response.json();
        if (response.ok || response.status === 200) {
          setMarketingData(data);
        } else {
          toast.error('Error Fetching Device type Details', {
            autoClose: 3000,
          });
        }
      };
      if (id) {
        getMarketById(id);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id, BASE_URL, bearerToken]);

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'View Marketing Material',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/${id}/view`,
    },
  ];
  console.log(marketingData, 'marketingData');
  return (
    <div>
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Marketing Materials'}
      />

      <Container className={styles.container}>
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
            .MARKETING_MATERIAL.WRITE,
        ]) && (
          <div className={styles.editIconContainer}>
            <Link
              to={`/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/${id}/edit`}
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
              <span className={styles.edittext}>Edit</span>
            </Link>
          </div>
        )}
        <Row className="w-100">
          <Col lg={6} md={8}>
            <Card className={styles.cardContainer}>
              <Card.Header className={styles.cardHeader}>
                Marketing Material Details
              </Card.Header>
              <Card.Body className={styles.cardBody}>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Name
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    {marketingData?.name}
                  </Col>
                </Row>
                <div className={styles.divider}></div>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Short Name
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    {marketingData?.short_name}
                  </Col>
                </Row>
                <div className={styles.divider}></div>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Description
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    {marketingData?.description}
                  </Col>
                </Row>
                <div className={styles.divider}></div>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Retire On
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    {dateFormat(marketingData?.retire_on, 1)}
                  </Col>
                </Row>
                <div className={styles.divider}></div>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Collection Operation
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    {marketingData &&
                      marketingData?.collection_operation?.length &&
                      marketingData?.collection_operation.map((item, index) => {
                        return (
                          <span key={item?.id}>{`${item?.name} ${
                            marketingData?.collection_operation?.length - 1 ===
                            index
                              ? ''
                              : ',\u00A0'
                          }`}</span>
                        );
                      })}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card
              className={`${styles.cardContainer} ${styles.insightsCardContainer}`}
            >
              <Card.Header className={styles.cardHeader}>Insights</Card.Header>
              <Card.Body className={styles.cardBody}>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Status
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    <span
                      className={`${
                        marketingData?.status ? styles.active : styles.inactive
                      } ${styles.badge}`}
                    >
                      {marketingData?.status ? 'Active' : 'Inactive'}
                    </span>
                  </Col>
                </Row>
                <div className={styles.divider}></div>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Created by
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    {formatUser(marketingData?.created_by)}
                    {formatDate(marketingData?.created_at)}
                  </Col>
                </Row>
                <div className={styles.divider}></div>
                <Row className={styles.cardRow}>
                  <Col xs={5} className={styles.roleNameCol}>
                    Modified
                  </Col>
                  <Col xs={7} className={styles.supervisorCol}>
                    {formatUser(
                      marketingData?.modified_by
                        ? marketingData?.modified_by
                        : marketingData?.created_by
                    )}
                    {formatDate(
                      marketingData?.modified_at
                        ? marketingData?.modified_at
                        : marketingData?.created_at
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MarketingMaterialView;
