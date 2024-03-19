import React from 'react';
import Layout from '../../../../../components/common/layout';
import TopBar from '../../../../../components/common/topbar/index';
import SvgComponent from '../../../../../components/common/SvgComponent';
import { useParams } from 'react-router-dom';
import { formatUser } from '../../../../../helpers/formatUser';
import { fetchData } from '../../../../../helpers/Api';
import Tooltip from '../../../../../components/common/tooltip';
import { CertificationBreadCrumbsData } from './CertificationBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';
import { formatCustomDate } from '../../../../../helpers/formatDate';

export default function ViewCertification() {
  const params = useParams();
  const [certification, setCertification] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const BreadcrumbsData = [
    ...CertificationBreadCrumbsData,
    {
      label: 'Certifications',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/staffing-admin/certifications',
    },
    {
      label: 'View Certification',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/staffing-admin/certifications/${certification.id}/view`,
    },
  ];

  React.useEffect(() => {
    setIsLoading(true);
    fetchData(`/staffing-admin/certification/${params?.id}/find`, 'GET')
      .then((res) => {
        setCertification(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params]);

  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.CERTIFICATIONS.READ,
  ]) ? (
    <Layout className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Certifications'}
      />

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.CERTIFICATIONS.WRITE,
        ]) && (
          <div className="editAnchor">
            <a
              href={`/system-configuration/tenant-admin/staffing-admin/certifications/${certification.id}/edit`}
              className="text-sm"
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </a>
          </div>
        )}
        <div className="tablesContainer">
          <div className="leftTables">
            <table className="viewTables">
              <thead>
                <tr>
                  <th colSpan="2">Certification Details</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <td className="col2 no-data text-center">Data Loading</td>
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td className="col1 w-50"> Name</td>
                    <td className="col2 w-50">
                      {certification?.name ? certification.name : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1"> Short Name</td>
                    <td className="col2">
                      {certification?.short_name || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1">Description</td>
                    <td className="col2">
                      {certification?.description || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1">Assignment</td>
                    <td className="col2">
                      {certification?.assignment || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1">Association Type</td>
                    <td className="col2">
                      {certification?.association_type || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1">Expires</td>
                    <td className="col2">
                      {certification?.expires ? 'Yes' : 'No'}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1">
                      <div className="d-flex gap-1">
                        <span className="text-nowrap">Expiration Interval</span>
                        <span className="text-pre-line">
                          <Tooltip
                            text={`Expiration interval determines the number \n of months from start date that certificaiton expires`}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="col2">
                      {certification?.expiration_interval
                        ? certification.expiration_interval + ' Month'
                        : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>

            <table className="viewTables">
              <thead>
                <tr>
                  <th colSpan="2">Insights </th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <td className="col2 no-data text-center">Data Loading</td>
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td className="col1 w-50">Status</td>
                    <td className="col2 w-50">
                      {' '}
                      {certification?.is_active ? (
                        <span className="badge active"> Active </span>
                      ) : (
                        <span className="badge inactive"> Inactive </span>
                      )}{' '}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1">Created</td>
                    <td className="col2">
                      {formatUser(certification?.created_by) ?? ''}
                      {formatCustomDate(certification?.created_at) ?? ''}{' '}
                    </td>
                  </tr>
                  <tr>
                    <td className="col1">Modified</td>
                    <td className="col2">
                      {formatUser(certification?.modified_by) ?? ''}
                      {formatCustomDate(certification?.modified_at) ?? ''}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          <div className="rightTables"></div>
        </div>
      </div>
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
