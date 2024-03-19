import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import { useState } from 'react';

function CustomFieldsSection({ id }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [customFields, setCustomFields] = useState();
  const fetchDatafun = async () => {
    const data = await axios.get(
      `${BASE_URL}/system-configuration/organization-administration/custom-fields/data?custom_field_datable_id=${id}&custom_field_datable_type=drives`
    );
    console.log({ data });
    if (data?.data?.data?.length) {
      setCustomFields(data?.data?.data);
    }
  };
  useEffect(() => {
    if (id) {
      fetchDatafun();
    }
  }, [id]);
  console.log({ customFields });
  return (
    <>
      <table className="viewTables w-100 mt-5">
        <thead>
          <tr>
            <th colSpan="5">
              <div className="d-flex align-items-center justify-between w-100">
                <span>Custom Fields</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {customFields?.length &&
            customFields?.map((item, index) => {
              return (
                <>
                  <Row key={item?.id}>
                    <Col md={6} style={{ padding: '15px 15px 15px 15px' }}>
                      <p style={{ paddingLeft: '15px' }}>
                        {item?.field_id?.field_name}
                      </p>
                    </Col>

                    <Col
                      style={{
                        padding: '15px 15px 15px 15px',
                        backgroundColor: 'white',
                      }}
                      md={6}
                    >
                      <p>
                        {item?.field_data?.includes('"')
                          ? item?.field_data
                          : item?.field_data}
                      </p>
                    </Col>
                  </Row>
                  <hr className="p-0 m-0"></hr>
                </>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

export default CustomFieldsSection;
