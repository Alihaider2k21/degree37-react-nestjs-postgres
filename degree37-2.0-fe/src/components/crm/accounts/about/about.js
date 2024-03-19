import React from 'react';
// import moment from 'moment/moment';
import './about.scss';
import '../../../../styles/Global/Global.scss';
import '../../../../styles/Global/Variable.scss';
import ContactsSection from './contacts';
import PreferencesSection from './preferences';
import AffiliationsSection from './affiliations';
import { formatCustomDate, formatDate } from '../../../../helpers/formatDate';
import { formatUser } from '../../../../helpers/formatUser';
import CustomFieldsView from '../../../common/customeFileds/CustomFieldsView';
import {
  removeCountyWord,
  viewPhysicalAddress,
} from '../../../../helpers/utils';

function About({ accountData, isLoading, customFields }) {
  return (
    <div className="row row-gap-4 bodyMainContent aboutAccountMain">
      <div className="col-12 col-md-6">
        <table className="viewTables w-100 mt-0">
          <thead>
            <tr>
              <th colSpan="2">Account Details</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <td className="col2 no-data text-center">Data Loading</td>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className="tableTD col1">Name</td>
                <td className="tableTD col2"> {accountData?.name || 'N/A'} </td>
              </tr>
              <tr>
                <td className="tableTD col1">Alternate Name</td>
                <td className="tableTD col2">
                  {accountData?.alternate_name || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Mailing Address</td>
                <td className="tableTD col2">
                  {viewPhysicalAddress(accountData?.address)}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">County</td>
                <td className="tableTD col2">
                  {removeCountyWord(accountData?.address?.county || 'N/A')}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Website</td>
                <td className="tableTD col2 linkText">
                  <a
                    href={accountData?.website || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="linkText"
                  >
                    {accountData?.website || 'N/A'}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Facebook</td>
                <td className="tableTD col2 linkText">
                  <a
                    href={accountData?.facebook || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="linkText"
                  >
                    {accountData?.facebook || 'N/A'}
                  </a>
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <CustomFieldsView customFields={customFields} />
        <table className="viewTables w-100 mt-4">
          <thead>
            <tr>
              <th colSpan="2">Attributes</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <td className="col2 no-data text-center">Data Loading</td>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className="tableTD col1">BECS code</td>
                <td className="tableTD col2">
                  {' '}
                  {accountData?.BECS_code || 'N/A'}{' '}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Industry Category</td>
                <td className="tableTD col2">
                  {accountData?.industry_category?.name || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Industry Subcategory</td>
                <td className="tableTD col2">
                  {accountData?.industry_subcategory?.name || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Stage</td>
                <td className="tableTD col2">
                  {' '}
                  {accountData?.stage?.name || 'N/A'}{' '}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Source</td>
                <td className="tableTD col2">
                  {accountData?.source?.name || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Recruiter </td>
                <td className="tableTD col2">
                  {accountData?.recruiter?.first_name
                    ? `${accountData?.recruiter?.first_name} ${
                        accountData?.recruiter?.last_name || ''
                      }`
                    : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Territory</td>
                <td className="tableTD col2">
                  {accountData?.territory?.territory_name || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Collection Operation</td>
                <td className="tableTD col2">
                  {accountData?.collection_operation?.name || 'N/A'}
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <table className="viewTables w-100 mt-4">
          <thead>
            <tr>
              <th colSpan="2">Insights</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <td className="col2 no-data text-center">Data Loading</td>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className="tableTD col1">Status</td>
                <td className="tableTD col2">
                  {accountData?.is_active ? (
                    <span className="badge active">Active</span>
                  ) : (
                    <span className="badge inactive">Inactive</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">RSMO</td>
                <td className="tableTD col2">
                  {accountData?.RSMO ? 'Yes' : 'No'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Population</td>
                <td className="tableTD col2">
                  {accountData?.population || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Created</td>
                <td className="tableTD col2">
                  {/* {`${accountData?.created_by?.first_name} ${
                  accountData?.created_by?.last_name || ''
                } | ${moment(accountData?.created_at).format(
                  'MMM DD, YYYY'
                )} | ${moment(accountData?.created_at).format('hh:mm')}`} */}
                  {accountData?.created_at && accountData?.created_by ? (
                    <>
                      {formatUser(accountData?.created_by)}
                      {formatDate(accountData?.created_at)}
                    </>
                  ) : null}
                </td>
              </tr>
              <tr>
                <td className="tableTD col1">Modified</td>
                <td className="tableTD col2">
                  {formatUser(
                    accountData?.modified_by ?? accountData?.created_by
                  )}
                  {formatCustomDate(
                    accountData?.modified_at ?? accountData?.created_at
                  )}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className="col-12 col-md-6">
        <ContactsSection />
        <AffiliationsSection />
        <table className="viewTables w-100 mt-4">
          <thead>
            <tr>
              <th colSpan="5">
                <div className="d-flex align-items-center justify-between w-100">
                  <span>Locations</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="no-data text-sm text-center">
                No locations found
              </td>
            </tr>
          </tbody>
        </table>
        <PreferencesSection />
      </div>
    </div>
  );
}

export default About;
