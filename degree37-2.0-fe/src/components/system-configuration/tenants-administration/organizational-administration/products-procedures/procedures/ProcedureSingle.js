import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';

const ViewSingleProcedure = () => {
  const { id } = useParams();
  const [procedureData, setProcedureData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        setIsLoading(true);
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/procedures/${id}`
        );
        let { data, status } = await response.json();
        if ((response.ok || response.status === 200) & (status === 200)) {
          setProcedureData(data);
        } else {
          toast.error('Error Fetching Procedure Details', { autoClose: 3000 });
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error('Error getting Procedure Details', { autoClose: 3000 });
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  const BreadcrumbsData = [
    ...ProductsProceduresBreadCrumbsData,
    {
      label: 'View Procedure',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/organization-admin/procedures/${id}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedures'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
              .PROCEDURES.WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/procedures/${id}/edit`}
              >
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span className="text">Edit</span>
              </Link>
            </div>
          )}
          <div className="tableViewInner">
            <div className="group">
              <div className="group-head">
                <h2>Procedure Type Details</h2>
              </div>
              {isLoading ? (
                <div className="group-body">
                  <ul>
                    <li className="d-flex justify-content-center align-items-center bg-white">
                      <p className="right-data text-center m-0 py-3">
                        Data Loading
                      </p>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="group-body">
                  <ul>
                    <li>
                      <span className="left-heading">Name</span>
                      <span className="right-data">
                        {procedureData?.name || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Procedure Type</span>
                      <span className="right-data">
                        {procedureData?.procedure_type_id?.name || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Description</span>
                      <span className="right-data">
                        {procedureData?.description || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Credits</span>
                      <span className="right-data">
                        {procedureData?.credits || 'N/A'}
                      </span>
                    </li>
                    {!(procedureData?.procedure_products?.length > 0) ? (
                      <li>
                        <span className="left-heading">Yield</span>
                        <span className="right-data">N/A</span>
                      </li>
                    ) : (
                      <>
                        <li>
                          <span className="right-data br-1">Yield</span>
                        </li>
                        {procedureData?.procedure_products?.length
                          ? procedureData?.procedure_products?.map(
                              (procedure_product, key) => (
                                <li key={key}>
                                  <span className="left-heading">
                                    {procedure_product?.products?.name}
                                  </span>
                                  <span className="right-data">
                                    {procedure_product?.quantity}
                                  </span>
                                </li>
                              )
                            )
                          : ''}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="group">
              <div className="group-head">
                <h2>Insights</h2>
              </div>
              {isLoading ? (
                <div className="group-body">
                  <ul>
                    <li className="d-flex justify-content-center align-items-center bg-white">
                      <p className="right-data text-center m-0 py-3 ">
                        Data Loading
                      </p>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="group-body">
                  <ul>
                    <li>
                      <span className="left-heading">Status</span>
                      <span className="right-data">
                        {procedureData?.is_active ? (
                          <span className="badge active"> Active </span>
                        ) : (
                          <span className="badge inactive"> Inactive </span>
                        )}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Created</span>
                      <span className="right-data">
                        {procedureData?.created_at &&
                        procedureData?.created_by ? (
                          <>
                            {formatUser(procedureData?.created_by)}
                            {formatDate(procedureData?.created_at)}
                          </>
                        ) : null}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Modified</span>
                      <span className="right-data">
                        {procedureData?.modified_at &&
                        procedureData?.modified_by ? (
                          <>
                            {formatUser(procedureData?.modified_by)}
                            {formatDate(procedureData?.modified_at)}
                          </>
                        ) : (
                          <>
                            {formatUser(procedureData?.created_by)}
                            {formatDate(procedureData?.created_at)}
                          </>
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleProcedure;
