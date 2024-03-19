import React, { useEffect, useState } from 'react';
import styles from '../volunteer.module.scss';
import { useOutletContext, useParams } from 'react-router-dom';
import { VolunteersBreadCrumbsData } from '../VolunteersBreadCrumbsData';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';
import accountContact from '../../../../../assets/accountContact.svg';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import moment from 'moment';
import '../volunteer.module.scss';
import SvgComponent from '../../../../common/SvgComponent';

const ServiceHistory = () => {
  const [serviceHistory, setServiceHistory] = useState([]);
  const params = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...VolunteersBreadCrumbsData,
      {
        label: 'View Volunteer',
        class: 'disable-label',
        link: `/crm/contacts/volunteers/${params?.id}/view`,
      },
      {
        label: 'Service History',
        class: 'active-label',
        link: `/crm/contacts/volunteers/${params?.volunteerId}/view/service`,
      },
    ]);
  }, []);

  useEffect(() => {
    const getServiceHistory = async () => {
      try {
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/contact-volunteer/${params?.volunteerId}/service-history`
        );
        const { data } = await response.json();
        // const datas = [
        //   {
        //     account_name: 'Shaheryar',
        //     role_name: 'Primary Chairperson',
        //     start_date: '2022-08-16',
        //     closeout_date: '2022-08-19',
        //     created_at: '2022-08-16 00:00:00',
        //   },
        //   {
        //     account_name: 'Qaiser',
        //     role_name: 'Chariman',
        //     start_date: '2022-08-20',
        //     closeout_date: null,
        //     created_at: '2022-08-20 00:00:00',
        //   },
        // ];
        setServiceHistory(data);
      } catch (error) {
        console.log(error);
      }
    };
    getServiceHistory();
  }, []);

  return (
    <div className={styles.accountViewMain}>
      {serviceHistory?.map((item, index) => {
        const isLastElement = index === serviceHistory.length - 1;
        return (
          <Container key={index}>
            <Row>
              <Col lg={12} className="d-flex" style={{ marginBottom: '20px' }}>
                <Col lg={1} style={{ position: 'relative' }}>
                  <img
                    src={accountContact}
                    className=""
                    alt="accountContact"
                    style={{ zIndex: '99', position: 'relative' }}
                  />
                  {isLastElement ? (
                    <div style={{ display: 'none' }}></div>
                  ) : (
                    <div
                      style={{
                        borderLeft: '2px solid #CED8E5',
                        height: '100%',
                        position: 'absolute',
                        left: '25px',
                      }}
                    ></div>
                  )}
                </Col>
                <Col
                  lg={11}
                  className="bg-white d-flex"
                  style={{ padding: '30px 40px', borderRadius: '10px' }}
                >
                  <Col lg={5} className="d-flex flex-column" gap={3}>
                    <h4
                      className="mb-0"
                      style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        fontFamily: 'inherit',
                        paddingBottom: '20px',
                      }}
                    >
                      <span style={{ color: '#387DE5' }}>
                        {' '}
                        {item?.account_name}
                      </span>{' '}
                      - {item?.role_name}
                    </h4>
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          height: 'calc(100% - 20px)',
                          width: '2px',
                          backgroundColor: '#CED8E5',
                          top: '10px',
                          left: '2px',
                        }}
                      />
                      <div
                        className="d-flex justify-between"
                        style={{
                          paddingBottom: '10px',
                          position: 'relative',
                          zIndex: '1',
                        }}
                      >
                        <p
                          style={{ fontWeight: 400, color: 'black' }}
                          className="mb-0"
                        >
                          <span className="icon" style={{ marginRight: '6px' }}>
                            <SvgComponent name={'blueTick'} />
                          </span>{' '}
                          Start date
                        </p>
                        <p
                          style={{ fontWeight: 400, color: 'black' }}
                          className="mb-0"
                        >
                          {moment(item?.start_date).format('MM-DD-YYYY')}
                        </p>
                      </div>
                      <div
                        className="d-flex justify-between"
                        style={{
                          position: 'relative',
                          zIndex: '1',
                        }}
                      >
                        <p
                          style={{ fontWeight: 400, color: 'black' }}
                          className="mb-0"
                        >
                          <span className="icon" style={{ marginRight: '6px' }}>
                            <SvgComponent name={'blueTick'} />
                          </span>{' '}
                          Closeout Date
                        </p>
                        <p
                          style={{ fontWeight: 400, color: 'black' }}
                          className="mb-0"
                        >
                          {item?.closeout_date
                            ? moment(item?.closeout_date).format('MM-DD-YYYY')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={7} className="d-flex justify-content-end">
                    <p style={{ color: '#A3A3A3' }}>
                      {moment(item?.created_at).format('MM-DD-YYYY hh:mm:ss A')}
                    </p>
                  </Col>
                </Col>
              </Col>
            </Row>
          </Container>
        );
      })}
    </div>
  );
};

export default ServiceHistory;
