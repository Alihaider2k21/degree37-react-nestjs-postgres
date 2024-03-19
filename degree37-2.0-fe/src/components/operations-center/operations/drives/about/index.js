import React, { useEffect, useState } from 'react';
import './about.scss';
import '../../../../../styles/Global/Global.scss';
import '../../../../../styles/Global/Variable.scss';
import EquipmentsSection from './equipments';
import CertificationsSection from './certifications';
import CustomFieldsSection from './custom_fields';
import PickupDetailsSection from './pickup_details';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import DriveContactsSection from './driveContacts';
import DriveInsightsSection from './insights';

function About({ driveData, isLoading, getDriveData, modifiedData }) {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [OEF, setOEF] = useState({
    procedure: 0,
    product: 0,
  });
  const id = useParams();
  const getStartEndTime = () => {
    driveData?.shifts?.map((item) => {
      if (startTime > item.start_time || startTime == 0) {
        let start_time = moment(item.start_time).format('hh:mm a');
        setStartTime(start_time);
      }
      if (endTime < item.end_time || endTime == 0) {
        let end_time = moment(item.end_time).format('hh:mm a');
        setEndTime(end_time);
      }
    });
  };
  useEffect(() => {
    if (driveData?.shifts?.length) {
      getStartEndTime();
    }
  }, [getStartEndTime, driveData, startTime, endTime]);

  useEffect(() => {
    let totalOEFProcedure = 0;
    let totalOEFProduct = 0;
    driveData?.shifts?.map((shift) => {
      return setOEF({
        ...OEF,
        procedure: (totalOEFProcedure += shift.oef_procedures),
        product: (totalOEFProduct += shift.oef_products),
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driveData]);

  if (isLoading) return <p className="text-center">Data Loading</p>;

  // useEffect(() => {
  //   if (driveData?.shifts?.length) {
  //     setEndTime(moment(driveData?.shifts[0]?.end_time).format('hh:mm a'));
  //     setStartTime(moment(driveData?.shifts[0]?.start_time).format('hh:mm a'));
  //   }
  // }, [getStartEndTime, driveData]);

  return (
    <div className="row row-gap-4 aboutAccountMain">
      <div className="col-12 col-md-6">
        <table className="viewTables w-100 mt-0">
          <thead>
            <tr>
              <th colSpan="2">Drive Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tableTD col1">Operation Date</td>
              <td className="tableTD col2">
                {' '}
                {`${moment(driveData?.drive?.date).format(
                  'ddd, MMM DD, YYYY'
                )}` || '-'}{' '}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Account</td>
              <td className="tableTD col2">
                <a
                  href={
                    driveData?.account?.name
                      ? `/crm/accounts/${driveData?.account?.id}/view/about`
                      : '#'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="linkText"
                >
                  {driveData?.account?.name || 'N/A'}
                </a>
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Location Name</td>
              <td className="tableTD col2">
                <a
                  href={
                    driveData?.crm_locations?.name
                      ? `/crm/locations/${driveData?.crm_locations?.id}/view`
                      : '#'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="linkText"
                >
                  {driveData?.crm_locations?.name || 'N/A'}
                </a>
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Primary Chairperson</td>
              <td className="tableTD col2">
                {driveData?.account?.account_contacts?.map((item, index) => {
                  if (
                    item?.role_id &&
                    item?.role_id?.name === 'Primary Chairperson'
                  ) {
                    return (
                      <a
                        key={index}
                        href={
                          driveData?.crm_locations?.name
                            ? `/crm/contacts/volunteers/${item?.record_id?.id}/view`
                            : '#'
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="linkText"
                      >
                        {item?.record_id?.first_name
                          ? item?.record_id?.first_name +
                            ' ' +
                            item?.record_id?.last_name
                          : 'N/A'}
                      </a>
                    );
                  }
                }) || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Chairperson Phone</td>
              <td className="tableTD col2 linkText">
                {driveData?.account?.account_contacts?.map((item, index) => {
                  const contacts = item?.record_id?.contactable_data?.filter(
                    (c) => c.contact_type >= 1 && c.contact_type <= 3
                  );
                  if (
                    item?.role_id &&
                    item?.role_id?.name === 'Primary Chairperson'
                  ) {
                    if (contacts && contacts.length) {
                      return (
                        <a
                          key={index}
                          href={`tel:+${contacts[0].data}`}
                          rel="noreferrer"
                          className="linkText"
                        >
                          {contacts[0]?.data ? contacts[0].data : 'N/A'}
                        </a>
                      );
                    }
                  }
                  return 'N/A';
                }) || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Chairperson SMS</td>
              <td className="tableTD col2 linkText">
                {driveData?.account?.account_contacts?.map((item, index) => {
                  const contacts = item?.record_id?.contactable_data?.filter(
                    (c) => c.contact_type >= 1 && c.contact_type <= 3
                  );
                  if (
                    item?.role_id &&
                    item?.role_id?.name === 'Primary Chairperson'
                  ) {
                    if (contacts && contacts.length) {
                      return (
                        <a
                          key={index}
                          href={`tel:+${contacts[0].data}`}
                          rel="noreferrer"
                          className="linkText"
                        >
                          {contacts[0]?.data ? contacts[0].data : 'N/A'}
                        </a>
                      );
                    }
                  }
                  return 'N/A';
                }) || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Chairperson Email</td>
              <td className="tableTD col2 linkText">
                {driveData?.account?.account_contacts?.map((item, index) => {
                  const emails = item?.record_id?.contactable_data?.filter(
                    (c) => c.contact_type >= 4 && c.contact_type <= 6
                  );
                  if (
                    item?.role_id &&
                    item?.role_id?.name === 'Primary Chairperson'
                  ) {
                    if (emails && emails?.length) {
                      return (
                        <a
                          key={index}
                          href={`mailto: ${emails[0].data}`}
                          rel="noreferrer"
                          className="linkText"
                        >
                          {emails?.[0]?.data ? emails[0].data : 'N/A'}
                        </a>
                      );
                    }
                  }
                  return 'N/A';
                }) || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Draw Hours</td>
              <td className="tableTD col2 linkText">
                {`${startTime} - ${endTime}`}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Projection</td>
              <td className="tableTD col2 linkText">
                {driveData?.shifts?.map((item) => {
                  return item?.shifts_projections_staff?.map((xx) => {
                    return `${xx?.procedure_type_qty}/${xx?.product_yield} `;
                  });
                })}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1 bg-white">Drive Details: OEF</td>
              <td className="tableTD col2"></td>
            </tr>
            <tr>
              <td className="tableTD col1">Procedures</td>
              <td className="tableTD col2 linkText">{OEF.procedure || '0'}</td>
            </tr>
            <tr>
              <td className="tableTD col1">Products</td>
              <td className="tableTD col2 linkText">{OEF.product || '0'}</td>
            </tr>
          </tbody>
        </table>
        <table className="viewTables w-100 mt-4">
          <thead>
            <tr>
              <th colSpan="2">Attributes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tableTD col1">Industry Category</td>
              <td className="tableTD col2">
                {driveData?.account?.industry_category?.name
                  ? driveData?.account?.industry_category?.name
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Industry Subcategory</td>
              <td className="tableTD col2">
                {driveData?.account?.industry_subcategory?.name
                  ? driveData?.account?.industry_subcategory?.name
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Stage</td>
              <td className="tableTD col2">
                {driveData?.account?.stage?.name
                  ? driveData?.account?.stage?.name
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Source</td>
              <td className="tableTD col2">
                {driveData?.account?.source?.name
                  ? driveData?.account?.source?.name
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Collection Operation</td>
              <td className="tableTD col2">
                {driveData?.account?.collection_operation?.name
                  ? driveData?.account?.collection_operation?.name
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Recruiter </td>
              <td className="tableTD col2">
                {driveData?.account?.recruiter?.first_name
                  ? driveData?.account?.recruiter?.first_name +
                    ' ' +
                    driveData?.account?.recruiter?.last_name
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Territory</td>
              <td className="tableTD col2">
                {driveData?.account?.territory?.territory_name
                  ? driveData?.account?.territory?.territory_name
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Affiliation</td>
              <td className="tableTD col2">
                {driveData?.account?.affiliations
                  ? driveData?.account?.affiliations
                      .map((item) => item.affiliation_data.name)
                      .join(', ')
                  : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>

        <DriveInsightsSection
          driveData={driveData}
          getDriveData={getDriveData}
          modifiedData={modifiedData}
        />
      </div>
      <div className="col-12 col-md-6">
        <DriveContactsSection
          driveData={driveData}
          getDriveData={getDriveData}
        />
        <EquipmentsSection driveData={driveData} getDriveData={getDriveData} />
        <CertificationsSection
          driveData={driveData}
          getDriveData={getDriveData}
        />
        <CustomFieldsSection id={id?.id} />
        <PickupDetailsSection
          driveData={driveData}
          getDriveData={getDriveData}
        />
      </div>
    </div>
  );
}

export default About;
