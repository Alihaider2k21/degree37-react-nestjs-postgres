import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { formatDate } from '../../../helpers/formatDate';

function CustomFieldsView({ customFields }) {
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
                          ? item?.field_id?.field_data_type === '1'
                            ? formatDate(item?.field_data, 'MM-DD-YYYY')
                            : item?.field_data
                          : item?.field_id?.field_data_type === '1'
                          ? formatDate(item?.field_data, 'MM-DD-YYYY')
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

export default CustomFieldsView;
