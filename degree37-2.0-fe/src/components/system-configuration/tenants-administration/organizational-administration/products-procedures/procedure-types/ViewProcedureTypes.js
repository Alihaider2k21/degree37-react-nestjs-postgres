import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewProcedureTypes = () => {
  const bearerToken = localStorage.getItem('token');
  const { id } = useParams();
  const [procedureTypesData, setProcedureTypesData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        setIsLoading(true);
        const result = await fetch(`${BASE_URL}/procedure_types/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        });
        let { data, message, status } = await result.json();
        if ((result.ok || result.status === 200) & (status === 200)) {
          setProcedureTypesData(data);
          toast.success(message, { autoClose: 3000 });
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast.error('Error Fetching Procedure Types Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error getting Procedure Types Details', {
          autoClose: 3000,
        });
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
      link: `/system-configuration/tenant-admin/organization-admin/procedures-types/${id}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedure Types'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
              .PROCEDURE_TYPES.WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/procedures-types/${id}/edit`}
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
                        {procedureTypesData?.name || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Short Description</span>
                      <span className="right-data">
                        {procedureTypesData?.short_description || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Description</span>
                      <span className="right-data">
                        {procedureTypesData?.description || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Goal Type</span>
                      <span className="right-data">
                        {procedureTypesData?.is_goal_type === true
                          ? 'Yes'
                          : 'No'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">
                        Generate Online Appointments
                      </span>
                      <span className="right-data">
                        {procedureTypesData?.is_generate_online_appointments ===
                        true
                          ? 'Yes'
                          : 'No'}
                      </span>
                    </li>
                    {!(
                      procedureTypesData?.procedure_types_products?.length > 0
                    ) ? (
                      <li>
                        <span className="left-heading">Yield</span>
                        <span className="right-data">N/A</span>
                      </li>
                    ) : (
                      <>
                        <li>
                          <span className="right-data br-1">Yield</span>
                        </li>
                        {procedureTypesData?.procedure_types_products?.length
                          ? procedureTypesData?.procedure_types_products?.map(
                              (procedureTypesProduct, key) => (
                                <li key={key}>
                                  <span className="left-heading">
                                    {procedureTypesProduct?.products?.name}
                                  </span>
                                  <span className="right-data">
                                    {procedureTypesProduct?.quantity}
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
                      <span className="left-heading">Status</span>
                      <span className="right-data">
                        {procedureTypesData?.is_active ? (
                          <span className="badge active"> Active </span>
                        ) : (
                          <span className="badge inactive"> Inactive </span>
                        )}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Created</span>
                      <span className="right-data">
                        {procedureTypesData?.created_at &&
                        procedureTypesData?.created_by ? (
                          <>
                            {formatUser(procedureTypesData?.created_by)}
                            {formatDate(procedureTypesData?.created_at)}
                          </>
                        ) : null}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Modified</span>
                      <span className="right-data">
                        {procedureTypesData?.modified_at &&
                        procedureTypesData?.modified_by ? (
                          <>
                            {formatUser(procedureTypesData?.modified_by)}
                            {formatDate(procedureTypesData?.modified_at)}
                          </>
                        ) : (
                          <>
                            {formatUser(procedureTypesData?.created_by)}
                            {formatDate(procedureTypesData?.created_at)}
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

export default ViewProcedureTypes;
